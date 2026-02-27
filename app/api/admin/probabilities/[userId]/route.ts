// app/api/admin/probabilities/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }   // ← نوع params رو Promise تعریف کن
) {
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

        // ← اینجا await کن!
        const params = await context.params;
        const userId = params.userId;   // حالا امن است

        console.log("Requested userId:", userId);   // برای دیباگ

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        const doc = await db.collection('probabilities').findOne(
            { userId: userId },
            { projection: { _id: 0, probabilities: 1, updatedAt: 1 } }
        );

        console.log("Found document:", doc ? "Yes" : "No", doc?.userId);

        if (!doc) {
            return NextResponse.json({
                success: true,
                probabilities: {},
                message: 'هیچ احتمالی ثبت نشده',
                requestedUserId: userId   // دیباگ بهتر
            });
        }

        return NextResponse.json({
            success: true,
            probabilities: doc.probabilities,
            lastUpdated: doc.updatedAt ? doc.updatedAt.toISOString() : null
        });

    } catch (err: any) {
        console.error('خطا در admin probabilities:', err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return NextResponse.json({ error: 'توکن نامعتبر یا منقضی شده' }, { status: 401 });
        }
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}