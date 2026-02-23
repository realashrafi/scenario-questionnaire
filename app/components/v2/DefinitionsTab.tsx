// app/components/v2/DefinitionsTab.tsx
"use client";

import { useState } from "react";
import {motion, AnimatePresence, LayoutGroup, Transition, Variants} from "framer-motion";
import { ChevronDown } from "lucide-react";

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
        videoUrl: "https://kb.studionona.ir/index.php/s/nmSAtWA7kZKiGWa/download",
        poster: "https://kb.studionona.ir/index.php/s/dYYNbmDkeEYBMgw/download",
    },
    {
        title: "چگونگی کار با سیستم",
        description: "آموزش نحوه امتیازدهی، تعیین شدت اثر و روند سناریوها",
        videoUrl: "https://kb.studionona.ir/index.php/s/zYCsTnRK9TQLEYE/download",
        poster: "https://kb.studionona.ir/index.php/s/doRcZPsNRtmYQZr/download",
    },
    {
        title: "نتایج",
        description: "نمایش تحلیل نهایی مسیرها و سناریوهای محتمل، پرریسک و فرصت‌ساز",
        videoUrl: "https://kb.studionona.ir/index.php/s/3cNo9cZH5t28rEY/download",
        poster: "https://kb.studionona.ir/index.php/s/2KpewCKGR5THKys/download",
    },
    {
        title: "ثبت نظر و پشتیبانی",
        description: "ارسال پیشنهادات و ارتباط با تیم پشتیبانی از طریق پیام‌رسان‌ها",
        videoUrl: "https://kb.studionona.ir/index.php/s/jJr7weNtBAbMN6B/download",
        poster: "https://kb.studionona.ir/index.php/s/k7aM2H9E6Wwyszj/download",
    },
];

export default function DefinitionsTab() {
    const [openScenario, setOpenScenario] = useState<string | null>(null);

    const toggleScenario = (code: string) => {
        setOpenScenario(openScenario === code ? null : code);
    };

    const springTransition: Transition = {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6,
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: springTransition,
        },
    };

    const contentSpring: Transition = {
        type: "spring",
        stiffness: 140,
        damping: 18,
        duration: 0.55,
    };

    const contentVariants: Variants = {
        collapsed: { height: 0, opacity: 0 },
        open: {
            height: "auto",
            opacity: 1,
            transition: contentSpring,
        },
    };

    return (
        <div className="py-8 md:py-12 lg:py-16 min-h-screen">
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 14 }}
                className="text-3xl md:text-4xl font-extrabold text-center mb-12 md:mb-16 bg-gradient-to-r from-[#FFDBB5] to-[#FFAA66] bg-clip-text text-transparent tracking-tight"
            >
                تعاریف سناریوهای کلان – ۱۴۰۴ و بعد
            </motion.h1>

            <LayoutGroup>
                <div className="space-y-4 md:space-y-6 max-w-4xl lg:max-w-5xl mx-auto px- sm:px-6">
                    {scenarios.map((scenario) => (
                        <motion.div
                            key={scenario.code}
                            layout
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            className={`
                group relative rounded-2xl overflow-hidden
                bg-blue-500/5 backdrop-blur-xl border border-blue-600/20 
                shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.08)]
                transition-all duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]
              `}
                        >
                            <button
                                onClick={() => toggleScenario(scenario.code)}
                                className={`
                  w-full px-6 py-6 md:py-7 flex items-center justify-between text-right
                  transition-all duration-300
                  ${openScenario === scenario.code
                                    ? "bg-gradient-to-r from-[#FF6B00]/20 to-[#FFAA66]/10"
                                    : "hover:bg-white/5 group-hover:bg-white/5"}
                `}
                            >
                                <div className="space-y-1.5">
                                    <h2 className="text-xl md:text-2xl font-bold text-[#FFDBB5] group-hover:text-[#FFEBCC] transition-colors">
                                        {scenario.code} – {scenario.title}
                                    </h2>
                                    <p className="text-gray-400/90 group-hover:text-gray-300 transition-colors">
                                        {scenario.summary}
                                    </p>
                                </div>

                                <motion.div
                                    animate={{ rotate: openScenario === scenario.code ? 180 : 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="text-[#FF6B00] text-3xl flex-shrink-0"
                                >
                                    <ChevronDown className="w-8 h-8" />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {openScenario === scenario.code && (
                                    <motion.div
                                        layout
                                        variants={contentVariants}
                                        initial="collapsed"
                                        animate="open"
                                        exit="collapsed"
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-7 pt-4 border-t border-white/5">
                                            {scenario.details.length > 0 && (
                                                <ul className="space-y-3 text-gray-200/90 text-[15px] md:text-base leading-relaxed marker:text-[#FF6B00]/70 list-disc list-inside">
                                                    {scenario.details.map((item, i) => (
                                                        <li key={i} className="pl-2">
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {scenario.subScenarios && (
                                                <div className="mt-8">
                                                    <h3 className="text-lg font-semibold text-[#FFAA66] mb-5 pb-2 border-b border-[#FF6B00]/20">
                                                        زیرسناریوهای بحران
                                                    </h3>
                                                    <div className="space-y-5">
                                                        {scenario.subScenarios.map((sub) => (
                                                            <div
                                                                key={sub.code}
                                                                className={`
                                  rounded-xl p-5 md:p-6
                                  bg-black/20 border border-white/5
                                  backdrop-blur-sm shadow-inner
                                `}
                                                            >
                                                                <h4 className="text-base md:text-lg font-bold text-white mb-2.5">
                                                                    {sub.code} – {sub.title}
                                                                </h4>
                                                                <p className="text-[#FFDBB5]/80 mb-4 italic text-sm md:text-base">
                                                                    {sub.impact}
                                                                </p>
                                                                <ul className="space-y-2.5 text-gray-300/90 text-sm md:text-base list-disc list-inside marker:text-gray-500">
                                                                    {sub.details.map((item, i) => (
                                                                        <li key={i}>{item}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </LayoutGroup>

            <p className="mt-10 text-center text-gray-500/70 text-sm">
                این تعاریف بر اساس تحلیل محیط کلان تهیه شده و ممکن است با تحولات واقعی تغییر کند.
            </p>

            {/* بخش ویدیوها */}
            <div className="mt-20 md:mt-28 max-w-5xl mx-auto sm:px-6">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 80 }}
                    className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-100"
                >
                    ویدیوهای آموزشی کار با سیستم
                </motion.h2>

                <div className="space-y-8 md:space-y-10">
                    {tutorialVideos.map((video, index) => (
                        <motion.div
                            key={video.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.6, delay: index * 0.12, type: "spring" }}
                            className={`
                rounded-2xl overflow-hidden
                bg-blue-500/5 backdrop-blur-xl border border-blue-600/20 
                shadow-[0_10px_40px_rgba(0,0,0,0.3)]
                hover:shadow-[0_20px_70px_rgba(0,0,0,0.4)] transition-shadow duration-500
              `}
                        >
                            <div className="p-6 md:p-7 border-b border-white/5">
                                <h3 className="text-xl md:text-2xl font-semibold text-[#FFDBB5] mb-2">
                                    {video.title}
                                </h3>
                                <p className="text-gray-400/90 text-sm md:text-base">
                                    {video.description}
                                </p>
                            </div>

                            <div className="p-4 md:p-6">
                                <video
                                    controls
                                    preload="metadata"
                                    className="w-full rounded-xl shadow-2xl ring-1 ring-black/40"
                                    poster={video.poster}
                                >
                                    <source src={video.videoUrl} type="video/mp4" />
                                    مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند. می‌توانید فایل را از{" "}
                                    <a
                                        href={video.videoUrl.replace("/download", "")}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#FF8A3C] hover:text-[#FFA66B] underline underline-offset-2 transition-colors"
                                    >
                                        اینجا
                                    </a>{" "}
                                    دانلود کنید.
                                </video>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}