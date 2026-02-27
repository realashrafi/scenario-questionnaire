"use client";

import { ChangeEvent, useId } from "react";

type ProbabilityInputProps = {
    value: number;
    onChange?: (value: number) => void;     // اختیاری شد
    label?: string;
    compact?: boolean;
    readOnly?: boolean;                     // جدید
};

export default function ProbabilityInput({
                                             value,
                                             onChange,
                                             label,
                                             compact = false,
                                             readOnly = false,
                                         }: ProbabilityInputProps) {
    const id = useId();

    const isEditable = !readOnly && !!onChange;

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isEditable) return;
        const num = Number(e.target.value);
        onChange?.(isNaN(num) ? 0 : Math.max(0, Math.min(100, num)));
    };

    const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isEditable) return;
        onChange?.(Number(e.target.value));
    };

    const getGradient = (val: number) => {
        if (val <= 20) return "from-emerald-600 to-emerald-400";
        if (val <= 40) return "from-lime-600 to-lime-400";
        if (val <= 60) return "from-yellow-600 to-yellow-400";
        if (val <= 80) return "from-orange-600 to-orange-400";
        return "from-red-600 to-red-400";
    };

    return (
        <div
            className={`
                flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3
                w-full ${compact ? "scale-[0.94] sm:scale-100 origin-left" : ""}
                ${readOnly ? "opacity-75 pointer-events-none" : ""}
            `}
        >
            {label && (
                <span
                    className={`
                        text-xs sm:text-sm text-gray-400 font-medium
                        whitespace-nowrap hidden sm:block
                    `}
                >
                    {label}
                </span>
            )}

            <div className="flex items-center gap-2.5 sm:gap-3 flex-row-reverse w-full">
                {/* اسلایدر */}
                <div className="relative flex-1 min-w-[90px] sm:min-w-[140px]">
                    {/* track ثابت */}
                    <div
                        className="
                            absolute inset-0 h-1.5 sm:h-2
                            bg-[#1E3A6D]/70 rounded-full
                            pointer-events-none
                        "
                    />

                    {/* لایه رنگی گرادیانت */}
                    <div
                        className={`
                            absolute inset-y-0 right-0 h-1.5 sm:h-2 
                            rounded-r-full overflow-hidden
                            bg-gradient-to-l ${getGradient(value)}
                            transition-all duration-300
                        `}
                        style={{ width: `${value}%` }}
                    />

                    {/* range input */}
                    <input
                        id={id}
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={value}
                        disabled={!isEditable}
                        onChange={handleRangeChange}
                        className={`
                            relative w-full h-1.5 sm:h-2 bg-transparent appearance-none cursor-pointer z-10
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-orange-400
                            [&::-webkit-slider-thumb]:-mt-3 sm:-mt-3
                            [&::-webkit-slider-thumb]:shadow-md
                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300
                            [&::-webkit-slider-thumb]:cursor-${isEditable ? "pointer" : "default"}
                            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
                            [&::-moz-range-thumb]:rounded-full
                            [&::-moz-range-thumb]:bg-white
                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-300
                            [&::-moz-range-thumb]:cursor-${isEditable ? "pointer" : "default"}
                            focus:outline-none
                            ${!isEditable ? "opacity-60" : ""}
                        `}
                    />
                </div>

                {/* درصد + عدد */}
                <div className="flex items-center gap-1.5 shrink-0 flex-row-reverse">
                    <span className="text-white/90 font-medium text-sm sm:text-base min-w-[3ch] text-center">
                        {value}%
                    </span>

                    <input
                        type="number"
                        min={0}
                        max={100}
                        step={5}
                        value={value}
                        readOnly={!isEditable}
                        disabled={!isEditable}
                        onChange={handleNumberChange}
                        className={`
                            w-12 sm:w-14 h-7 sm:h-8
                            rounded bg-[#13294B] border border-[#1E3A6D]/70
                            px-1.5 text-center text-white text-sm sm:text-base font-medium
                            focus:border-[#FF6B00]/80 focus:ring-1 focus:ring-[#FF6B00]/40
                            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                            [&::-webkit-inner-spin-button]:appearance-none
                            ${!isEditable ? "opacity-70 cursor-default" : ""}
                        `}
                    />
                </div>
            </div>
        </div>
    );
}