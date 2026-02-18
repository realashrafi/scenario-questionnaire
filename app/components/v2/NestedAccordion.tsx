"use client";

import {motion, AnimatePresence} from "framer-motion";
import {useState} from "react";
import ProbabilityInput from "./ProbabilityInput";
import ImpactInput from "./ImpactInput";

interface Question {
    title: string;
    period?: string;
    QS?: Record<string, Question>[];
}

interface Props {
    question: Question;
    path: string;
    probabilities: Record<string, number>;
    setProbabilities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    level?: number;
    showProbability?: boolean;
    showImpact?: boolean;
}

export default function NestedAccordion({
                                            question,
                                            path,
                                            probabilities,
                                            setProbabilities,
                                            level = 0,
                                            showProbability = level > 0,
                                            showImpact = level > 0 && !question.QS?.length,
                                        }: Props) {
    const [isOpen, setIsOpen] = useState(level === 0);
    const hasChildren = !!question.QS?.length;

    // indent کمتر در موبایل
    const indent = level * (level >= 3 ? 16 : 20); // سطح‌های عمیق‌تر کمتر indent

    // فاصله بین گروه‌ها
    const groupSpacing = level === 0 ? "space-y-4 sm:space-y-5" : "space-y-2 sm:space-y-3";

    // رنگ حاشیه چپ (در موبایل نازک‌تر یا کم‌رنگ‌تر)
    const leftBorderColor =
        level === 0
            ? "border-l-[#FF6B00]/40"
            : level === 1
                ? "border-l-[#60A5FA]/40"
                : "border-l-[#71DD9C]/40";

    return (
        <div
            className={`
        relative border-b border-[#1E3A6D]/60  last:border-b-0
        ${level % 2 === 0 ? "bg-[#13294B]/25" : "bg-[#0A1F44]/40"}
        transition-colors duration-200
      `}
        >
            {/* هدر اصلی - در موبایل ستونی می‌شود */}
            <div
                className={`
          py-3 px-4 sm:py-4 border-[#1E3A6D]/60 rounded-sm ${level !== 0 && 'mr-2'} border  sm:px-5
          transition-all duration-200
          ${isOpen ? "bg-[#1E3A6D]/20" : "hover:bg-[#1E3A6D]/12"}
        `}
                style={{paddingLeft: `${indent + 16}px`}} // کمی کمتر از قبل
            >
                <button
                    type="button"
                    onClick={() => hasChildren && setIsOpen(!isOpen)}
                    disabled={!hasChildren}
                    className={`
            w-full text-right focus:outline-none focus:ring-2 focus:ring-transparent
            flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-3 sm:gap-4
          `}
                >
                    {/* عنوان + دوره */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span
                className={`
                font-medium leading-tight
                ${level === 0
                    ? "text-lg sm:text-xl md:text-2xl"
                    : "text-base sm:text-lg"}
              `}
            >
              {question.title}
            </span>
                        {question.period && (
                            <span className="text-xs text-gray-400/80 truncate">
                {question.period}
              </span>
                        )}
                    </div>

                    {/* ورودی‌ها + آیکون - در موبایل پایین‌تر و تمام‌عرض */}
                    <div
                        className={`
              flex items-center justify-end sm:justify-normal
              gap-3 sm:gap-5 flex-wrap
              w-full sm:w-auto
            `}
                    >
                        {showProbability && (
                            <div className="min-w-[140px] sm:min-w-[160px]">
                                <ProbabilityInput
                                    value={probabilities[path] ?? 0}
                                    onChange={(v) => setProbabilities((prev) => ({...prev, [path]: v}))}
                                    compact
                                />
                            </div>
                        )}

                        {showImpact && (
                            <div className="min-w-[140px] sm:min-w-[160px]">
                                <ImpactInput
                                    value={probabilities[`${path}.impact`] ?? 0}
                                    onChange={(v) =>
                                        setProbabilities((prev) => ({...prev, [`${path}.impact`]: v}))
                                    }
                                    compact
                                />
                            </div>
                        )}

                        {hasChildren && (
                            <motion.span
                                animate={{rotate: isOpen ? 180 : 0}}
                                transition={{duration: 0.35}}
                                className={`
                  text-[#FF6B00] text-xl sm:text-2xl font-bold
                  flex items-center justify-center
                  ${!showProbability && !showImpact ? "ml-auto" : "ml-2 sm:ml-4"}
                `}
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
                        initial={{height: 0, opacity: 0}}
                        animate={{height: "auto", opacity: 1}}
                        exit={{height: 0, opacity: 0}}
                        transition={{duration: 0.28, ease: [0.16, 1, 0.3, 1]}}
                        className="overflow-hidden"
                    >
                        <div className={`py-2 sm:py-3 pl-4 sm:pl-6 ${groupSpacing}`}>
                            {question.QS?.map((subGroup, groupIndex) => {
                                const entries = Object.entries(subGroup);
                                if (entries.length === 0) return null;
                                const [subKey, subQuestion] = entries[0];

                                return (
                                    <div
                                        key={`${path}.${subKey}-${groupIndex}`}
                                        className={`
                      relative
                      border-l-2 sm:border-l-4 ${leftBorderColor} rounded-l
                    `}
                                    >
                                        <NestedAccordion
                                            question={subQuestion}
                                            path={`${path}.${subKey}`}
                                            probabilities={probabilities}
                                            setProbabilities={setProbabilities}
                                            level={level + 1}
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