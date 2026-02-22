"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ProbabilityInput from "./ProbabilityInput";
import ImpactInput from "./ImpactInput";
import { ArrowDownWideNarrow} from "lucide-react";

interface Question {
    title: string;
    period?: string;
    QS?: { [key: string]: Question }[];
}

interface Props {
    question: Question;
    path: string;
    probabilities: Record<string, number>;
    setProbabilities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    level?: number;
    showProbability?: boolean;
    showImpact?: boolean;
    breadcrumb?: string[];  // ← این prop رو اضافه کردیم
}

export default function NestedAccordion({
                                            question,
                                            path,
                                            probabilities,
                                            setProbabilities,
                                            level = 0,
                                            showProbability,
                                            showImpact = level > 0 && !question.QS?.length,
                                            breadcrumb = [],
                                        }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = !!question.QS?.length;

    const indent = level * (level >= 3 ? 16 : 20);
    const groupSpacing = level === 0 ? "space-y-5" : "space-y-3";

    const leftBorderColor =
        level === 0
            ? "border-l-[#FF6B00]/50"
            : level === 1
                ? "border-l-[#60A5FA]/50"
                : "border-l-[#71DD9C]/50";

    const effectiveShowProb = showProbability !== undefined ? showProbability : level > 0;

    return (
        <div
            className={`
        relative border-b border-[#1E3A6D]/60 last:border-b-0
        ${level % 2 === 0 ? "bg-[#13294B]/30" : "bg-[#0A1F44]/45"}
        transition-colors duration-200
      `}
        >
            <div
                className={`
          py-4 px-5 sm:py-5 border-[#1E3A6D]/60 rounded-sm ${
                    level !== 0 && "mr-3"
                } border sm:px-6
          transition-all duration-200
          ${isOpen ? "bg-[#1E3A6D]/25" : "hover:bg-[#1E3A6D]/15"}
        `}
                style={{ paddingLeft: `${indent + 20}px` }}
            >
                <button
                    type="button"
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    disabled={!hasChildren}
                    className={`
            w-full text-right focus:outline-none
            flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-4 sm:gap-6
          `}
                >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        {/* ← بخش breadcrumb */}
                        {breadcrumb.length > 0 && (
                            <div className="text-xs sm:text-sm text-gray-400/90 mb-1.5 tracking-wide opacity-90">
                                {breadcrumb.map((crumb, idx) => (
                                    <span key={idx}>
                    {crumb}
                                        {idx < breadcrumb.length - 1 && (
                                            <span className="mx-1.5 text-gray-500">-</span>
                                        )}
                  </span>
                                ))}
                            </div>
                        )}

                        <span
                            className={`
                font-medium leading-tight
                ${level === 0 ? "text-xl sm:text-2xl" : "text-base sm:text-lg"}
              `}
                        >
              {question.title}
            </span>

                        {question.period && (
                            <span className="text-sm text-gray-400/80">
                {question.period}
              </span>
                        )}
                    </div>

                    <div
                        className={`
              flex items-center justify-end sm:justify-normal
              gap-4 sm:gap-6 flex-wrap
              w-full sm:w-auto
            `}
                    >
                        {effectiveShowProb && (
                            <div className="min-w-[150px] sm:min-w-[180px]">
                                <ProbabilityInput
                                    value={probabilities[path] ?? 0}
                                    onChange={(v) => setProbabilities((prev) => ({ ...prev, [path]: v }))}
                                    compact
                                />
                            </div>
                        )}

                        {showImpact && (
                            <div className="min-w-[150px] sm:min-w-[180px]">
                                <ImpactInput
                                    value={probabilities[`${path}.impact`] ?? 0}
                                    onChange={(v) =>
                                        setProbabilities((prev) => ({ ...prev, [`${path}.impact`]: v }))
                                    }
                                    compact
                                />
                            </div>
                        )}

                        {hasChildren && (
                            <motion.span
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.4 }}
                                className={`
                  text-[#FF6B00] text-2xl sm:text-3xl font-extrabold
                  flex items-center justify-center
                  ${!effectiveShowProb && !showImpact ? "ml-auto" : "ml-3 sm:ml-6"}
                `}
                            >
                                <ArrowDownWideNarrow />
                            </motion.span>
                        )}
                    </div>
                </button>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                    >
                        <div className={`py-3 sm:py-4 pl-5 sm:pl-8 ${groupSpacing}`}>
                            {question.QS?.map((subGroup, groupIndex) => {
                                const entries = Object.entries(subGroup);
                                if (entries.length === 0) return null;
                                const [subKey, subQuestion] = entries[0];

                                return (
                                    <div
                                        key={`${path}.${subKey}-${groupIndex}`}
                                        className={`
                      relative border-l-4 ${leftBorderColor} pl-4 sm:pl-6 rounded-l
                    `}
                                    >
                                        <NestedAccordion
                                            question={subQuestion}
                                            path={`${path}.${subKey}`}
                                            probabilities={probabilities}
                                            setProbabilities={setProbabilities}
                                            level={level + 1}
                                            breadcrumb={[...breadcrumb, question.title]}  // ← اینجا مسیر رو به فرزند پاس می‌دیم
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}