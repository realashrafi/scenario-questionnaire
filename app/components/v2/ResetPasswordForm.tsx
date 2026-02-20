// مثلاً: app/components/v2/ResetPasswordForm.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ResetPasswordForm() {
    const [phone, setPhone] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("idle");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim(), newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در تغییر رمز عبور");
            }

            setStatus("success");
            setMessage("رمز عبور با موفقیت تغییر یافت. حالا می‌توانید وارد شوید.");
            setPhone("");
            setNewPassword("");
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "خطای سرور. لطفاً دوباره امتحان کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A1F44] flex items-start justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="
          w-full max-w-md
          bg-[#13294B]/40 backdrop-blur-md
          border border-[#1E3A6D]/60 rounded-2xl
          p-8 shadow-2xl shadow-black/30
        "
            >
                <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
                    تغییر رمز عبور
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* شماره تلفن */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            شماره تلفن
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0912xxxxxxx"
                            dir="ltr"
                            className="
                w-full px-4 py-3 bg-[#0A1F44]/70
                border border-[#1E3A6D]/70 rounded-lg
                text-gray-100 placeholder-gray-500
                focus:outline-none focus:border-[#FF6B00]/60
                focus:ring-1 focus:ring-[#FF6B00]/30
              "
                            required
                        />
                    </div>

                    {/* رمز عبور جدید */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">
                            رمز عبور جدید
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="حداقل ۶ کاراکتر"
                            className="
                w-full px-4 py-3 bg-[#0A1F44]/70
                border border-[#1E3A6D]/70 rounded-lg
                text-gray-100 placeholder-gray-500
                focus:outline-none focus:border-[#FF6B00]/60
                focus:ring-1 focus:ring-[#FF6B00]/30
              "
                            required
                            minLength={6}
                        />
                    </div>

                    {/* دکمه ارسال */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`
              w-full py-3.5 font-medium rounded-xl text-white
              transition-all duration-200
              ${
                            loading
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-xl"
                        }
            `}
                    >
                        {loading ? "در حال پردازش..." : "تغییر رمز عبور"}
                    </motion.button>
                </form>

                {/* پیام وضعیت */}
                {status !== "idle" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-6 p-4 rounded-lg text-center text-sm ${
                            status === "success"
                                ? "bg-green-900/40 border border-green-500/40 text-green-300"
                                : "bg-red-900/40 border border-red-500/40 text-red-300"
                        }`}
                    >
                        {message}
                    </motion.div>
                )}

                {/* لینک بازگشت به ورود */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    <Link href="/" className="text-[#FF6B00] hover:underline">
                        بازگشت
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}