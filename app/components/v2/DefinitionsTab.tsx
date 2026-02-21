// app/components/v2/DefinitionsTab.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Scenario = {
    code: string;
    title: string;
    summary: string;
    details: string[];
    subScenarios?: SubScenario[];
};

type SubScenario = {
    code: string;
    title: string;
    impact: string;
    details: string[];
};

const scenarios: Scenario[] = [
    {
        code: "E1",
        title: "تداوم سیاست‌های گذشته (ثبات نسبی بدون پیشرفت)",
        summary: "بقا و رکود پایدار – رشد محدود، تمرکز بر بازار داخلی",
        details: [
            "ثبات نسبی در سیاست‌ها و مقررات، اما بدون پیشرفت و توسعه",
            "رشد محدود در بخش‌های اقتصادی به دلیل تحریم‌ها و کمبود سرمایه‌گذاری خارجی",
            "تداوم چالش‌های زیرساختی (دسترسی ناپایدار به اینترنت و ...) اما با قابلیت کار کردن",
            "حفظ فعالیت کسب‌وکارها با تمرکز بر بازار داخلی",
        ],
    },
    {
        code: "E2",
        title: "تغییر نظام سیاسی و حرکت به سمت تحول",
        summary: "گذار کنترل‌شده + امید و افزایش سرمایه‌گذاری",
        details: [
            "اصلاحات اقتصادی و سیاسی",
            "افزایش سرمایه‌گذاری در فناوری و زیرساخت‌ها",
            "تغییر مثبت در سیاست‌های داخلی و بین‌الملل",
            "رشد تقاضا در بازار داخلی به دلیل بهبود قدرت خرید یا گسترش تجارت الکترونیک",
            "رقابت‌پذیری بالاتر کسب‌وکارها با دسترسی به منابع جدید",
        ],
    },
    {
        code: "E3",
        title: "آشوب داخلی و حرکت به سمت فروپاشی کشور",
        summary: "افزایش نا‌آرامی‌ها + فرسایش اجتماعی و نااطمینانی عملیاتی",
        details: [
            "افزایش نا‌آرامی‌های اجتماعی و سیاسی (اعتراضات، درگیری‌های خیابانی)",
            "تشدید محدودیت‌های زیرساختی (قطعی اینترنت، مسائل امنیتی)",
            "کاهش تقاضای بازار به دلیل ناامنی یا افت قدرت خرید مردم",
        ],
    },
    {
        code: "E4",
        title: "بحران",
        summary: "شوک‌های شدید (حاد یا مزمن)",
        details: [],
        subScenarios: [
            {
                code: "E4.1",
                title: "جنگ (شامل حمله نظامی)",
                impact: "شوک حاد و کوتاه‌مدت",
                details: [
                    "اختلال کامل در زیرساخت‌ها (حمل‌ونقل، اینترنت، انرژی)",
                    "عدم وجود امنیت جانی در لایه عملیات و نیروی انسانی",
                    "کاهش تقاضا برای خدمات غیرضروری و تمرکز روی اقلام حیاتی",
                    "توقف فعالیت‌های تجاری کسب‌وکارهای غیرضروری",
                ],
            },
            {
                code: "E4.2",
                title: "توافق (پذیرش شروط بین‌الملل)",
                impact: "شوک روانی + بازتنظیم بازار",
                details: [
                    "پذیرش شروط بین‌الملل / توافق محدود",
                    "تأثیرات کوتاه‌مدت روانی بر بازار و انتظارات",
                ],
            },
            {
                code: "E4.3",
                title: "تعلیق مزمن (نه جنگ، نه توافق)",
                impact: "فرسایش تدریجی + ناامنی عملیاتی طولانی‌مدت",
                details: [
                    "تداوم وضعیت بلاتکلیفی در سیاست خارجی و داخلی بدون شوک حاد",
                    "فرسایش تدریجی زیرساخت‌ها و منابع انسانی به‌دلیل نبود سرمایه‌گذاری مؤثر",
                    "ادامه فعالیت کسب‌وکارهای ضروری و نیمه‌ضروری، حذف تدریجی کسب‌وکارهای غیرتاب‌آور",
                    "ناامنی عملیاتی در سطح نیروی انسانی (مهاجرت، بی‌انگیزگی، خروج خاموش نیروهای کلیدی)",
                ],
            },
        ],
    },
];


const tutorialVideos = [
    {
        title: "ضرورت موضوع و تعاریف",
        description: "مروری بر اهمیت موضوع، تحلیل سناریوها و تعریف چارچوب تصمیم‌سازی.",
        videoUrl: "https://kb.studionona.ir/index.php/s/7pDpkPqQ55MjnPm/download",
        poster:'https://kb.studionona.ir/index.php/s/dYYNbmDkeEYBMgw/download'
    },
    {
        title: "چگونگی کار با سیستم",
        description: "آموزش نحوه امتیازدهی، تعیین شدت اثر و روند سناریوها",
        videoUrl: "https://kb.studionona.ir/index.php/s/WGpmHAyosiXJCMY/download", // ← جایگزین کن
        poster:'https://kb.studionona.ir/index.php/s/doRcZPsNRtmYQZr/download'
    },
    // {
    //     title: "Sequence 03 – تحلیل و مقایسه سناریوها",
    //     description: "چگونگی بررسی تأثیر هر سناریو بر کسب‌وکار و تصمیم‌گیری",
    //     videoUrl: "https://kb.studionona.ir/index.php/s/Agyr4AermXNF8xD/download",
    //     poster:''
    // },
    // {
    //     title: "Sequence 04 – بروزرسانی و پیگیری سناریوها",
    //     description: "نکات مهم برای نگهداری و به‌روزرسانی داده‌ها در طول زمان",
    //     videoUrl: "https://kb.studionona.ir/index.php/s/Agyr4AermXNF8xD/download",
    //     poster:''
    // },

];

export default function DefinitionsTab() {
    const [openScenario, setOpenScenario] = useState<string | null>(null);

    const toggleScenario = (code: string) => {
        setOpenScenario(openScenario === code ? null : code);
    };

    return (
        <div className="py-6 md:py-10">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-100"
            >
                تعاریف سناریوهای کلان – ۱۴۰۴ و بعد
            </motion.h1>

            <div className="space-y-6 max-w-4xl mx-auto">
                {scenarios.map((scenario) => (
                    <motion.div
                        key={scenario.code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`
              border border-[#1E3A6D] rounded-xl overflow-hidden
              bg-[#13294B]/30 backdrop-blur-sm shadow-xl shadow-black/20
            `}
                    >
                        <button
                            onClick={() => toggleScenario(scenario.code)}
                            className={`
                w-full px-6 py-5 flex text-right items-center justify-between
                transition-colors ${openScenario === scenario.code ? "bg-[#FF6B00]/10" : "hover:bg-black/20"}
              `}
                        >
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-[#FFDBB5]">
                                    {scenario.code} – {scenario.title}
                                </h2>
                                <p className="text-gray-400 mt-1.5">{scenario.summary}</p>
                            </div>
                            <span className="text-2xl text-[#FF6B00] transition-transform">
                {openScenario === scenario.code ? "▲" : "▼"}
              </span>
                        </button>

                        <AnimatePresence>
                            {openScenario === scenario.code && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-6 pt-2 border-t border-[#1E3A6D]/50">
                                        {/* جزئیات اصلی */}
                                        {scenario.details.length > 0 && (
                                            <ul className="list-disc list-inside space-y-2.5 text-gray-300 mb-6">
                                                {scenario.details.map((item, i) => (
                                                    <li key={i} className="text-base leading-relaxed">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* زیرسناریوها (مثل E4.x) */}
                                        {scenario.subScenarios && (
                                            <div className="mt-6 space-y-4">
                                                <h3 className="text-lg font-semibold text-[#FFAA66] mb-4 border-b border-[#FF6B00]/30 pb-2">
                                                    زیرسناریوهای بحران
                                                </h3>
                                                {scenario.subScenarios.map((sub) => (
                                                    <div
                                                        key={sub.code}
                                                        className="bg-black/20 rounded-lg p-5 border border-[#1E3A6D]/70"
                                                    >
                                                        <h4 className="text-base md:text-lg font-bold text-white mb-2">
                                                            {sub.code} – {sub.title}
                                                        </h4>
                                                        <p className="text-[#FFDBB5]/90 mb-3 italic">{sub.impact}</p>
                                                        <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm md:text-base">
                                                            {sub.details.map((item, i) => (
                                                                <li key={i}>{item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm">
                این تعاریف بر اساس تحلیل محیط کلان تهیه شده و ممکن است با تحولات واقعی تغییر کند.
            </div>
            <div className="mt-16 max-w-5xl mx-auto">
                <div className="mt-16 max-w-5xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl md:text-2xl font-bold text-center mb-10 text-gray-100"
                    >
                        ویدیوهای آموزشی کار با سیستم
                    </motion.h2>

                    <div className="space-y-8">
                        {tutorialVideos.map((video, index) => (
                            <motion.div
                                key={index} // یا اگر id منحصر به فرد داری از اون استفاده کن
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-[#13294B]/40 backdrop-blur-sm border border-[#1E3A6D]/60 rounded-2xl overflow-hidden shadow-2xl shadow-black/30"
                            >
                                <div className="p-5 md:p-6 border-b border-[#1E3A6D]/50">
                                    <h3 className="text-xl font-semibold text-[#FFDBB5] mb-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm md:text-base">
                                        {video.description}
                                    </p>
                                </div>

                                <div className="px-4 py-4 md:px-6 md:py-6">
                                    <video
                                        controls
                                        preload="metadata"
                                        className="w-full rounded-lg shadow-inner"
                                        poster={video.poster}
                                    >
                                        <source src={video.videoUrl} type="video/mp4" />
                                        مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند. می‌توانید فایل را از
                                        <a
                                            href={video.videoUrl.replace("/download", "")} // لینک صفحه share
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FF6B00] hover:underline mx-1"
                                        >
                                            اینجا
                                        </a>
                                        دانلود کنید.
                                    </video>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}