import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(request: NextRequest) {
    try {
        // ۱. گرفتن توکن از هدر
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'توکن ارسال نشده یا فرمت اشتباه است' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // ۲. verify کردن توکن
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { error: 'توکن نامعتبر یا منقضی شده است' },
                { status: 401 }
            );
        }

        const userId = decoded.userId;
        if (!userId) {
            return NextResponse.json(
                { error: 'اطلاعات کاربر در توکن یافت نشد' },
                { status: 401 }
            );
        }

        // ۳. اتصال به دیتابیس
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const users = db.collection('users');

        // ۴. پیدا کردن کاربر (بدون فیلد password برگردان)
        const user = await users.findOne(
            { _id: new ObjectId(userId) },
            {
                projection: {
                    password: 0,           // مهم: رمز عبور رو هرگز برنگردون
                    // اگر فیلدهای حساس دیگری داری اینجا حذف کن
                }
            }
        );

        if (!user) {
            return NextResponse.json(
                { error: 'کاربر یافت نشد' },
                { status: 404 }
            );
        }

        // تبدیل _id به string (برای فرانت‌اند راحت‌تر)
        const userResponse = {
            ...user,
            id: user._id.toString(),
            _id: undefined,           // حذف _id اصلی اگر نمی‌خوای
        };

        return NextResponse.json({
            success: true,
            user: userResponse
        });

    } catch (err) {
        console.error('خطا در روت /me:', err);
        return NextResponse.json(
            { error: 'خطای سرور' },
            { status: 500 }
        );
    } finally {
        await client.close().catch(() => {});
    }
}