"use client";

import { useState, useEffect } from "react";
import NestedAccordion from "@/app/components/v2/NestedAccordion";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "@/app/components/v2/Loading";

type Question = {
    title: string;
    period?: string;
    QS?: { [key: string]: Question }[];
};

type Scenario = {
    id: string;
    title: string;
    period: string;
    root: Question;
};

type UserSummary = {
    userId: string;
    name: string;
    phone: string;
    registeredAt: string | null;
    lastActive: string | null;
    progress: number;
    startedScenarios: number;
};

export default function AdminDashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
    const [probabilities, setProbabilities] = useState<Record<string, number>>({});
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // لود توکن + ساختار سوالات + لیست کاربران
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            setError("توکن یافت نشد. لطفاً با حساب ادمین لاگین کنید.");
            setLoading(false);
            return;
        }

        // لود سناریوها (دقیقاً مثل صفحه کاربر)
        fetch("/questions.json")
            .then((r) => {
                if (!r.ok) throw new Error(`خطا در لود داده‌ها - ${r.status}`);
                return r.json();
            })
            .then((data) => {
                setScenarios(data.scenarios || []);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message || "خطا در بارگذاری ساختار سوالات");
            });
    }, []);

    // لود لیست کاربران وقتی توکن آماده شد
    useEffect(() => {
        if (!token) return;

        const loadUsers = async () => {
            try {
                const res = await fetch("/api/admin/users-summary", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || "خطا در بارگذاری کاربران");
                }

                setUsers(data.users || []);
            } catch (err: any) {
                setError(err.message || "خطای ناشناخته");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [token]);

    // لود احتمالات کاربر انتخاب‌شده
    const loadUserResponses = async (userId: string) => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/admin/probabilities/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error(`خطا ${res.status}`);

            const data = await res.json();

            if (data.success) {
                setProbabilities(data.probabilities || {});
                setSelectedUser(users.find((u) => u.userId === userId) || null);
            } else {
                setError(data.message || "داده‌ای یافت نشد");
            }
        } catch (err: any) {
            setError(err.message || "خطا در بارگذاری پاسخ‌ها");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-white">
                <Loading />
                <span className="ml-4">در حال بارگذاری...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center text-red-400">
                <div className="text-center p-6">
                    <p className="text-xl">خطا</p>
                    <p className="mt-3 text-sm opacity-80">{error}</p>
                </div>
            </div>
        );
    }

    // اگر هیچ کاربری انتخاب نشده → نمایش لیست کاربران
    if (!selectedUser) {
        return (
            <div className="pb-32 pt-8 md:pt-12 backdrop-blur-xl rounded-md sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 md:mb-14 flex items-center justify-center text-white"
                >
                    <h1 className="text-3xl text-right md:text-4xl lg:text-5xl font-bold tracking-tight text-white md:text-left">
                       ({users.length}) داشبورد ادمین – پاسخ‌های کاربران
                    </h1>
                </motion.div>

                {users.length === 0 ? (
                    <div className="text-center text-gray-400 text-xl my-20">
                        هیچ کاربری یافت نشد
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse">
                            <thead>
                            <tr className="bg-[#1E3A6D]/80 text-white">
                                <th className="p-4 text-right">نام</th>
                                <th className="p-4 text-right">موبایل</th>
                                <th className="p-4 text-center">پیشرفت</th>
                                <th className="p-4 text-center">سناریوهای شروع‌شده</th>
                                <th className="p-4 text-center">آخرین فعالیت</th>
                                <th className="p-4 text-center">عملیات</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.userId}
                                    className="border-b border-[#2A4A8A]/60 hover:bg-[#1E3A6D]/20 transition-colors"
                                >
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.phone}</td>
                                    <td className="p-4 text-center">
                                        <div className="w-20 mx-auto bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${user.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs mt-1 block">{user.progress}%</span>
                                    </td>
                                    <td className="p-4 text-center">{user.startedScenarios}</td>
                                    <td className="p-4 text-center text-sm text-gray-300">
                                        {user.lastActive ? new Date(user.lastActive).toLocaleString("fa-IR") : "—"}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => loadUserResponses(user.userId)}
                                            className="px-5 py-2 bg-[#2A4A8A] hover:bg-[#3A5AA0] text-white rounded transition"
                                        >
                                            مشاهده پاسخ‌ها
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    // نمایش پاسخ‌های کاربر انتخاب‌شده (دقیقاً مثل ProbabilitySurvey اما read-only)
    return (
        <div className="pb-32 pt-8 md:pt-12 sm:px-6 backdrop-blur-xl rounded-md lg:px-8 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10 md:mb-14 flex items-center justify-between"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                        پاسخ‌های {selectedUser.name}
                    </h1>
                    <p className="text-base text-gray-300 mt-2 opacity-90">
                        {selectedUser.phone} • آخرین فعالیت: {selectedUser.lastActive ? new Date(selectedUser.lastActive).toLocaleString("fa-IR") : "نامشخص"}
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedUser(null)}
                    className="
                        px-8 py-4 text-lg font-semibold
                        bg-gradient-to-r from-gray-700 to-gray-600
                        hover:from-gray-600 hover:to-gray-500
                        text-white rounded-2xl shadow-2xl hover:shadow-3xl
                        transition-all duration-300 flex items-center gap-3
                        border border-gray-500/40
                    "
                >
                    بازگشت به لیست
                </motion.button>
            </motion.div>

            <div className="space-y-10">
                {scenarios.map((scenario) => (
                    <motion.section
                        key={scenario.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="border border-[#1E3A6D]/70 rounded-xl overflow-hidden bg-[#13294B]/25 shadow-xl shadow-black/30"
                    >
                        <div className="bg-gradient-to-r from-[#1E3A6D] to-[#0F2550] px-6 py-6 md:py-7 border-b border-[#2A4A8A]/60">
                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                {scenario.title}
                            </h2>
                            <p className="text-base text-gray-300 mt-2 opacity-90">
                                {scenario.period}
                            </p>
                        </div>

                        <NestedAccordion
                            question={scenario.root}
                            path={`Q.${scenario.id}`}
                            probabilities={probabilities}
                            // بدون setProbabilities → read-only
                            level={0}
                            showProbability={true}
                            showImpact={false} // یا true اگر می‌خوای impactها هم نمایش داده شوند
                        />
                    </motion.section>
                ))}
            </div>
        </div>
    );
}