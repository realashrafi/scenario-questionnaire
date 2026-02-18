"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ProbabilitySurvey from "@/app/components/v2/GatherView"; // یا مسیر درست ProbabilitySurvey
import AuthForm from "@/app/components/v2/AuthForm";
import LightRays from "@/app/components/v2/LightRays";
import DefinitionsTab from "@/app/components/v2/DefinitionsTab";
import SupportTab from "@/app/components/v2/SupportTab";
import OfferTab from "@/app/components/v2/OfferTab";
import ResultsTab from "@/app/components/v2/ResultsTab";

type Tab = "probability" | "definitions" | "result" | "support" | "offer";

export default function MainPage() {
    const [activeTab, setActiveTab] = useState<Tab>("definitions");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    const tabs: { id: Tab; label: string }[] = [
        { id: "definitions", label: "تعاریف" },
        { id: "probability", label: "ثبت نظر" },
        { id: "result", label: "نتایج" },
        { id: "offer", label: "پیشنهاد" },
        { id: "support", label: "پشتیبانی" },
    ];

    // هنوز وضعیت لاگین چک نشده
    if (!authChecked) {
        return (
            <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center text-white">
                در حال بررسی وضعیت ورود...
            </div>
        );
    }

    // کاربر لاگین نکرده → فقط فرم لاگین + LightRays
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen relative bg-[#0A1F44] flex items-center justify-center px-4">
                <div className="fixed inset-0 pointer-events-none">
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
                        pulsating={false}
                        fadeDistance={2}
                        saturation={1}
                    />
                </div>
                <AuthForm />
            </div>
        );
    }

    // کاربر لاگین کرده → صفحه اصلی با تب‌ها
    return (
        <div className="min-h-screen bg-[#0A1F44] text-gray-100 flex flex-col relative">
            {/* LightRays در پس‌زمینه کل صفحه */}
            <div className="fixed inset-0 pointer-events-none z-0">
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
                    pulsating={false}
                    fadeDistance={2}
                    saturation={1}
                />
            </div>

            {/* هدر ثابت */}
            <header
                className="
          fixed top-0 left-0 right-0 z-50
          h-20
          backdrop-blur-[10px]
          bg-black/10
          rounded-b-xl
          flex flex-col
        "
            >
                <div className="flex items-center justify-between px-4 sm:px-6 h-11 flex-shrink-0">
                    {/* چپ - متن */}
                    <div className="flex items-center text-white text-[14px] lg:text-[17px]">
                        <span className="font-bold">تک‌لب</span>
                        <span className="mr-1.5">، راه‌برد با تکنولوژی</span>
                    </div>

                    {/* راست - خروج + لوگو */}
                    <div className="flex items-center gap-5 sm:gap-7">
                        <button
                            onClick={handleLogout}
                            className="text-[#FF8C3A] hover:text-[#FF6B00] text-sm font-medium transition-colors"
                        >
                            خروج
                        </button>

                        <div className="w-[110px] sm:w-[120px] h-auto">
                            <Image
                                src="/techlabLogo.png"
                                width={120}
                                height={100}
                                alt="techlab logo"
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>

                {/* تب‌ها */}
                <div className="flex-1 flex items-center px-4 sm:px-6 -mt-1 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 sm:gap-3 min-w-max">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  px-4 sm:px-5 py-1.5 text-xs sm:text-sm font-medium rounded-md
                  transition-all duration-200 touch-manipulation
                  ${
                                    activeTab === tab.id
                                        ? "bg-[#FF6B00]/20 text-[#FFDBB5] border border-[#FF6B00]/40"
                                        : "text-gray-300 hover:text-white hover:bg-black/20 active:bg-black/30"
                                }
                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* فاصله برای هدر */}
            <div className="h-20 flex-shrink-0" />

            {/* محتوای تب فعال */}
            <main className="flex-1 pb-16 px-4 sm:px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {activeTab === "probability" && <ProbabilitySurvey />}

                    {activeTab === "definitions" && <DefinitionsTab/>}

                    {activeTab === "result" && <ResultsTab/>}

                    {activeTab === "support" && <SupportTab/>}

                    {activeTab === "offer" && <OfferTab/>}
                </div>
            </main>
        </div>
    );
}