"use client";

import { useState, useEffect } from "react";
import NestedAccordion from "@/app/components/v2/NestedAccordion";
import { motion } from "framer-motion";
import AuthForm from "@/app/components/v2/AuthForm";
import Header from "@/app/components/Header";

type Question = {
    title: string;
    period?: string;
    QS?: { [key: string]: Question }[];
};

export default function ProbabilitySurvey() {
    const [rootQuestion, setRootQuestion] = useState<Question | null>(null);
    const [probabilities, setProbabilities] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false); // ← این جدید

    // چک کردن وضعیت لاگین (هر بار که صفحه mount می‌شه یا بعد از لاگین)
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
            setAuthChecked(true);
        };

        checkAuth();

        // اگر بعداً از context یا event استفاده کردی، می‌تونی listener بذاری
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    // لود داده‌ها فقط وقتی کاربر لاگین باشه
    useEffect(() => {
        if (!isAuthenticated || !authChecked) return;

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/questionaire_v2.json");

                if (!res.ok) {
                    throw new Error(`خطا در لود داده‌ها - ${res.status}`);
                }

                const data = await res.json();
                setRootQuestion(data.Q);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : "خطای ناشناخته");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [isAuthenticated, authChecked]);

    // لود احتمالات قبلی
    useEffect(() => {
        if (!isAuthenticated || !authChecked) return;

        const fetchPrevious = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/probabilities", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.probabilities) {
                        setProbabilities(data.probabilities);
                    }
                }
            } catch (err) {
                console.error("خطا در لود احتمالات:", err);
            }
        };

        fetchPrevious();
    }, [isAuthenticated, authChecked]);

    // ذخیره خودکار احتمالات
    useEffect(() => {
        if (!isAuthenticated || Object.keys(probabilities).length === 0) return;

        const timer = setTimeout(async () => {
            try {
                const token = localStorage.getItem("token");
                await fetch("/api/probabilities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ probabilities }),
                });
            } catch (err) {
                console.error("خطا در ذخیره:", err);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [probabilities, isAuthenticated]);

    // اگر هنوز چک لاگین تمام نشده
    if (!authChecked) {
        return (
            <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center text-white">
                در حال بررسی وضعیت ورود...
            </div>
        );
    }

    // اگر لاگین نیست → فرم لاگین
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center px-4">
                <AuthForm />
            </div>
        );
    }

    // اگر در حال لود داده‌هاست
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center text-white">
                در حال بارگذاری سناریوها...
            </div>
        );
    }

    if (error || !rootQuestion) {
        return (
            <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center text-red-400">
                <div className="text-center">
                    <p>خطا در بارگذاری داده‌ها</p>
                    {error && <p className="text-sm mt-2">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A1F44] text-gray-100 py-10 px-4 md:px-6 pt-24">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex justify-between items-center mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        احتمال وقوع سناریوها – ۱۴۰۴ و بعد
                    </h1>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            setIsAuthenticated(false); // ← مهم! این خط فرم رو برمی‌گردونه
                            // یا router.push("/auth") اگر صفحه جدا می‌خوای
                        }}
                        className="text-[#FF6B00] hover:underline text-sm"
                    >
                        خروج
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="border border-[#1E3A6D] rounded-xl overflow-hidden bg-[#13294B] shadow-2xl shadow-black/30"
                >
                    <NestedAccordion
                        question={rootQuestion}
                        path="Q"
                        probabilities={probabilities}
                        setProbabilities={setProbabilities}
                    />
                </motion.div>

                {/* نمایش پاسخ‌ها */}
          {/*      <motion.div*/}
          {/*          initial={{ opacity: 0 }}*/}
          {/*          animate={{ opacity: 1 }}*/}
          {/*          transition={{ delay: 0.4, duration: 0.6 }}*/}
          {/*          className="mt-10 p-6 bg-[#13294B]/80 backdrop-blur-sm rounded-xl border border-[#1E3A6D]"*/}
          {/*      >*/}
          {/*          <h3 className="text-lg font-semibold mb-4 text-[#FF6B00]">پاسخ‌های فعلی شما:</h3>*/}
          {/*          <pre className="text-sm bg-[#0A1F44]/70 p-5 rounded-lg overflow-auto max-h-80 border border-[#1E3A6D] font-mono whitespace-pre-wrap">*/}
          {/*  {JSON.stringify(probabilities, null, 2)}*/}
          {/*</pre>*/}
          {/*      </motion.div>*/}
            </div>
        </div>
    );
}