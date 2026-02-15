'use client'
import NormalizedSlidersQuestion from "@/app/components/NormalizedSlidersQuestion";


const questionData = {
    questionId: "Q1_E4",
    options: [
        { key: "E4-1", label: "جنگ/حمله نظامی" },
        { key: "E4-2", label: "توافق" },
        { key: "E4-3", label: "تعلیق مزمن" }
    ],
    initialValues: [33.33, 33.33, 33.34]
}

export default function Home() {
    const handleSave = (questionId: string, values: number[]) => {
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
            .then(response => response.json())
            .then(data => {
                console.log("Answer saved:", data)
            })
            .catch(error => {
                console.error("Error saving answer:", error)
            })
    }


    return (
        <div className="min-h-screen bg-slate-800 p-10">
            <NormalizedSlidersQuestion {...questionData} onSaved={handleSave} />
        </div>
    )
}
