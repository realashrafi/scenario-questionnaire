// components/NestedAccordion.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ProbabilityInput from "./ProbabilityInput";
import ImpactInput from "./ImpactInput";

type Props = {
    question: any;
    path: string;
    probabilities: Record<string, number>;
    setProbabilities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    level?: number;
};

export default function NestedAccordion({
                                            question,
                                            path,
                                            probabilities,
                                            setProbabilities,
                                            level = 0,
                                        }: Props) {
    const [isOpen, setIsOpen] = useState(level === 0);

    const hasChildren = !!question.QS?.length;
    const indent = level * 28;
    const isEvenLevel = level % 2 === 0;

    return (
        <div
            className={`
        relative border-b border-[#1E3A6D]/70 last:border-b-0
        ${isEvenLevel ? "bg-[#13294B]/30" : "bg-[#0A1F44]/50"}
        transition-colors duration-150
      `}
        >
            {/* خط عمودی راهنما – فقط اگر سطح > 0 باشد */}
            {level > 0 && (
                <div
                    className="absolute top-0 bottom-0 w-px bg-[#1E3A6D]/60"
                    style={{ left: `${level * 28 - 16}px` }}
                />
            )}

            {/* هدر */}
            <div
                className={`
          flex items-center justify-between py-4 px-5
          transition-colors duration-200
          ${isOpen ? "bg-[#1E3A6D]/25" : "hover:bg-[#1E3A6D]/15"}
        `}
                style={{ paddingLeft: `${indent + 20}px` }}
            >
                <button
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    className={`
            flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-3 sm:gap-5 text-left w-full
          `}
                    disabled={!hasChildren}
                >
                    {/* بخش عنوان + توضیح */}
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span
                className={`
                font-medium text-right
                text-base sm:text-lg ${level === 0 ? "md:text-xl" : ""}
              `}
            >
              {question.title}
            </span>
                        {question.period && (
                            <span className="text-xs text-gray-400/90 truncate leading-tight">
                {question.period}
              </span>
                        )}
                    </div>

                    {/* بخش اسلایدرها + آیکون */}
                    <div
                        className="
              flex items-center justify-end sm:justify-normal
              gap-3 sm:gap-5 flex-wrap
              w-full sm:w-auto sm:min-w-[280px] shrink-0
            "
                    >
                        {/* احتمال – فقط برای سطوح فرزند (level > 0) */}
                        {level > 0 && (
                            <ProbabilityInput
                                value={probabilities[path] ?? 0}
                                onChange={(v) => setProbabilities((prev) => ({ ...prev, [path]: v }))}
                                compact={true}
                            />
                        )}

                        {/* شدت اثر – فقط در برگ/لایه آخر */}
                        {/* شدت اثر – فقط برگ‌ها */}
                        {level > 0 && !hasChildren && (
                            <ImpactInput
                                value={probabilities[`${path}.impact`] ?? 0}
                                onChange={(newValue) => {
                                    setProbabilities((prev) => ({
                                        ...prev,
                                        [`${path}.impact`]: newValue,
                                    }));
                                }}
                                compact={true}
                            />
                        )}

                        {hasChildren && (
                            <motion.span
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="
                  text-[#FF6B00] text-xl font-bold
                  ml-1 sm:ml-2
                  flex items-center justify-center
                  w-8 h-8 sm:w-auto sm:h-auto
                "
                            >
                                ▼
                            </motion.span>
                        )}
                    </div>
                </button>
            </div>

            {/* فرزندان */}
            <AnimatePresence initial={false}>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="py-1">
                            {question.QS?.map((subGroup: any) =>
                                Object.entries(subGroup).map(([subKey, subQ]: [string, any]) => (
                                    <NestedAccordion
                                        key={subKey}
                                        question={subQ}
                                        path={`${path}.${subKey}`}
                                        probabilities={probabilities}
                                        setProbabilities={setProbabilities}
                                        level={level + 1}
                                    />
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}