"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"

// نوع گزینه‌ها
type Option = {
    key: string
    label: string
}

type Props = {
    questionId: string
    options: Option[]
    initialValues?: number[]
    onSaved?: (questionId: string, values: number[]) => void
    onNextStep?: () => void
    onPreviousStep?: () => void
    isLastStep?: boolean
}

function useDebounce(fn: Function, delay: number) {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    return (args: any) => {
        if (timer) {
            clearTimeout(timer)
        }
        setTimer(setTimeout(() => fn(args), delay))
    }
}

export default function NormalizedSlidersQuestion({
                                                      questionId,
                                                      options,
                                                      initialValues = [],
                                                      onSaved,
                                                      onNextStep,
                                                      onPreviousStep,
                                                      isLastStep = false
                                                  }: Props) {
    const [values, setValues] = useState<number[]>([])

    // مقداردهی اولیه مقادیر اسلایدر
    useEffect(() => {
        if (initialValues.length === options.length) {
            setValues(initialValues)
        } else {
            setValues(new Array(options.length).fill(100 / options.length))
        }
    }, [options, initialValues])

    // متد به‌روزرسانی مقادیر اسلایدر
    const updateValues = (index: number, newValue: number) => {
        const clampedValue = Math.max(0, Math.min(100, newValue)) // محدود کردن به 0 تا 100
        const newValues = [...values]
        newValues[index] = clampedValue

        // محاسبه باقی‌مانده
        const remaining = 100 - clampedValue
        const sumOthers = newValues.reduce((acc, val, i) => i !== index ? acc + val : acc, 0)

        // توزیع باقی‌مانده
        if (sumOthers > 0) {
            const rest = remaining
            newValues.forEach((val, i) => {
                if (i !== index) {
                    const proportion = (values[i] / sumOthers) * rest
                    newValues[i] = parseFloat((proportion).toFixed(2)) // رند کردن
                }
            })
        } else {
            // اگر هیچ مقداری نداریم، تقسیم مساوی
            const equalShare = remaining / (values.length - 1)
            newValues.forEach((_, i) => {
                if (i !== index) {
                    newValues[i] = equalShare
                }
            })
        }

        setValues(newValues)

        // ارسال به والد
        if (onSaved) {
            onSaved(questionId, newValues)
        }
    }

    // ایجاد گرادیانت برای پس‌زمینه اسلایدر
    const getSliderBackground = (value: number) => {
        const percentage = value
        return `linear-gradient(to right, #4A90E2 ${percentage}%, #B0B0B0 ${percentage}%)`
    }

    // استفاده از Debounce برای کاهش تعداد فراخوانی‌ها
    const handleSave = useDebounce((newValues: number[]) => {
        if (onSaved) {
            onSaved(questionId, newValues)
        }
    }, 1000) // 1000 میلی‌ثانیه تاخیر برای جلوگیری از درخواست‌های مکرر

    return (
        <motion.div
            className="w-full bg-slate-900 p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h2 className="text-xl text-white font-semibold mb-4">سوال: {questionId}</h2>
            <div className="space-y-4">
                {options.map((option, index) => (
                    <motion.div
                        key={option.key}
                        className="flex justify-between items-center"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="text-white text-sm">{option.label}</div>
                        <input
                            type="number"
                            value={values[index] || 0}
                            min={0}
                            max={100}
                            onChange={(e) => updateValues(index, parseFloat(e.target.value))}
                            className="w-24 px-3 py-2 rounded-md bg-slate-800 text-white text-sm"
                            style={{
                                background: getSliderBackground(values[index]),
                                border: "none"
                            }}
                        />
                    </motion.div>
                ))}
            </div>
            <div className="mt-4 flex justify-between">
                <div className="text-sm text-white">جمع: {values.reduce((acc, val) => acc + val, 0).toFixed(2)}%</div>
                <div className="text-sm text-green-400">
                    {values.reduce((acc, val) => acc + val, 0) === 100 ? "مجموع درست است" : "مجموع باید 100 باشد"}
                </div>
            </div>

            {/* دکمه‌های رفتن به مرحله بعد یا قبلی */}
            <div className="mt-4 flex justify-between">
                {onPreviousStep && (
                    <button
                        onClick={onPreviousStep}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        مرحله قبلی
                    </button>
                )}
                {!isLastStep && onNextStep && (
                    <button
                        onClick={onNextStep}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        مرحله بعد
                    </button>
                )}
            </div>
        </motion.div>
    )
}
