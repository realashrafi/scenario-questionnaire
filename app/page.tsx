"use client";

import {useState, useEffect} from "react";
import NestedAccordion from "@/app/components/v2/NestedAccordion";
import {motion, AnimatePresence} from "framer-motion";
import AuthForm from "@/app/components/v2/AuthForm";
import Header from "@/app/components/Header";
import LightRays from "@/app/components/v2/LightRays";

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
    const [authChecked, setAuthChecked] = useState(false);
    const [showThanks, setShowThanks] = useState(false); // برای نمایش پیام تشکر

    // چک کردن وضعیت لاگین
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
            setAuthChecked(true);
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
    }, []);

    // لود داده‌های سوال‌ها
    useEffect(() => {
        if (!isAuthenticated || !authChecked) return;

        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/questionaire_v2.json");
                if (!res.ok) throw new Error(`خطا در لود داده‌ها - ${res.status}`);

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

    // لود احتمالات قبلی از سرور
    useEffect(() => {
        if (!isAuthenticated || !authChecked) return;

        const fetchPrevious = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/probabilities", {
                    headers: {Authorization: `Bearer ${token}`},
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

    // ذخیره خودکار احتمالات (debounce 2 ثانیه)
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
                    body: JSON.stringify({probabilities}),
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
            <div className="min-h-screen relative bg-[#0A1F44] flex items-center justify-center px-4">
                <div className={'fixed left-0 !w-screen !h-screen '}>
                    <LightRays
                        raysOrigin="bottom-center"
                        raysColor="#FF6B00"
                        raysSpeed={0.5}
                        lightSpread={0.5}
                        rayLength={10}
                        followMouse={true}
                        mouseInfluence={0.1}
                        noiseAmount={0}
                        distortion={0}
                        className="custom-rays"
                        pulsating={false}
                        fadeDistance={2}
                        saturation={1}
                    />
                </div>
                <AuthForm/>
            </div>
        );
    }

    // در حال لود
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
        <div className={'min-h-screen relative bg-[#0A1F44]'}>
            <div className={'fixed left-0 !w-screen !h-screen '}>
                <LightRays
                    raysOrigin="bottom-center"
                    raysColor="#FF6B00"
                    raysSpeed={0.5}
                    lightSpread={0.5}
                    rayLength={10}
                    followMouse={true}
                    mouseInfluence={0.1}
                    noiseAmount={0}
                    distortion={0}
                    className="custom-rays"
                    pulsating={false}
                    fadeDistance={2}
                    saturation={1}
                />
            </div>
            <div className=" text-gray-100 pb-32 pt-24 px-4 md:px-6 relative">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6}}
                        className="flex justify-between items-center mb-10"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            احتمال وقوع سناریوها – ۱۴۰۴ و بعد
                        </h1>
                        <button
                            onClick={() => {
                                localStorage.removeItem("token");
                                setIsAuthenticated(false);
                            }}
                            className="text-[#FF6B00] hover:underline text-sm"
                        >
                            خروج
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.6, delay: 0.2}}
                        className="border border-[#1E3A6D] rounded-xl overflow-hidden bg-[#13294B]/20 shadow-2xl shadow-black/30"
                    >
                        <NestedAccordion
                            question={rootQuestion}
                            path="Q"
                            probabilities={probabilities}
                            setProbabilities={setProbabilities}
                        />
                    </motion.div>
                </div>

                {/* دکمه ثبت نهایی - فقط یک دکمه در پایین صفحه */}
                <div className="mt-20 flex justify-center px-4 z-20 pointer-events-none">
                    <motion.button
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        onClick={() => setShowThanks(true)}
                        className="
            pointer-events-auto px-10 py-4 text-base md:text-lg font-semibold
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            text-white rounded-xl shadow-xl hover:shadow-2xl
            transition-all duration-300
            flex items-center gap-3 border border-emerald-400/30
          "
                    >
                        <span>پایان و ثبت نهایی</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                    </motion.button>
                </div>

                {/* پیام تشکر با انیمیشن Framer Motion */}
                <AnimatePresence>
                    {showThanks && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.4}}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4"
                            onClick={() => setShowThanks(false)}
                        >
                            <motion.div
                                initial={{scale: 0.85, opacity: 0, y: 30}}
                                animate={{scale: 1, opacity: 1, y: 0}}
                                exit={{scale: 0.85, opacity: 0, y: 30}}
                                transition={{type: "spring", damping: 15, stiffness: 200}}
                                className="
                bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
                p-8 md:p-12 rounded-2xl shadow-2xl border border-slate-700/60
                text-center max-w-lg w-full
              "
                                onClick={(e) => e.stopPropagation()}
                            >
                                <motion.div
                                    initial={{y: -30, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 0.2, duration: 0.6}}
                                    className="text-7xl mb-6"
                                >
                                    🎉🙏
                                </motion.div>

                                <motion.h2
                                    initial={{y: 20, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 0.3}}
                                    className="text-2xl md:text-3xl font-bold text-white mb-4"
                                >
                                    از شما بسیار سپاسگزاریم!
                                </motion.h2>

                                <motion.p
                                    initial={{y: 20, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{delay: 0.4}}
                                    className="text-gray-300 text-lg md:text-xl leading-relaxed"
                                >
                                    نظرات ارزشمند شما با موفقیت ثبت شد.
                                    <br/>
                                    مشارکت شما به درک بهتر آینده کمک بزرگی می‌کند.
                                </motion.p>

                                <motion.button
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.96}}
                                    onClick={() => setShowThanks(false)}
                                    className="
                  mt-8 px-8 py-3 bg-emerald-600 hover:bg-emerald-500
                  text-white font-medium rounded-lg text-base
                  transition-colors duration-200 shadow-md hover:shadow-lg
                "
                                >
                                    بازگشت به فرم
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}