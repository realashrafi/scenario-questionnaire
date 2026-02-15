// app/api/answers/route.ts
import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI!
const client = new MongoClient(uri)

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, questionId, answer } = body

        if (!userId || !questionId || answer === undefined) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            )
        }

        await client.connect()
        const db = client.db(process.env.MONGODB_DB_NAME)

        const answers = db.collection("answers")

        await answers.updateOne(
            { userId, questionId },
            {
                $set: {
                    userId,
                    questionId,
                    answer,
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date()
                }
            },
            { upsert: true }
        )

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json(
            { error: "Server error", details: String(err) },
            { status: 500 }
        )
    }
}
// app/api/answers/route.ts
export async function GET(req: Request) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.search)

    // استخراج مقادیر از query params
    const userId = searchParams.get("userId")
    const questionId = searchParams.get("questionId")

    // بررسی اینکه مقادیر وجود دارند
    if (!userId || !questionId) {
        return NextResponse.json(
            { error: "Missing userId or questionId" },
            { status: 400 }
        )
    }

    try {
        await client.connect()
        const db = client.db(process.env.MONGODB_DB_NAME)
        const answers = db.collection("answers")

        const result = await answers.findOne({ userId, questionId })

        if (!result) {
            return NextResponse.json({ error: "Answer not found" }, { status: 404 })
        }

        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json(
            { error: "Server error", details: String(err) },
            { status: 500 }
        )
    }
}

