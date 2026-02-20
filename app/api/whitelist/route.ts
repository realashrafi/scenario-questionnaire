import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

const DB_NAME = process.env.MONGODB_DB_NAME;
const COLLECTION_NAME = 'white-list-signup';

export async function GET() {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const items = await collection
            .find({})
            .sort({ addedAt: -1 })
            .project({ _id: 1, phone: 1, name: 1, addedAt: 1, active: 1 })
            .toArray();

        return NextResponse.json({
            success: true,
            count: items.length,
            data: items.map(item => ({
                ...item,
                _id: item._id.toString(),
                addedAt: item.addedAt?.toISOString(),
            })),
        });
    } catch (err) {
        console.error('خطا در دریافت لیست whitelist:', err);
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone, name } = body;

        if (!phone) {
            return NextResponse.json(
                { error: 'شماره تلفن الزامی است' },
                { status: 400 }
            );
        }

        // ساده‌سازی شماره (فقط اعداد نگه می‌داریم - می‌تونی سخت‌گیرانه‌تر کنی)
        const cleanedPhone = phone.replace(/\D/g, '');

        if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
            return NextResponse.json(
                { error: 'فرمت شماره تلفن نامعتبر است' },
                { status: 400 }
            );
        }

        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);


        const exists = await collection.findOne({ phone: cleanedPhone });
        if (exists) {
            return NextResponse.json(
                { error: 'این شماره تلفن قبلاً ثبت شده است' },
                { status: 409 }
            );
        }

        const result = await collection.insertOne({
            phone: cleanedPhone,
            name: name || null,
            addedAt: new Date(),
            active: true,
        });

        return NextResponse.json(
            {
                success: true,
                message: 'شماره با موفقیت اضافه شد',
                id: result.insertedId.toString(),
                phone: cleanedPhone,
                name: name || undefined,
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('خطا در اضافه کردن به whitelist:', err);
        return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
    }
}