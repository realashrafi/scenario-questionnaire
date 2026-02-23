// app/api/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(req: NextRequest) {
    try {
        const { phone } = await req.json();
        if (!phone || !/^09\d{9}$/.test(phone)) {
            return NextResponse.json({ error: "شماره موبایل معتبر نیست" }, { status: 400 });
        }

        // چک وجود کاربر (اختیاری اما توصیه می‌شه)
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME!);
        const users = db.collection("users");
        const userExists = await users.findOne({ phone });
        if (!userExists) {
            return NextResponse.json({ error: "شماره در سیستم ثبت نشده" }, { status: 404 });
        }

        // تولید کد
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // ۶ رقمی

        // زمان انقضا: ۳ دقیقه بعد
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

        const otps = db.collection("reset_otps");
        await otps.insertOne({
            phone,
            code,
            expiresAt,
            attempts: 0,
            createdAt: new Date(),
        });

        // ارسال با کاوه‌نگار
        const API_KEY = process.env.KAVENEGAR_API_KEY!;
        const TEMPLATE = "resetpassword"; // در پنل تعریف کن

        const url = `https://api.kavenegar.com/v1/${API_KEY}/verify/lookup.json?receptor=${phone}&token=${code}&template=${TEMPLATE}`;

        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("خطا در ارسال OTP");
        }

        return NextResponse.json({
            success: true,
            message: "کد تأیید برای شما ارسال شد (۳ دقیقه اعتبار دارد)",
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}