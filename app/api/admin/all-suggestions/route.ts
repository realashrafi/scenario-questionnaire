

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB_NAME);

        const suggestions = await db.collection("suggestions").aggregate([
            {
                $addFields: {
                    userIdObj: { $toObjectId: "$userId" }   // ← این خط مهم
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userIdObj",              // حالا ObjectId است
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    _id: 1,
                    suggestion: 1,
                    createdAt: 1,
                    userId: 1,               // string اصلی
                    userName:  { $ifNull: ["$user.name",  "نامشخص"] },
                    userPhone: { $ifNull: ["$user.phone", "نامشخص"] },
                    // اگر فیلد تلفن اسمش mobile یا phoneNumber است اینجا اصلاح کن
                }
            }
        ]).toArray();

        const result = suggestions.map(doc => ({
            id: doc._id.toString(),
            suggestion: doc.suggestion,
            createdAt: doc.createdAt.toISOString(),
            userId: doc.userId,
            userName: doc.userName,
            userPhone: doc.userPhone,
        }));

        return NextResponse.json({
            success: true,
            count: result.length,
            suggestions: result
        });

    } catch (err: any) {
        console.error("خطا:", err);
        return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
    }
}