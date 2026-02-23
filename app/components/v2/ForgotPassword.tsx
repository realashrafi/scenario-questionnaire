// app/components/v2/ForgotPassword.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ForgotPassword() {
    const [step, setStep] = useState<"phone" | "otp">("phone");

    // مرحله ۱
    const [phone, setPhone] = useState("");

    // مرحله ۲
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    // تایمر ساده برای ارسال مجدد (اختیاری)
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const startResendCountdown = () => {
        setCanResend(false);
        setCountdown(90); // ۱.۵ دقیقه
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("idle");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: phone.trim() }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در ارسال کد تأیید");
            }

            setMessage(data.message || "کد تأیید برای شما ارسال شد (۳ دقیقه اعتبار)");
            setStatus("success");
            setStep("otp");
            startResendCountdown();
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "خطا در ارتباط با سرور");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setStatus("error");
            setMessage("رمز عبور و تکرار آن یکسان نیست");
            return;
        }

        if (newPassword.length < 6) {
            setStatus("error");
            setMessage("رمز عبور باید حداقل ۶ کاراکتر باشد");
            return;
        }

        setStatus("idle");
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: phone.trim(),
                    code: otp.trim(),
                    newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "خطا در تغییر رمز عبور");
            }

            setStatus("success");
            setMessage("رمز عبور با موفقیت تغییر یافت. حالا می‌توانید وارد شوید.");

            // می‌تونی بعد از چند ثانیه ریدایرکت کنی
            setTimeout(() => {
                window.location.href = "/"; // یا از useRouter استفاده کن
            }, 2500);
        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "خطا در ارتباط با سرور");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        if (!canResend) return;
        setOtp("");
        setStatus("idle");
        setMessage("");
        handleSendOtp({ preventDefault: () => {} } as any); // شبیه‌سازی submit
    };

    return (
        <div className="flex items-start justify-center px-4">
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
                    {step === "phone" ? "بازیابی رمز عبور" : "تأیید کد و تغییر رمز"}
                </h1>

                {step === "phone" ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                شماره تلفن همراه
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
                                pattern="09[0-9]{9}"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !phone.trim()}
                            className={`
                w-full py-3.5 font-medium rounded-xl text-white
                transition-all duration-200
                ${
                                loading || !phone.trim()
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-xl"
                            }
              `}
                        >
                            {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
                        </motion.button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                کد تأیید ارسال‌شده
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                placeholder="------"
                                maxLength={6}
                                dir="ltr"
                                className="
                  w-full px-4 py-3 bg-[#0A1F44]/70
                  border border-[#1E3A6D]/70 rounded-lg
                  text-gray-100 placeholder-gray-500 text-center tracking-widest text-xl
                  focus:outline-none focus:border-[#FF6B00]/60
                  focus:ring-1 focus:ring-[#FF6B00]/30
                "
                                required
                            />
                        </div>

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

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">
                                تکرار رمز عبور جدید
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="تکرار رمز عبور"
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
                            {loading ? "در حال تغییر..." : "تغییر رمز عبور"}
                        </motion.button>

                        <div className="text-center text-sm">
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-[#FF6B00] hover:underline"
                                >
                                    ارسال مجدد کد
                                </button>
                            ) : (
                                <span className="text-gray-400">
                  ارسال مجدد بعد از {countdown} ثانیه
                </span>
                            )}
                        </div>
                    </form>
                )}

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

                <div className="mt-8 text-center text-sm text-gray-400">
                    <Link href="/" className="text-[#FF6B00] hover:underline">
                        بازگشت به صفحه ورود
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}