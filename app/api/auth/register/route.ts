import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, phone, password } = body;

        if (!name || !phone || !password) {
            return NextResponse.json({ error: 'نام، شماره تلفن و رمز عبور الزامی است' }, { status: 400 });
        }

        // ────────────────────────────── جایگزین چک قبلی ──────────────────────────────
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        const whitelist = db.collection('white-list-signup');

        const allowed = await whitelist.findOne({ phone });
        if (!allowed) {
            return NextResponse.json(
                { error: 'شماره تلفن شما اجازه ثبت‌نام ندارد' },
                { status: 403 }
            );
        }
        // ───────────────────────────────────────────────────────────────────────────────

        if (password.length < 6) {
            return NextResponse.json({ error: 'رمز عبور باید حداقل ۶ کاراکتر باشد' }, { status: 400 });
        }

        const rawSecret = process.env.JWT_SECRET;
        if (typeof rawSecret !== 'string' || rawSecret.length < 32) {
            console.error('JWT_SECRET معتبر نیست');
            return NextResponse.json({ error: 'خطای تنظیمات سرور' }, { status: 500 });
        }

        const users = db.collection('users');

        const existing = await users.findOne({ phone });
        if (existing) {
            return NextResponse.json({ error: 'این شماره تلفن قبلاً ثبت شده است' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await users.insertOne({
            name,
            phone,
            password: hashedPassword,
            createdAt: new Date(),
        });

        const userId = result.insertedId.toString();

        const token = jwt.sign(
            { userId, phone, name },
            rawSecret,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            token,
            user: { id: userId, name, phone }
        }, { status: 201 });

    } catch (err) {
        console.error('خطا در ثبت‌نام:', err);
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}