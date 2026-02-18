// app/components/v2/ResultsTab.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Row = {
    trigger: string;
    gain: string;
    risk: string;
    prob: string;
};

type ResultsData = {
    count: number;
    mq1: number;
    mq2: number;
    mq3: number;
    war_prob: string;
    war_risk: string;
    war_gain: string;
    agree_prob: string;
    agree_risk: string;
    agree_gain: string;
    uk_prob: string;
    uk_risk: string;
    uk_gain: string;
};

export default function ResultsTab() {
    const [data, setData] = useState<ResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("لطفاً وارد شوید");

                const res = await fetch("/api/results", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    throw new Error(res.status === 401 ? "توکن نامعتبر" : "خطا در دریافت داده‌ها");
                }

                const json = await res.json();
                if (!json.success) throw new Error(json.error || "داده نامعتبر");

                setData(json.data);
            } catch (err: any) {
                setError(err.message || "خطای سرور");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-gray-300">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B00] mx-auto mb-4"></div>
                    <p>در حال بارگذاری نتایج...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-400 text-center px-6">
                <div>
                    <p className="text-xl mb-3">خطا در بارگذاری نتایج</p>
                    <p className="text-sm">{error || "داده‌ای یافت نشد"}</p>
                </div>
            </div>
        );
    }

    const rows: Row[] = [
        {
            trigger: `جنگ (${data.mq1})`,
            gain: data.war_gain,
            risk: data.war_risk,
            prob: data.war_prob,
        },
        {
            trigger: `توافق (${data.mq2})`,
            gain: data.agree_gain,
            risk: data.agree_risk,
            prob: data.agree_prob,
        },
        {
            trigger: `تعلیق مزمن (${data.mq3})`,
            gain: data.uk_gain,
            risk: data.uk_risk,
            prob: data.uk_prob,
        },
    ];

    return (
        <div className="py-6 md:py-10 px-4 sm:px-6 max-w-4xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-10 text-gray-100 tracking-tight"
            >
                نتایج نظرات خبرگان – ۱۴۰۵
            </motion.h1>

            {/* تعداد کل نظرات */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-8 md:mb-12"
            >
                <div className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#0A1F44]/70 border border-[#1E3A6D]/60 rounded-2xl shadow-lg">
                    <span className="text-base sm:text-lg text-gray-300">تعداد نظرات ثبت‌شده:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-[#FF6B00]">{data.count}</span>
                </div>
            </motion.div>

            {/* کارت‌های عمودی */}
            <div className="space-y-5 md:space-y-6">
                {rows.map((row, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 * index + 0.3, duration: 0.5 }}
                        className="
              bg-[#13294B]/40 backdrop-blur-md
              border border-[#1E3A6D]/60 rounded-2xl
              overflow-hidden shadow-xl
            "
                    >
                        {/* هدر کارت – تریگر */}
                        <div className="bg-[#0A1F44]/70 px-5 py-4 text-center font-medium text-gray-200 border-b border-[#1E3A6D]/50 text-base sm:text-lg">
                            تریگر: {row.trigger}
                        </div>

                        {/* بدنه کارت – اطلاعات اصلی */}
                        <div className="divide-y divide-[#1E3A6D]/40 sm:divide-y-0 sm:grid sm:grid-cols-2">
                            {/* فرصت‌سازترین */}
                            <div className="p-5 sm:p-6 text-center border-b sm:border-b-0 sm:border-r border-[#1E3A6D]/50">
                                <div className="text-sm text-gray-400 mb-2">فرصت‌سازترین</div>
                                <div className="text-green-300/90 font-medium text-base sm:text-lg leading-relaxed break-words">
                                    {row.gain}
                                </div>
                            </div>

                            {/* پرریسک‌ترین */}
                            <div className="p-5 sm:p-6 text-center border-b sm:border-b-0 border-[#1E3A6D]/50">
                                <div className="text-sm text-gray-400 mb-2">پرریسک‌ترین</div>
                                <div className="text-red-300/90 font-medium text-base sm:text-lg leading-relaxed break-words">
                                    {row.risk}
                                </div>
                            </div>

                            {/* محتمل‌ترین */}
                            <div className="p-5 sm:p-6 text-center sm:border-r border-[#1E3A6D]/50">
                                <div className="text-sm text-gray-400 mb-2">محتمل‌ترین</div>
                                <div className="text-blue-300/90 font-medium text-base sm:text-lg leading-relaxed break-words">
                                    {row.prob}
                                </div>
                            </div>

                            {/* تریگر – فقط روی موبایل نمایش داده می‌شود تا تقارن حفظ شود */}
                            {/*<div className="p-5 sm:p-6 text-center sm:hidden">*/}
                            {/*    <div className="text-sm text-gray-400 mb-2">تریگر</div>*/}
                            {/*    <div className="text-gray-200 font-medium text-base">{row.trigger}</div>*/}
                            {/*</div>*/}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* توضیح پایین صفحه */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-center text-gray-500 text-sm mt-10 md:mt-12 px-4"
            >
                این نتایج بر اساس {data.count} نظر ثبت‌شده تا کنون محاسبه شده است.
                <br className="sm:hidden mt-2" />
                (داده‌ها ممکن است با ثبت نظرات جدید به‌روزرسانی شوند)
            </motion.p>
        </div>
    );
}