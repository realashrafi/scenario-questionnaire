// lib/types.ts
export type AnswerDoc = {
    userFingerprint: string
    questionId: string              // مثلاً "Q" یا "Q1-1-3"
    parentPath: string              // "" برای ریشه، "Q" برای سطح دوم، "Q.Q1" برای سطح سوم
    values: number[]                // آرایه احتمالات برای گزینه‌های این node
    timestamp: string               // ISO string
}

export type QuestionsData = {
    Q: QuestionNode
}

export type QuestionNode = {
    title: string
    period?: string
    QS?: Record<string, QuestionNode>[]   // آرایه از آبجکت‌های تک‌کلیدی
}