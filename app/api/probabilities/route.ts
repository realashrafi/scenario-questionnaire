import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
    try {
        const rawSecret = process.env.JWT_SECRET;
        if (typeof rawSecret !== 'string' || rawSecret.length < 32) {
            console.error('JWT_SECRET معتبر نیست');
            return NextResponse.json({ error: 'خطای تنظیمات سرور' }, { status: 500 });
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'توکن ارسال نشده است' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, rawSecret) as { userId: string };

        const { probabilities } = await request.json();

        if (!probabilities || typeof probabilities !== 'object') {
            return NextResponse.json({ error: 'داده‌های احتمالات نامعتبر است' }, { status: 400 });
        }

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection('probabilities');

        const result = await collection.updateOne(
            { userId: decoded.userId },
            {
                $set: {
                    probabilities,
                    updatedAt: new Date(),
                    userId: decoded.userId
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            upserted: !!result.upsertedId
        });

    } catch (err: any) {
        console.error('خطا در ذخیره احتمالات:', err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return NextResponse.json({ error: 'توکن نامعتبر یا منقضی شده است' }, { status: 401 });
        }
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const rawSecret = process.env.JWT_SECRET;
        if (typeof rawSecret !== 'string' || rawSecret.length < 32) {
            console.error('JWT_SECRET معتبر نیست');
            return NextResponse.json({ error: 'خطای تنظیمات سرور' }, { status: 500 });
        }

        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'توکن لازم است' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, rawSecret) as { userId: string };

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const collection = db.collection('probabilities');

        const doc = await collection.findOne(
            { userId: decoded.userId },
            { projection: { _id: 0, probabilities: 1, updatedAt: 1 } }
        );

        if (!doc) {
            return NextResponse.json({ success: true, probabilities: {} });
        }

        return NextResponse.json({
            success: true,
            probabilities: doc.probabilities,
            updatedAt: doc.updatedAt
        });

    } catch (err: any) {
        console.error('خطا در خواندن احتمالات:', err);
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}