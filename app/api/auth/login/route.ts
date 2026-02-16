import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json({ error: 'شماره تلفن و رمز عبور الزامی است' }, { status: 400 });
        }

        const rawSecret = process.env.JWT_SECRET;
        if (typeof rawSecret !== 'string' || rawSecret.length < 32) {
            console.error('JWT_SECRET معتبر نیست');
            return NextResponse.json({ error: 'خطای تنظیمات سرور' }, { status: 500 });
        }

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const users = db.collection('users');

        const user = await users.findOne({ phone });

        if (!user) {
            return NextResponse.json({ error: 'کاربری با این شماره یافت نشد' }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return NextResponse.json({ error: 'رمز عبور اشتباه است' }, { status: 401 });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                phone: user.phone,
                name: user.name
            },
            rawSecret,
            { expiresIn: '7d' }
        );

        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                phone: user.phone
            }
        });

    } catch (err) {
        console.error('خطا در ورود:', err);
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}