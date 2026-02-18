// app/api/suggestions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
    try {
        const rawSecret = process.env.JWT_SECRET;
        if (typeof rawSecret !== "string" || rawSecret.length < 32) {
            console.error("JWT_SECRET معتبر نیست");
            return NextResponse.json({ error: "خطای تنظیمات سرور" }, { status: 500 });
        }

        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "توکن ارسال نشده است" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, rawSecret) as { userId: string };

        const { suggestion } = await request.json();

        if (!suggestion || typeof suggestion !== "string" || suggestion.trim().length < 1) {
            return NextResponse.json({ error: "متن پیشنهاد نامعتبر یا خیلی کوتاه است" }, { status: 400 });
        }

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("suggestions");

        const result = await collection.insertOne({
            userId: decoded.userId,
            suggestion: suggestion.trim(),
            createdAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            insertedId: result.insertedId,
        });
    } catch (err: any) {
        console.error("خطا در ذخیره پیشنهاد:", err);
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return NextResponse.json({ error: "توکن نامعتبر یا منقضی شده است" }, { status: 401 });
        }
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const rawSecret = process.env.JWT_SECRET;
        if (typeof rawSecret !== "string" || rawSecret.length < 32) {
            console.error("JWT_SECRET معتبر نیست");
            return NextResponse.json({ error: "خطای تنظیمات سرور" }, { status: 500 });
        }

        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "توکن لازم است" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, rawSecret) as { userId: string };

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection("suggestions");

        const suggestions = await collection
            .find({ userId: decoded.userId })
            .sort({ createdAt: -1 }) // جدیدترین اول
            .project({ _id: 1, suggestion: 1, createdAt: 1 })
            .toArray();

        return NextResponse.json({
            success: true,
            suggestions: suggestions.map((doc) => ({
                id: doc._id.toString(),
                suggestion: doc.suggestion,
                createdAt: doc.createdAt.toISOString(),
            })),
        });
    } catch (err: any) {
        console.error("خطا در خواندن پیشنهادها:", err);
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return NextResponse.json({ error: "توکن نامعتبر یا منقضی شده است" }, { status: 401 });
        }
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}