"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

type Node = {
    title: string
    period?: string
    QS?: Record<string, Node>[]
}

type Props = {
    node: Node
    path: string          // مثلاً "Q" یا "Q.Q1" یا "Q.Q1.Q1-1"
    answers: Record<string, number>
    onChange: (fullPath: string, value: number) => void
    level?: number
}

export default function TreeQuestion({
                                         node,
                                         path,
                                         answers,
                                         onChange,
                                         level = 0
                                     }: Props) {
    const currentValue = answers[path] ?? 0

    const childNodes = node.QS || []

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-xl ${level === 0 ? 'bg-slate-800' : 'bg-slate-900/70'}`}
            style={{ marginLeft: `${level * 20}px` }}
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-white">
                    {node.title}
                    {node.period && <span className="text-sm text-gray-400 mr-2">({node.period})</span>}
                </h3>

                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={0}
                        max={100}
                        value={currentValue}
                        onChange={e => {
                            const v = Math.max(0, Math.min(100, Number(e.target.value) || 0))
                            onChange(path, v)
                        }}
                        className="w-20 text-center bg-slate-700 border border-slate-600 rounded py-1 text-white"
                    />
                    <span className="text-sm text-gray-400">%</span>
                </div>
            </div>

            {/* فقط اگر مقداری > 0 داده شده باشد، بچه‌ها را نشان بده */}
            {currentValue > 0 && childNodes.length > 0 && (
                <div className="mt-4 space-y-3 border-r-2 border-indigo-500/30 pr-4">
                    {childNodes.map((childObj, idx) => {
                        const [childKey, childNode] = Object.entries(childObj)[0]
                        const childPath = path ? `${path}.${childKey}` : childKey

                        return (
                            <TreeQuestion
                                key={childKey}
                                node={childNode}
                                path={childPath}
                                answers={answers}
                                onChange={onChange}
                                level={level + 1}
                            />
                        )
                    })}
                </div>
            )}
        </motion.div>
    )
}