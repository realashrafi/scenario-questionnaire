"use client";

import { useState, useEffect } from "react";
import ProbabilitySurvey from "@/app/components/v2/GatherView"; // یا مسیر درست ProbabilitySurvey
import AuthForm from "@/app/components/v2/AuthForm";
import LightRays from "@/app/components/v2/LightRays";
import DefinitionsTab from "@/app/components/v2/DefinitionsTab";
import SupportTab from "@/app/components/v2/SupportTab";
import OfferTab from "@/app/components/v2/OfferTab";
import ResultsTab from "@/app/components/v2/ResultsTab";
import Loading from "@/app/components/v2/Loading";
import Header from "@/app/components/Header";

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
            <div className="min-h-screen relative bg-[#0A1F44] flex items-center justify-center text-white">
                <Loading />
                <span>در حال بررسی وضعیت</span>
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
                        fadeDistance={4}
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
            <div className="fixed sm:opacity-70 inset-0 pointer-events-none z-0">
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
                    fadeDistance={10}
                    saturation={1}
                />
            </div>

           <Header activeTab={activeTab} tabs={tabs} setActiveTab={setActiveTab} handleLogout={handleLogout} />

            {/* محتوای تب فعال */}
            <main className="flex-1 pb-16 sm:-translate-y-0 -translate-y-10 px-4 sm:px-6 relative z-10">
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