// app/api/admin/users-summary/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
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

        // اگر بعداً خواستی فقط ادمین بتونه ببینه → اینجا چک role یا userId خاص اضافه کن
        // مثلاً: if (decoded.userId !== 'ADMIN_USER_ID') return 403;

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        const users = await db.collection('users')
            .find({})
            .project({ _id: 1, name: 1, phone: 1, createdAt: 1 })
            .toArray();

        const summaries = await Promise.all(users.map(async (user) => {
            const probDoc = await db.collection('probabilities').findOne(
                { userId: user._id.toString() },
                { projection: { probabilities: 1, updatedAt: 1 } }
            );

            const probs = probDoc?.probabilities || {};

            const startedCount = Object.keys(probs).filter(k =>
                k.startsWith('Q.') && (k.match(/\./g) || []).length === 1
            ).length;

            const filledCount = Object.keys(probs).length;
            const progress = Math.min(100, Math.round(filledCount * 1.5)); // تنظیم کن

            return {
                userId: user._id.toString(),
                name: user.name || 'نامشخص',
                phone: user.phone || '-',
                registeredAt: user.createdAt ? user.createdAt.toISOString() : null,
                lastActive: probDoc?.updatedAt ? probDoc.updatedAt.toISOString() : null,
                progress,
                startedScenarios: startedCount,
            };
        }));

        return NextResponse.json({
            success: true,
            users: summaries,
            total: summaries.length
        });

    } catch (err: any) {
        console.error('خطا در users-summary:', err);
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return NextResponse.json({ error: 'توکن نامعتبر یا منقضی شده' }, { status: 401 });
        }
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}