// app/api/answers/route.ts
import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import {AnswerDoc} from "@/app/lib/types";

const uri = process.env.MONGODB_URI!
const client = new MongoClient(uri)

export async function POST(request: Request) {
    try {
        const body: AnswerDoc = await request.json()

        if (!body.userFingerprint || !body.questionId || !body.values) {
            return NextResponse.json({ error: 'فیلدهای ضروری موجود نیست' }, { status: 400 })
        }

        await client.connect()
        const db = client.db(process.env.MONGODB_DB_NAME)
        const collection = db.collection('answers')

        const result = await collection.updateOne(
            {
                userFingerprint: body.userFingerprint,
                questionId: body.questionId
            },
            { $set: body },
            { upsert: true }
        )

        return NextResponse.json({ success: true, upserted: !!result.upsertedId })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const userFingerprint = searchParams.get('user')

    if (!userFingerprint) {
        return NextResponse.json({ error: 'شناسه کاربر لازم است' }, { status: 400 })
    }

    try {
        await client.connect()
        const db = client.db(process.env.MONGODB_DB_NAME)
        const collection = db.collection('answers')

        // همه پاسخ‌های این کاربر رو بگیر (مرتب بر اساس timestamp نزولی)
        const cursor = collection.find(
            { userFingerprint },
            {
                sort: { timestamp: -1 },
                projection: { _id: 0, timestamp: 1, questionId: 1, parentPath: 1, values: 1 }
            }
        )

        const answers = await cursor.toArray()

        return NextResponse.json({
            success: true,
            answers,
            count: answers.length
        })
    } catch (err) {
        console.error('GET answers error:', err)
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
    }
}