// app/components/v2/AdminTabbedForms.tsx
"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

type Tab = {
    id: string;
    label: string;
    content: ReactNode;
};

type AdminTabbedFormsProps = {
    tabs: Tab[];
    defaultTabId?: string;
};

export default function AdminTabbedForms({
                                             tabs,
                                             defaultTabId,
                                         }: AdminTabbedFormsProps) {
    const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id || "");

    if (tabs.length === 0) {
        return <div className="text-center text-gray-400">هیچ تبی تعریف نشده است</div>;
    }

    return (
        <div className="w-full">
            {/* تب‌ها */}
            <div className="border-b border-[#1E3A6D]/60 mb-8">
                <nav className="-mb-px flex space-x-8 overflow-x-auto pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                group inline-flex items-center px-5 py-4 border-b-2 font-medium text-sm
                transition-colors duration-200 whitespace-nowrap
                ${
                                activeTab === tab.id
                                    ? "border-[#FF6B00] text-[#FF6B00]"
                                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                            }
              `}
                            aria-current={activeTab === tab.id ? "page" : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* محتوای تب فعال */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {tabs.find((tab) => tab.id === activeTab)?.content || (
                    <div className="text-center text-gray-500 py-12">
                        محتوای این تب در دسترس نیست
                    </div>
                )}
            </motion.div>
        </div>
    );
}