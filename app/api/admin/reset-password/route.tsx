// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone, newPassword } = body;

        // اعتبارسنجی ورودی
        if (!phone || !newPassword) {
            return NextResponse.json(
                { error: "شماره تلفن و رمز عبور جدید الزامی است" },
                { status: 400 }
            );
        }

        if (typeof newPassword !== "string" || newPassword.length < 6) {
            return NextResponse.json(
                { error: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد" },
                { status: 400 }
            );
        }

        // اتصال به دیتابیس
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);
        const users = db.collection("users");

        // پیدا کردن کاربر با شماره تلفن
        const user = await users.findOne({ phone });

        if (!user) {
            return NextResponse.json(
                { error: "شماره تلفن در سیستم ثبت نشده است" },
                { status: 404 }
            );
        }

        // هش کردن پسورد جدید
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // آپدیت پسورد
        const updateResult = await users.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date(),
                    // اختیاری: می‌تونی فیلد lastPasswordReset هم اضافه کنی
                    // lastPasswordReset: new Date(),
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { error: "تغییر رمز عبور انجام نشد" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "رمز عبور با موفقیت تغییر یافت. حالا می‌توانید وارد شوید.",
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.error("خطا در ریست پسورد:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    } finally {
        // client.close();  ← در محیط serverless بهتره باز بمونه یا از connection pool استفاده بشه
    }
}