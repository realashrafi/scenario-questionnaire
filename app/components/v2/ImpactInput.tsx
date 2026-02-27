"use client";

type Props = {
    value: number;
    onChange?: (value: number) => void;   // اختیاری شد
    compact?: boolean;
    readOnly?: boolean;                   // جدید
};

export default function ImpactInput({
                                        value,
                                        onChange,
                                        compact = false,
                                        readOnly = false,
                                    }: Props) {
    const min = -3;
    const max = 3;
    const step = 1;

    const isEditable = !readOnly && !!onChange;

    const progress = ((value - min) / (max - min)) * 100;

    // رنگ بر اساس مقدار
    const getColorClass = () => {
        if (value > 0) return "text-emerald-400";
        if (value < 0) return "text-rose-400";
        return "text-gray-400";
    };

    return (
        <div
            className={`
                flex items-center -translate-x-2 gap-1 sm:gap-4
                ${compact ? "scale-90 sm:scale-95 origin-right" : ""}
                ${readOnly ? "opacity-75 pointer-events-none" : ""}
            `}
        >
            <span className="text-xs text-right sm:text-sm text-gray-300/90 font-medium shrink-0">
                شدت اثر <br />رشته سناریو:
            </span>

            <div className="relative flex-1 min-w-[160px] sm:min-w-[180px] flex items-center gap-2.5 sm:gap-3">
                {/* مقدار فعلی */}
                <span
                    className={`
                        text-sm sm:text-base pb-4 font-mono font-semibold w-8 text-center shrink-0
                        ${getColorClass()}
                    `}
                >
                    {value > 0 ? `+${value}` : value}
                </span>

                {/* اسلایدر */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    dir="ltr"
                    disabled={!isEditable}
                    onChange={(e) => isEditable && onChange?.(Number(e.target.value))}
                    className={`
                        w-full h-2.5 sm:h-3 rounded-full appearance-none cursor-${isEditable ? "pointer" : "default"}
                        bg-gray-700/60 transition-all duration-200
                        accent-transparent
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:bg-white
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:shadow-md
                        [&::-webkit-slider-thumb]:cursor-${isEditable ? "pointer" : "default"}
                        [&::-webkit-slider-thumb]:border-2
                        [&::-webkit-slider-thumb]:border-gray-300
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        hover:[&::-webkit-slider-thumb]:scale-${isEditable ? "110" : "100"}
                        active:[&::-webkit-slider-thumb]:scale-95
                        [&::-webkit-slider-runnable-track]:rounded-full
                        ${!isEditable ? "opacity-60" : ""}
                    `}
                />

                {/* لیبل‌های راهنما */}
                <div className="absolute -bottom-5 mb-2 left-0 right-0 flex justify-between text-xs pr-12 text-gray-500 pointer-events-none px-1">
                    <span className="text-emerald-400/80">+3</span>
                    <span>۰</span>
                    <span className="text-rose-400/80">-3</span>
                </div>
            </div>
        </div>
    );
}