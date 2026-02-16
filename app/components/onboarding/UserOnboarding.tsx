// components/onboarding/UserOnboarding.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import {generateFingerprint} from "@/app/lib/fingerprint";

export default function UserOnboarding() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || !phone.match(/^09[0-9]{9}$/)) {
            setError('نام و شماره موبایل معتبر وارد کنید')
            return
        }

        const fp = generateFingerprint(name, phone)

        // ذخیره محلی
        localStorage.setItem('userFingerprint', fp)
        localStorage.setItem('userName', name)

        // می‌توانی اینجا به سرور هم بفرستی تا چک کنه تکراری نباشد
        // فعلاً مستقیم می‌رویم به پرسشنامه
        router.push('/questionnaire')
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-slate-900 p-8 rounded-2xl space-y-6"
            >
                <h1 className="text-2xl font-bold text-white text-center">شروع پرسشنامه</h1>

                <div>
                    <label className="block text-sm text-slate-300 mb-2">نام</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                        placeholder="نام شما"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-300 mb-2">شماره موبایل</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
                        placeholder="0912xxxxxxx"
                        pattern="09[0-9]{9}"
                        required
                    />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
                >
                    ادامه
                </button>
            </form>
        </div>
    )
}