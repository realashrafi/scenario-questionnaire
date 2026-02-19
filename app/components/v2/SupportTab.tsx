// app/components/v2/SupportTab.tsx
"use client";

import { motion } from "framer-motion";

export default function SupportTab() {
    const WHATSAPP_NUMBER = "989927242580";
    const BALE_WEB_LINK = "https://ble.ir/fakherstrategy";
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
                برای طرح پرسش، ارسال پیشنهاد یا گزارش مشکلات، می‌توانید از طریق کانال‌های ارتباطی زیر با واحد پشتیبانی در ارتباط باشید.
                سریع‌ترین روش‌های دریافت پاسخ، استفاده از واتساپ یا پیام‌رسان بله است.
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
            flex-1 flex items-center justify-between gap-3
            bg-gradient-to-r from-green-600 to-green-500
            hover:from-green-500 hover:to-green-400
            text-white font-semibold text-lg py-5 px-8
            rounded-2xl shadow-xl hover:shadow-2xl
            transition-all duration-300 border border-green-400/30
          "
                >
                    <span>ارتباط از طریق واتساپ</span>
                    {/* آیکون واتس‌اپ – ساده و رسمی */}
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                    >
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                    </svg>


                </motion.a>

                {/* دکمه بله */}
                <motion.a
                    href={BALE_WEB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    className="
            flex-1 flex items-center justify-between gap-3
            bg-gradient-to-r from-blue-600 to-blue-500
            hover:from-blue-500 hover:to-blue-400
            text-white font-semibold text-lg py-5 px-8
            rounded-2xl shadow-xl hover:shadow-2xl
            transition-all duration-300 border border-blue-400/30
          "
                >
                    <span>ارتباط از طریق پیام‌رسان بله</span>
                    {/* آیکون بله – ساده‌شده از لوگوی رسمی (تیک آبی معروف) */}
                   <img src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEUAuJQAuJQAuJQAuJRHcEwAuJQAuJQAuJQAuJQAuJMAuJQAtpBpzbVHxKf////x+/kAs4smvp3M7eWv49XC6d9iyrFQy2+jAAAAC3RSTlNe/80kAE+K7JsWr1xlvc8AAADpSURBVHgBhdNXFsIwEEPRka3EDdLZ/1YxTp2Uw/vVhXQRGMu5qjYOcMYL9wS5mmSIOBStAnDB45RX4C4XFLjL/gMI/4B7BimtZyr38+s1k3AL0rvJvX8iKqD2pu2Qo9ztcz1y1Qo6pKT3Zj7NGaR+aJqxU/uYkDMLaJvc1B32oSuLk7J/mmYWai8p0EyX3YkrYh3UPgOjTv28I4qHFnpHLRW00DusECcxHXdHYVRC76gzCNhEO9/OQ8yAHmtdj6R2KYAODxnOIOAhLoD2frcbYHDPHw7n/HmvSQVo1cfrAxWYE29QPv+Ke18GbRJ/56CgKgAAAABJRU5ErkJggg=='}
                        alt={'s'}/>


                </motion.a>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-12 text-center text-gray-500 text-sm max-w-md"
            >
                پاسخ‌گویی معمولاً در روزهای کاری و در کوتاه‌ترین زمان ممکن انجام می‌شود.
            </motion.p>
        </div>
    );
}