// app/admin/panel/page.tsx
"use client";

import React, {useState, useEffect} from 'react';
import ResetPasswordForm from "../components/v2/ResetPasswordForm";
import WhitelistManager from "../components/v2/WhitelistManager";
import AdminTabbedForms from "@/app/components/v2/AdminTabbedForms";
import LightRays from "@/app/components/v2/LightRays";
import SuggestionsAdminPanel from "@/app/components/v2/SuggestionsAdminPanel";
import Link from "next/link";
import AdminAuthForm from "@/app/components/v2/AdminAuthForm";
import AdminTestDashboard from "@/app/components/v2/AdminDashboard";


const ADMIN_PHONE_WHITELIST = [
    "09201001450",
    "09129572141",
    "admin",
];

export default function AdminPanel() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            setError('لطفاً ابتدا وارد شوید');
            setHasAccess(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) {
                    throw new Error('خطا در دریافت اطلاعات کاربر');
                }

                const data = await res.json();
                const user = data.user || null;
                setCurrentUser(user);

                // چک کردن اینکه شماره کاربر در لیست ادمین‌ها هست یا نه
                if (user?.phone) {
                    const isAdmin = ADMIN_PHONE_WHITELIST.includes(user.phone.trim());
                    setHasAccess(isAdmin);

                    if (!isAdmin) {
                        setError('شما دسترسی به پنل مدیریت ندارید');
                    }
                } else {
                    setHasAccess(false);
                    setError('شماره تلفن کاربر یافت نشد');
                }
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'خطای سرور');
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const tabs = [
        {
            id: "dashboard",
            label: "داشبورد",
            content: <AdminTestDashboard/>,
        },
        {
            id: "whitelist",
            label: "مدیریت وایت‌لیست",
            content: <WhitelistManager/>,
        },
        {
            id: "reset-password",
            label: "تغییر پسورد",
            content: <ResetPasswordForm/>,
        },
        {
            id: "suggestions-admin-panel",
            label: "پیشنهاد ها",
            content: <SuggestionsAdminPanel/>,
        },
    ];

    return (
        <div className="min-h-screen relative bg-[#0A1F44]  md:p-10">
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
            <div className="max-w-5xl mx-auto">
                {/* هدر */}
                <div
                    className="flex p-6 flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10">
                    <h1 className="text-3xl font-bold text-gray-100 mb-4 sm:mb-0">
                        پنل مدیریت
                    </h1>
                    <Link href="/" className="text-[#FF6B00] hover:underline">
                        بازگشت
                    </Link>
                    {loading ? (
                        <div className="text-gray-400 text-sm md:text-base">
                            در حال بارگذاری...
                        </div>
                    ) : error ? (
                        <div className="text-red-400 text-sm md:text-base bg-red-950/30 px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    ) : currentUser ? (
                        <div
                            className="text-gray-300 text-sm md:text-base bg-[#13294B]/50 px-4 py-2 rounded-lg border border-[#1E3A6D]/60 flex items-center gap-3">
                            <span className="text-[#FF6B00] font-semibold">
                {currentUser.name || currentUser.phone || 'کاربر'}
              </span>
                            <span className="text-gray-500">({currentUser.phone})</span>
                        </div>
                    ) : (
                        <div className="text-yellow-400 text-sm md:text-base">
                            کاربر شناسایی نشد
                        </div>
                    )}
                </div>

                {/* فقط اگر دسترسی داشت تب‌ها نمایش داده می‌شوند */}
                {!loading && hasAccess === true ? (
                    <AdminTabbedForms tabs={tabs} defaultTabId="dashboard"/>
                ) : !loading && hasAccess === false ? (
                    <div className="mt-12 text-center">
                        <div
                            className="inline-block bg-red-950/40 border border-red-600/50 rounded-xl p-8 max-w-lg mx-auto">
                            <h2 className="text-2xl font-bold text-red-300 mb-4">
                                دسترسی غیرمجاز
                            </h2>
                            <p className="text-gray-300 mb-6">
                                این پنل فقط برای شماره‌های مجاز در دسترس است.
                            </p>
                            <p className="text-gray-400 text-sm">
                                شماره شما: {currentUser?.phone || 'نامشخص'}
                            </p>
                            <AdminAuthForm/>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}