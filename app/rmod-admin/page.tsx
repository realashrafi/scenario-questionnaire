// مثلاً app/admin/panel/page.tsx

import ResetPasswordForm from "../components/v2/ResetPasswordForm";
import WhitelistManager from "../components/v2/WhitelistManager";
import AdminTabbedForms from "@/app/components/v2/AdminTabbedForms";

// import دیگر کامپوننت‌ها...

export default function AdminPanel() {
    const tabs = [
        {
            id: "whitelist",
            label: "مدیریت وایت‌لیست",
            content: <WhitelistManager />,
        },
        {
            id: "rest-password",
            label: "تغییر پسورد",
            content: <ResetPasswordForm/>,
        },
    ];

    return (
        <div className="min-h-screen bg-[#0A1F44] p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-100 mb-10 text-center md:text-right">
                    پنل مدیریت
                </h1>
                    <AdminTabbedForms tabs={tabs} defaultTabId="whitelist" />
            </div>
        </div>
    );
}