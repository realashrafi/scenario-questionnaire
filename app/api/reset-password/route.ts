// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    try {
        const { phone, code, newPassword } = await req.json();

        if (!phone || !code || !newPassword) {
            return NextResponse.json({ error: "همه فیلدها الزامی هستند" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "رمز عبور حداقل ۶ کاراکتر" }, { status: 400 });
        }

        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME!);
        const otps = db.collection("reset_otps");

        // پیدا کردن OTP معتبر
        const otpDoc = await otps.findOne({
            phone,
            code,
            expiresAt: { $gt: new Date() }, // هنوز منقضی نشده
        });

        if (!otpDoc) {
            // می‌تونی اینجا attempts رو افزایش بدی و بعد از ۵ بار بلاک کنی
            return NextResponse.json(
                { error: "کد اشتباه است یا منقضی شده. لطفاً دوباره درخواست کد دهید" },
                { status: 400 }
            );
        }

        // کد درست بود → حذف OTP (اختیاری، TTL خودش پاک می‌کنه ولی بهتره دستی حذف کنیم)
        await otps.deleteOne({ _id: otpDoc._id });

        // تغییر رمز کاربر
        const users = db.collection("users");
        const user = await users.findOne({ phone });
        if (!user) {
            return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updateResult = await users.updateOne(
            { _id: user._id },
            {
                $set: {
                    password: hashedPassword,
                    updatedAt: new Date(),
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ error: "تغییر رمز انجام نشد" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: "رمز عبور با موفقیت تغییر یافت",
        });
    } catch (err) {
        console.error("Reset error:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}