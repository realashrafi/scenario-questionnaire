// components/questions/TreeNodeQuestion.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import debounce from 'lodash/debounce'
import {QuestionNode} from "@/app/lib/types";


type Props = {
    node: QuestionNode
    questionId: string
    parentPath: string
    currentValues: number[]
    optionsCount: number
    onValuesChange: (newValues: number[]) => void
    onRequestNext: () => void
    isLoading?: boolean
}

export default function TreeNodeQuestion({
                                             node,
                                             questionId,
                                             parentPath,
                                             currentValues = [],
                                             optionsCount,
                                             onValuesChange,
                                             onRequestNext,
                                             isLoading = false,
                                         }: Props) {
    const [localValues, setLocalValues] = useState<number[]>([])

    useEffect(() => {
        if (currentValues.length === optionsCount && currentValues.reduce((a, b) => a + b, 0) === 100) {
            setLocalValues(currentValues)
        } else {
            const equal = Math.floor(100 / optionsCount)
            const remainder = 100 - equal * optionsCount
            const initial = new Array(optionsCount).fill(equal)
            for (let i = 0; i < remainder; i++) initial[i]++
            setLocalValues(initial)
        }
    }, [currentValues, optionsCount])

    const sum = localValues.reduce((a, b) => a + b, 0)
    const isValid = sum === 100 && !localValues.every(v => v === 0)

    const updateSlider = useCallback(
        (index: number, newVal: number) => {
            let clamped = Math.max(0, Math.min(100, Math.round(newVal)))
            const newVals = [...localValues]
            newVals[index] = clamped

            const sumOthers = newVals.reduce((acc, v, i) => (i === index ? acc : acc + v), 0)
            const remaining = 100 - clamped

            if (sumOthers > 0) {
                const ratio = remaining / sumOthers
                newVals.forEach((_, i) => {
                    if (i !== index) newVals[i] = Math.round(newVals[i] * ratio)
                })
            } else {
                const share = Math.floor(remaining / (optionsCount - 1))
                const rem = remaining - share * (optionsCount - 1)
                let offset = 0
                for (let i = 0; i < optionsCount; i++) {
                    if (i !== index) {
                        newVals[i] = share + (offset < rem ? 1 : 0)
                        if (offset < rem) offset++
                    }
                }
            }

            let finalSum = newVals.reduce((a, b) => a + b, 0)
            if (finalSum !== 100) newVals[0] += 100 - finalSum

            setLocalValues(newVals)
            onValuesChange(newVals)
        },
        [localValues, optionsCount, onValuesChange],
    )

    const debouncedSave = useCallback(
        debounce(async (values: number[]) => {
            const fingerprint = localStorage.getItem('userFingerprint')
            if (!fingerprint) return

            try {
                const res = await fetch('/api/answers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userFingerprint: fingerprint,
                        questionId,
                        parentPath,
                        values,
                        timestamp: new Date().toISOString(),
                    }),
                })
                if (res.ok) {
                    console.log(`ذخیره موفق → ${questionId}`)
                } else {
                    console.warn(`ذخیره ناموفق → ${questionId}  status: ${res.status}`)
                }
            } catch (err) {
                console.error('خطا در ذخیره:', err)
            }
        }, 1000),
        [questionId, parentPath],
    )

    useEffect(() => {
        if (isValid) debouncedSave(localValues)
    }, [localValues, debouncedSave, isValid])

    const options = (node.QS || []).map(item => {
        const [key, n] = Object.entries(item)[0]
        return { key, title: n.title }
    })

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-slate-700/50"
        >
            <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">{node.title}</h2>
                {node.period && <p className="text-slate-400 text-sm md:text-base">{node.period}</p>}
            </div>

            <div className="space-y-5 md:space-y-6">
                {options.map((opt, idx) => (
                    <div key={opt.key} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                        <label className="text-slate-200 flex-1 text-[15px] leading-snug">{opt.title}</label>
                        <div className="flex items-center gap-3 min-w-[160px]">
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={localValues[idx] ?? 0}
                                onChange={e => updateSlider(idx, Number(e.target.value))}
                                className="w-full accent-indigo-500 cursor-pointer"
                                disabled={isLoading}
                            />
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={localValues[idx] ?? 0}
                                onChange={e => updateSlider(idx, Number(e.target.value))}
                                className="w-16 text-center bg-slate-800 border border-slate-600 rounded py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                disabled={isLoading}
                            />
                            <span className="text-slate-400 text-sm">%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-medium">
          <span className={sum === 100 ? 'text-green-400' : 'text-red-400'}>
            جمع: {sum}%
          </span>
                </div>

                <button
                    onClick={onRequestNext}
                    disabled={!isValid || isLoading}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition min-w-[140px] disabled:cursor-not-allowed"
                >
                    {isLoading ? 'در حال ذخیره...' : 'ادامه'}
                </button>
            </div>
        </motion.div>
    )
}