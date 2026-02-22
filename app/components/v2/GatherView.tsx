"use client";

import { useState, useEffect } from "react";
import NestedAccordion from "@/app/components/v2/NestedAccordion";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/app/components/v2/Loading";

type Question = {
    title: string;
    period?: string;
    QS?: { [key: string]: Question }[];
};

type Scenario = {
    id: string;
    title: string;
    period: string;
    root: Question;
};

export default function ProbabilitySurvey() {
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [probabilities, setProbabilities] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showThanks, setShowThanks] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/questionaire_v2.json");
                if (!res.ok) throw new Error(`خطا در لود داده‌ها - ${res.status}`);

                const data = await res.json();
                setScenarios(data.scenarios || []);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "خطای ناشناخته");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        const fetchPrevious = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

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
                console.error("خطا در لود احتمالات قبلی:", err);
            }
        };

        fetchPrevious();
    }, []);

    useEffect(() => {
        if (Object.keys(probabilities).length === 0) return;

        const timer = setTimeout(async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                await fetch("/api/probabilities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ probabilities }),
                });
            } catch (err) {
                console.error("خطا در ذخیره احتمالات:", err);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [probabilities]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-white">
                <Loading />
                <span className="ml-4">در حال بارگذاری سناریوها...</span>
            </div>
        );
    }

    if (error || scenarios.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-red-400">
                <div className="text-center p-6">
                    <p className="text-xl">خطا در بارگذاری داده‌ها</p>
                    {error && <p className="mt-3 text-sm opacity-80">{error}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="pb-32 pt-8 md:pt-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10 md:mb-14"
            >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white text-center md:text-left">
                    احتمال وقوع سناریوها – ۱۴۰۴ و بعد
                </h1>
            </motion.div>

            <div className="space-y-10">
                {scenarios.map((scenario) => (
                    <motion.section
                        key={scenario.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="border border-[#1E3A6D]/70 rounded-xl overflow-hidden bg-[#13294B]/25 shadow-xl shadow-black/30"
                    >
                        <div className="bg-gradient-to-r from-[#1E3A6D] to-[#0F2550] px-6 py-6 md:py-7 border-b border-[#2A4A8A]/60">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                {scenario.title}
                            </h2>
                            <p className="text-base text-gray-300 mt-2 opacity-90">
                                {scenario.period}
                            </p>
                        </div>

                        <NestedAccordion
                            question={scenario.root}
                            path={`Q.${scenario.id}`}
                            probabilities={probabilities}
                            setProbabilities={setProbabilities}
                            level={0}
                            showProbability={true}
                            showImpact={false}
                        />
                    </motion.section>
                ))}
            </div>

            <div className="mt-20 md:mt-28 flex justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowThanks(true)}
                    className="
            px-12 py-5 text-lg md:text-xl font-semibold
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            text-white rounded-2xl shadow-2xl hover:shadow-3xl
            transition-all duration-300 flex items-center gap-4
            border border-emerald-400/40
          "
                >
                    <span>پایان و ثبت نهایی</span>
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.button>
            </div>

            <AnimatePresence>
                {showThanks && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/75 backdrop-blur-lg flex items-center justify-center z-50 px-4"
                        onClick={() => setShowThanks(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 40 }}
                            transition={{ type: "spring", damping: 18, stiffness: 220 }}
                            className="
                bg-gradient-to-br from-slate-900 to-slate-800
                p-10 md:p-14 rounded-3xl shadow-2xl border border-slate-700/70
                text-center max-w-md sm:max-w-lg w-full
              "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-8xl mb-8">🎉🙏</div>

                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                                از شما بسیار سپاسگزاریم!
                            </h2>

                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                                پاسخ‌های ارزشمند شما با موفقیت ثبت شد.<br />
                                کمک بزرگی به درک بهتر آینده می‌کنید.
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.06 }}
                                whileTap={{ scale: 0.94 }}
                                onClick={() => setShowThanks(false)}
                                className="
                  mt-10 px-10 py-4 bg-emerald-600 hover:bg-emerald-500
                  text-white font-semibold rounded-xl text-lg
                  transition-all duration-200 shadow-lg hover:shadow-xl
                "
                            >
                                بازگشت به فرم
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}