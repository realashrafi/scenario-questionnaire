// app/auth/page.tsx
import AuthForm from "@/app/components/v2/AuthForm";

export default function AuthPage() {
    return (
        <div className="min-h-screen bg-[#0A1F44] flex items-center justify-center px-4 py-12">
            <AuthForm />
        </div>
    );
}

// متا دیتا (اختیاری)
export const metadata = {
    title: "ورود / ثبت‌نام - احتمال وقوع سناریوها",
    description: "برای ذخیره پاسخ‌های خود لطفاً وارد شوید یا ثبت‌نام کنید",
};