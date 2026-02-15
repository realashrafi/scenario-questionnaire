'use client'
import React, { useState, useEffect } from "react"
import NormalizedSlidersQuestion from "@/app/components/NormalizedSlidersQuestion"

const Home = () => {
    const [questions, setQuestions] = useState<any>({})
    const [currentStep, setCurrentStep] = useState<number>(0)  // برای مدیریت مراحل
    const [answers, setAnswers] = useState<any>({})

    useEffect(() => {
        // بارگذاری سوالات از فایل JSON
        fetch("/questions.json")
            .then((response) => response.json())
            .then((data) => {
                setQuestions(data)
            })
    }, [])

    const handleSave = (questionId: string, values: number[]) => {
        setAnswers((prev: any) => ({
            ...prev,
            [questionId]: values,
        }))

        // ارسال به API برای ذخیره‌سازی
        fetch("/api/answers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: "USER_123",  // این رو از auth بگیرید
                questionId: questionId,
                answer: values,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Answer saved:", data)
            })
            .catch((error) => {
                console.error("Error saving answer:", error)
            })
    }

    const handleNextStep = () => {
        if (currentStep < Object.keys(questions).length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    // نمایش سوالات براساس مرحله
    const currentQuestion = Object.entries(questions)[currentStep]

    return (
        <div className="min-h-screen bg-slate-800 p-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-3xl font-semibold text-white text-center mb-8">
                    پرسشنامه سناریوهای ژئوپلیتیک
                </h1>

                {currentQuestion ? (
                    <NormalizedSlidersQuestion
                        questionId={currentQuestion[0]}
                        // @ts-ignore
                        options={currentQuestion[1].options}
                        initialValues={answers[currentQuestion[0]] || []}
                        onSaved={handleSave}
                    />
                ) : (
                    <p className="text-white">بارگذاری سوالات...</p>
                )}

                {/* نمایش دکمه‌های قبلی و بعدی */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handlePreviousStep}
                        disabled={currentStep === 0}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        مرحله قبلی
                    </button>
                    <button
                        onClick={handleNextStep}
                        disabled={currentStep === Object.keys(questions).length - 1}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                        مرحله بعد
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home
