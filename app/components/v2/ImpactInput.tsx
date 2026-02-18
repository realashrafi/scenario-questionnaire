// components/ImpactInput.tsx
"use client";

type Props = {
    value: number;
    onChange: (value: number) => void;
    compact?: boolean;
};

export default function ImpactInput({ value, onChange, compact = false }: Props) {
    const min = -3;
    const max = 3;
    const step = 1;

    // درصد پرشدگی track برای gradient
    const progress = ((value - min) / (max - min)) * 100;

    return (
        <div
            className={`
        flex items-center -translate-x-2 gap-1 sm:gap-4
        ${compact ? "scale-90 sm:scale-95 origin-right" : ""}
      `}
        >
      <span className="text-xs text-right sm:text-sm text-gray-300/90 font-medium  shrink-0">
        شدت اثر <br/>رشته سناریو:
      </span>

            <div className="relative flex-1 min-w-[160px] sm:min-w-[180px] flex items-center gap-2.5 sm:gap-3">
                {/* مقدار فعلی */}
                <span
                    className={`
            text-sm sm:text-base pb-4 font-mono font-semibold w-8 text-center shrink-0
            ${value > 0 ? "text-emerald-400" : value < 0 ? "text-rose-400" : "text-gray-400"}
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
                    dir={'ltr'}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`
            w-full h-2.5 sm:h-3 rounded-full appearance-none cursor-pointer
            bg-gray-700/60 transition-all duration-200
            accent-transparent
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-gray-300
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-150
            hover:[&::-webkit-slider-thumb]:scale-110
            active:[&::-webkit-slider-thumb]:scale-95
            [&::-webkit-slider-runnable-track]:rounded-full
          `}
                />

                {/* لیبل‌های راهنما پایین اسلایدر */}
                <div className="absolute -bottom-5 mb-2 left-0 right-0 flex justify-between text-xs pr-12 text-gray-500 pointer-events-none px-1">
                    <span className="text-emerald-400/80 ">+3</span>
                    <span>۰</span>
                    <span className="text-rose-400/80">-3</span>                </div>
            </div>
        </div>
    );
}