// app/api/results/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    // می‌تونی اینجا از دیتابیس بخوانی یا ثابت برگردونی
    const sampleData = {
        count: 47,
        mq1: 36,
        mq2: 27,
        mq3: 38,
        war_prob: "جنگ - تغییر نظام سیاسی - تغییر نظام سیاسی",
        war_risk: "جنگ - آشوب - آشوب",
        war_gain: "جنگ - تغییر نظام سیاسی - تغییر نظام سیاسی",
        agree_prob: "توافق - تداوم - تداوم",
        agree_risk: "توافق - تداوم - آشوب",
        agree_gain: "توافق - تداوم - تداوم",
        uk_prob: "تعلیق - جنگ - تغییر نظام سیاسی",
        uk_risk: "تعلیق - تعلیق - آشوب",
        uk_gain: "تعلیق - جنگ - تغییر نظام سیاسی",
    };

    return NextResponse.json({ success: true, data: sampleData });
}