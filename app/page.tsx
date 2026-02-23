"use client";

import {useState, useEffect, ReactNode} from "react";
import AuthForm from "@/app/components/v2/AuthForm";
import LightRays from "@/app/components/v2/LightRays";
import DefinitionsTab from "@/app/components/v2/DefinitionsTab";
import SupportTab from "@/app/components/v2/SupportTab";
import OfferTab from "@/app/components/v2/OfferTab";
import ResultsTab from "@/app/components/v2/ResultsTab";
import Loading from "@/app/components/v2/Loading";
import Header from "@/app/components/Header";
import {Barrel, BookA, MessageCircleWarning, MessagesSquare, SquareLibrary, SquarePen} from "lucide-react";
import ProbabilitySurvey from "@/app/components/v2/GatherView";

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    const tabs: { id: Tab; label: string,icon:ReactNode }[] = [
        { id: "definitions", label: "تعاریف",icon:<BookA /> },
        { id: "probability", label: "ثبت نظر",icon:<SquarePen /> },
        { id: "result", label: "نتایج" ,icon:<SquareLibrary />},
        { id: "offer", label: "پیشنهاد" ,icon:<MessageCircleWarning />},
        { id: "support", label: "پشتیبانی" ,icon:<MessagesSquare />},
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

    const DevelopSection =
      <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm">
          <div className="relative px-10 py-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700/50 shadow-2xl shadow-black/60 max-w-md mx-4 text-center">
              {/* آیکون اختیاری (می‌تونی حذف کنی) */}
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30">
                  <svg
                      className="w-8 animate-spin h-8 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                  </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                  در دست توسعه
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed">
                  این بخش هنوز آماده نیست<br />
                  به‌زودی با امکانات جدید برمی‌گردیم!
              </p>
          </div>
      </div>


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

                    {/*{activeTab === "probability" && DevelopSection}*/}

                    {/*{activeTab === "definitions" && DevelopSection}*/}

                    {/*{activeTab === "result" && DevelopSection}*/}

                    {/*{activeTab === "support" && DevelopSection}*/}

                    {/*{activeTab === "offer" && DevelopSection}*/}
                </div>
            </main>
        </div>
    );
}