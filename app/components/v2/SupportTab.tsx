// app/components/v2/SupportTab.tsx
"use client";

import { motion } from "framer-motion";

export default function SupportTab() {
    // ← این مقادیر رو با واقعی جایگزین کن
    const WHATSAPP_NUMBER = "989927242580"; // با کد کشور، بدون + یا 0 اول
    const BALE_WEB_LINK = "https://ble.ir/fakherstrategy"; // یا اگر بات داری: "https://ble.ir/YourSupportBot"
    const PRE_MESSAGE = "سلام، در مورد پروژه احتمال وقوع سناریوها سؤالی دارم";

    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRE_MESSAGE)}`;

    return (
        <div className="py-10 md:py-16 min-h-[70vh] flex flex-col items-center justify-center px-4">
            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-10 text-gray-100"
            >
                پشتیبانی
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-center text-gray-300 text-base md:text-lg mb-10 md:mb-16 max-w-2xl"
            >
                برای سؤال، پیشنهاد یا گزارش مشکل، می‌تونی مستقیم با تیم پشتیبانی ارتباط بگیری.
                <br className="hidden sm:block" />
                سریع‌ترین راه‌ها: واتس‌اپ یا پیام‌رسان بله
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-6 md:gap-10 w-full max-w-md md:max-w-lg">
                {/* دکمه واتس‌اپ */}
                <motion.a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="
            flex-1 flex items-center justify-center gap-3
            bg-gradient-to-r from-green-600 to-green-500
            hover:from-green-500 hover:to-green-400
            text-white font-semibold text-lg py-5 px-8
            rounded-2xl shadow-xl hover:shadow-2xl
            transition-all duration-300 border border-green-400/30
          "
                >
                    <span>واتس‌اپ پشتیبانی</span>
                </motion.a>

                {/* دکمه بله */}
                <motion.a
                    href={BALE_WEB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="
            flex-1 flex items-center justify-center gap-3
            bg-gradient-to-r from-blue-600 to-blue-500
            hover:from-blue-500 hover:to-blue-400
            text-white font-semibold text-lg py-5 px-8
            rounded-2xl shadow-xl hover:shadow-2xl
            transition-all duration-300 border border-blue-400/30
          "
                >
                    <span>پیام‌رسان بله</span>
                </motion.a>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-12 text-center text-gray-500 text-sm max-w-md"
            >
                در بله، بعد از ورود می‌تونی با جستجوی یوزرنیم یا شماره پشتیبانی با ما چت کنی.
                <br />
                پاسخگویی معمولاً در کمتر از چند ساعت (روزهای کاری)
            </motion.p>
        </div>
    );
}