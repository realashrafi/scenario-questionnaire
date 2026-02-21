"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {LogOut} from "lucide-react";


export default function TechLabResponsiveHeader({
                                                    activeTab,
                                                    setActiveTab,
                                                    handleLogout,
                                                    tabs,
                                                }: any) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* ────────────────────────────────
          هدر دسکتاپ – دقیقاً همان کد قبلی شما (sm و بزرگ‌تر)
      ──────────────────────────────── */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`
          hidden sm:block
          fixed top-0 left-0 right-0 z-50 mx-2 sm:mx-3 mt-2 sm:mt-3
          h-20 sm:h-24
          border border-[#0A5593]/40
          bg-sky-800/5 backdrop-blur-xl
          rounded-2xl shadow-lg shadow-sky-950/30
          flex flex-col overflow-hidden
          transition-all duration-500
          ${scrolled ? "shadow-2xl bg-sky-900/10 border-[#0A5593]/60" : ""}
        `}
            >
                {/* بخش بالا: لوگو + خروج + متن */}
                <div className="flex items-center justify-between px-4 sm:px-6 h-10 sm:h-11 flex-shrink-0">
                    {/* چپ */}
                    <div className="flex items-center text-white text-sm sm:text-base">
                        <span className="font-extrabold text-lg sm:text-xl text-[#FF8C3A]">تک</span>
                        <span className="font-extrabold text-lg sm:text-xl mr-0.5 text-[#0A5593]">‌لب</span>
                        <span className="mr-2 sm:mr-3 text-gray-300 hidden sm:inline">
              ، راه‌برد با تکنولوژی
            </span>
                    </div>

                    {/* راست */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <motion.button
                            whileHover={{ scale: 1.08, color: "#FF6B00" }}
                            whileTap={{ scale: 0.94 }}
                            onClick={handleLogout}
                            className="text-[#FF8C3A] hover:text-[#FF6B00] text-sm sm:text-base font-medium transition-colors"
                        >
                            خروج
                        </motion.button>

                        <motion.div
                            whileHover={{ scale: 1.04 }}
                            className="w-24 sm:w-28 h-auto flex-shrink-0"
                        >
                            <Image
                                src="/techlabLogo.png"
                                width={140}
                                height={100}
                                alt="تک‌لب"
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </div>
                </div>

                {/* تب‌ها */}
                <div className="flex-1 flex items-center px-4 sm:px-6 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 sm:gap-3 py-1.5 min-w-max">
                        {tabs.map((tab:any) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    relative px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-full
                    transition-colors duration-300 touch-manipulation
                    ${
                                        isActive
                                            ? "text-white bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A] shadow-md shadow-[#FF6B00]/40"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                    }
                  `}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.96, y: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="activeTabUnderline"
                                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B00]/20 to-[#FF8C3A]/20 -z-10"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    {tab.label}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </motion.header>

            {/* ────────────────────────────────
          هدر ساده موبایل (بالا) + باتم بار (پایین)
      ──────────────────────────────── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`
          sm:hidden
          fixed top-0 left-0 right-0 z-50
          h-16
          bg-sky-900/15 backdrop-blur-lg
          border-b border-[#0A5593]/30
          shadow-md shadow-sky-950/20
          transition-all duration-400
          ${scrolled ? "bg-sky-900/25 border-[#0A5593]/50" : ""}
        `}
            >
                <div className="flex items-center justify-between px-4 h-full">
                    {/* لوگو + متن */}
                    <div className="flex items-center gap-2.5">
                        <div className="relative w-8 h-8 flex-shrink-0">
                            <Image
                                src="/techlabLogoMini.png"
                                fill
                                alt="تک‌لب"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div className="flex flex-col leading-tight">
              <span className="font-bold text-base">
                <span className="text-[#FF8C3A]">تک</span>
                <span className="text-[#0A5593]">‌لب</span>
              </span>
                            <span className="text-[13px] text-gray-400">راه‌برد با تکنولوژی</span>
                        </div>
                    </div>

                    {/* خروج */}
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={handleLogout}
                        className="text-[#FF8C3A] gap-2 font-semibold bg-black/10 flex items-center justify-center hover:text-[#FFAA55] text-sm px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <LogOut size={20} strokeWidth={2} />خروج
                    </motion.button>
                </div>
            </motion.header>

            {/* باتم بار – فقط موبایل */}
            <motion.nav
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                className={`
          sm:hidden
          fixed bottom-0 left-0 right-0 z-50
          h-20
          bg-sky-900/15 backdrop-blur-lg
          border-t border-[#0A5593]/30
          shadow-md shadow-sky-950/20
          transition-all duration-400
          ${scrolled ? "bg-sky-900/25 border-[#0A5593]/50" : ""}
        `}
            >
                <div className="flex items-center justify-around h-full px-2">
                    {tabs.map((tab:any) => {
                        const isActive = activeTab === tab.id;

                        return (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex-1 flex flex-col items-center py-4 px-2 text-[14px] font-semibold xs:text-xs
                  transition-all duration-300 touch-manipulation
                  ${
                                    isActive
                                        ? "text-white bg-gradient-to-tl to-[#FF6B00]/70 from-[#0A5593]/50 rounded-lg shadow-sm"
                                        : "text-gray-300 hover:text-white active:bg-white/10"
                                }
                `}
                                whileTap={{ scale: 0.93 }}
                            >
                                <span className="truncate max-w-full">{tab.label}</span>
                                {isActive && (
                                    <div className="mt-0.5 w-6 animate-pulse h-0.5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8C3A]" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </motion.nav>

            {/* Spacer ها */}
            <div className="h-14 sm:h-24 flex-shrink-0" />
            <div className="h-14 flex-shrink-0 sm:hidden" />
        </>
    );
}