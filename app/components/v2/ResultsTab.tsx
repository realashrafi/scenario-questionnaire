"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "@/app/components/v2/Loading";

type DescItem = {
    chain: string;
    desc: string; // پیامدها + فرصت‌ها به صورت متن خام
};

type TriggerData = {
    prob: DescItem;
    risk: DescItem;
    gain: DescItem;
};

type Category = {
    name: string;
    war: TriggerData;
    agree: TriggerData;
    uk: TriggerData;
};

type ResultsData = {
    count: number;
    mq1: number; // درصد جنگ
    mq2: number; // درصد توافق
    mq3: number; // درصد تعلیق
    categories: Category[];
};

export default function ResultsTab() {
    const [data, setData] = useState<ResultsData | null>(null);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
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
                    <Loading />
                    <p className="mt-4">در حال بارگذاری نتایج</p>
                </div>
            </div>
        );
    }

    if (error || !data || data.categories.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-400 text-center px-6">
                <div>
                    <p className="text-xl mb-3">خطا در بارگذاری نتایج</p>
                    <p className="text-sm">{error || "داده‌ای یافت نشد"}</p>
                </div>
            </div>
        );
    }

    const currentCategory = data.categories[selectedCategoryIndex];

    const rows = [
        {
            trigger: `جنگ (${data.mq1}%)`,
            prob: currentCategory.war.prob,
            risk: currentCategory.war.risk,
            gain: currentCategory.war.gain,
        },
        {
            trigger: `توافق (${data.mq2}%)`,
            prob: currentCategory.agree.prob,
            risk: currentCategory.agree.risk,
            gain: currentCategory.agree.gain,
        },
        {
            trigger: `تعلیق مزمن (${data.mq3}%)`,
            prob: currentCategory.uk.prob,
            risk: currentCategory.uk.risk,
            gain: currentCategory.uk.gain,
        },
    ];

    const today = new Date();
    const persianDate = today.toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="py-6 md:py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 md:mb-10 text-gray-100 tracking-tight"
            >
                نتایج نظرات خبرگان
                <br />
                <span className="text-sm md:text-base text-gray-400 mt-2 block">
          تاریخ بروزرسانی: {'28 بهمن 1404'}
        </span>
            </motion.h1>

            {/* تعداد نظرات */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#0A1F44]/70 border border-[#1E3A6D]/60 rounded-2xl shadow-lg w-full max-w-md mx-auto justify-between">
                    <span className="text-base sm:text-lg text-gray-300">تعداد نظرات ثبت‌شده:</span>
                    <span className="text-3xl font-bold text-[#FF6B00]">{data.count}</span>
                </div>
            </motion.div>

            {/* انتخاب دسته‌بندی */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mb-8 text-center"
            >
                <label className="block text-gray-300 mb-2 text-lg">دسته‌بندی کسب‌وکار:</label>
                <select
                    value={selectedCategoryIndex}
                    onChange={(e) => setSelectedCategoryIndex(Number(e.target.value))}
                    className="w-full max-w-lg mx-auto px-5 py-3 bg-[#0A1F44]/80 border border-[#1E3A6D]/70 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50 shadow-md"
                >
                    {data.categories.map((cat, idx) => (
                        <option key={idx} value={idx}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </motion.div>

            {/* بازه زمانی */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-center mb-10"
            >
                <div className="inline-flex items-center gap-4 px-6 py-3 text-sm bg-[#0A1F44]/70 border border-[#1E3A6D]/60 rounded-2xl shadow-lg">
                    <span>بهمن و اسفند ۱۴۰۴</span>
                    <span className="text-nowrap rotate-180">→</span>
                    <span>۳ ماه اول ۱۴۰۵</span>
                    <span className="text-nowrap rotate-180">→</span>
                    <span>۳ ماه دوم ۱۴۰۵</span>
                </div>
            </motion.div>

            {/* کارت‌ها */}
            <div className="space-y-6 md:space-y-8">
                {rows.map((row, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 * index + 0.4, duration: 0.6 }}
                        className="bg-[#13294B]/50 backdrop-blur-md border border-[#1E3A6D]/60 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="bg-[#0A1F44]/80 px-6 py-4 text-center font-semibold text-gray-100 border-b border-[#1E3A6D]/50 text-lg md:text-xl">
                            تریگر: {row.trigger}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y divide-[#1E3A6D]/50 sm:divide-y-0 sm:divide-x">
                            {/* فرصت‌سازترین */}
                            <div className="p-6 text-center">
                                <div className="text-sm text-gray-400 mb-3 font-medium">فرصت‌سازترین</div>
                                <div className="text-green-300/90 font-semibold text-lg leading-relaxed mb-3">
                                    {row.gain.chain}
                                </div>
                                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {row.gain.desc || "اطلاعات تکمیلی موجود نیست."}
                                </div>
                            </div>

                            {/* پرریسک‌ترین */}
                            <div className="p-6 text-center border-t sm:border-t-0">
                                <div className="text-sm text-gray-400 mb-3 font-medium">پرریسک‌ترین</div>
                                <div className="text-red-300/90 font-semibold text-lg leading-relaxed mb-3">
                                    {row.risk.chain}
                                </div>
                                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {row.risk.desc || "اطلاعات تکمیلی موجود نیست."}
                                </div>
                            </div>

                            {/* محتمل‌ترین */}
                            <div className="p-6 text-center border-t sm:border-t-0">
                                <div className="text-sm text-gray-400 mb-3 font-medium">محتمل‌ترین</div>
                                <div className="text-blue-300/90 font-semibold text-lg leading-relaxed mb-3">
                                    {row.prob.chain}
                                </div>
                                <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                                    {row.prob.desc || "اطلاعات تکمیلی موجود نیست."}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center text-gray-500 text-sm mt-12 px-4"
            >
                این نتایج بر اساس {data.count} نظر ثبت‌شده تا کنون محاسبه شده است.
                <br className="sm:hidden mt-2" />
                (نتایج با ثبت نظرات جدید هر دو هفته به‌روزرسانی می‌شود)
            </motion.p>
        </div>
    );
}