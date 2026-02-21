'use client'
import React from 'react';
import LightRays from "@/app/components/v2/LightRays";
import ResetPasswordForm from "@/app/components/v2/ResetPasswordForm";
import Image from "next/image";
import {motion} from "framer-motion";

function Page() {
    return (
        <div className="min-h-screen relative bg-[#0A1F44] flex items-center justify-center w-full">
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`
          fixed top-0 left-0 right-0 z-50
          h-16
          bg-sky-900/15 backdrop-blur-lg
          border-b border-[#0A5593]/30
          shadow-md shadow-sky-950/20
          transition-all duration-400
        
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

                </div>
            </motion.header>
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
            <div className={'w-full'}>
                <ResetPasswordForm/>
            </div>
        </div>
    );
}

export default Page;