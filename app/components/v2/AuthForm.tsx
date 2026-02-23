// components/AuthForm.tsx
"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {motion} from "framer-motion";
import {LogOut} from "lucide-react";
import Link from "next/link";

export default function AuthForm() {
    const router = useRouter();
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({name: "", phone: "", password: ""});

    const WHATSAPP_NUMBER = "989927242580";
    const BALE_WEB_LINK = "https://ble.ir/fakherstrategy";
    const PRE_MESSAGE = "سلام، در مورد پروژه احتمال وقوع سناریوها سؤالی دارم";
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRE_MESSAGE)}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({...p, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
        const body = isSignup ? form : {phone: form.phone, password: form.password};

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "خطایی رخ داد");

            localStorage.setItem("token", data.token);
            window.location.reload();
            router.push("/");
        } catch (err: any) {
            setError(err.message || "مشکلی پیش آمد");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 z-50 bg-[#13294B]/20 rounded-xl border border-[#1E3A6D] shadow-2xl">
            <motion.header
                initial={{y: -80, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className={`
          fixed top-0 left-0 right-0 z-50
                  rounded-xl m-2
          h-16
        backdrop-blur-xl
    bg-gradient-to-t from-black/35 via-sky-950/25 to-transparent/10
    border-t border-white/10
    shadow-[0_-10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]
    transition-all duration-500 ease-out
        
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
            <motion.nav
                initial={{y: 100, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.7, ease: "easeOut", delay: 0.15}}
                className={`
          fixed bottom-0 left-0 right-0 z-50
          h-20
          rounded-xl m-2
        backdrop-blur-xl
    bg-gradient-to-t from-black/35 via-sky-950/25 to-transparent/10
    border-t border-white/10
    shadow-[0_-10px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)]
    transition-all duration-500 ease-out
        `}
            >
                <div className="flex max-h-20 p-4 gap-4 w-full max-w-md ">
                    {/* دکمه واتس‌اپ */}
                    <motion.a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.4)"}}
                        whileTap={{scale: 0.97}}
                        className="
            flex-1 flex items-center justify-between gap-3
            bg-gradient-to-r from-green-600 to-green-500
            hover:from-green-500 hover:to-green-400
            text-white font-semibold text-sm py-4 px-4
            rounded-2xl shadow-xl hover:shadow-2xl text-nowrap
            transition-all duration-300 border border-green-400/30
          "
                    >
                        <span>واتساپ</span>
                        {/* آیکون واتس‌اپ – ساده و رسمی */}
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            className="shrink-0"
                        >
                            <path
                                d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                        </svg>


                    </motion.a>

                    {/* دکمه بله */}
                    <motion.a
                        href={BALE_WEB_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.4)"}}
                        whileTap={{scale: 0.97}}
                        className="
            flex-1 flex items-center justify-between gap-3
            bg-gradient-to-r from-blue-600 to-blue-500
            hover:from-blue-500 hover:to-blue-400
            text-white font-semibold text-sm py-4 px-4
            rounded-2xl shadow-xl hover:shadow-2xl text-nowrap
            transition-all duration-300 border border-blue-400/30
          "
                    >
                        <span>پیام‌رسان بله</span>
                        {/* آیکون بله – ساده‌شده از لوگوی رسمی (تیک آبی معروف) */}
                        <img
                            src={'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAQlBMVEUAuJQAuJQAuJQAuJRHcEwAuJQAuJQAuJQAuJQAuJMAuJQAtpBpzbVHxKf////x+/kAs4smvp3M7eWv49XC6d9iyrFQy2+jAAAAC3RSTlNe/80kAE+K7JsWr1xlvc8AAADpSURBVHgBhdNXFsIwEEPRka3EDdLZ/1YxTp2Uw/vVhXQRGMu5qjYOcMYL9wS5mmSIOBStAnDB45RX4C4XFLjL/gMI/4B7BimtZyr38+s1k3AL0rvJvX8iKqD2pu2Qo9ztcz1y1Qo6pKT3Zj7NGaR+aJqxU/uYkDMLaJvc1B32oSuLk7J/mmYWai8p0EyX3YkrYh3UPgOjTv28I4qHFnpHLRW00DusECcxHXdHYVRC76gzCNhEO9/OQ8yAHmtdj6R2KYAODxnOIOAhLoD2frcbYHDPHw7n/HmvSQVo1cfrAxWYE29QPv+Ke18GbRJ/56CgKgAAAABJRU5ErkJggg=='}
                            alt={'s'}/>


                    </motion.a>
                </div>
            </motion.nav>
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
                {isSignup ? "ثبت‌نام" : "ورود"}
            </h2>

            {error && <p className="text-red-400 text-center mb-6">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
                {isSignup && (
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">نام و نام خانوادگی</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#0A1F44]/20 border border-[#1E3A6D] rounded-lg text-white focus:border-[#FF6B00] focus:outline-none"
                            required
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm text-gray-300 mb-2">شماره تلفن</label>
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A1F44]/20 border border-[#1E3A6D] rounded-lg text-white focus:border-[#FF6B00] focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-300 mb-2">رمز عبور</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A1F44]/20 border border-[#1E3A6D] rounded-lg text-white focus:border-[#FF6B00] focus:outline-none"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                        loading
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-[#FF6B00] hover:bg-[#ff8533] text-white"
                    }`}
                >
                    {loading ? "در حال انجام..." : isSignup ? "ثبت‌نام" : "ورود"}
                </button>
            </form>

            <p className="mt-6 text-center text-gray-400  hover:underlinetext-sm">
                {isSignup ? "حساب دارید؟" : "حساب ندارید؟"}{" "}
                <button
                    type="button"
                    onClick={() => setIsSignup(!isSignup)}
                    className="text-[#FF6B00] hover:underline"
                >
                    {isSignup ? "ورود" : "ثبت‌نام"}
                </button>
            </p>
            {/*{*/}
            {/*    !isSignup && <div className={'w-full flex items-center justify-center'}>*/}
            {/*        <Link className={'mx-auto text-[#FF6B00] text-[16px] mt-2 hover:underline'}*/}
            {/*              href={'/reset-pass-by-user'}>فراموشی رمز عبور</Link>*/}
            {/*    </div>*/}
            {/*}*/}
        </div>
    );
}