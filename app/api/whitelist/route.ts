import {NextRequest, NextResponse} from 'next/server';
import {MongoClient, ObjectId} from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

const DB_NAME = process.env.MONGODB_DB_NAME;
const COLLECTION = 'white-list-signup';

export async function GET() {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const coll = db.collection(COLLECTION);

        const items = await coll
            .find({})
            .sort({addedAt: -1})
            .toArray();

        return NextResponse.json({
            success: true,
            data: items.map(i => ({
                ...i,
                _id: i._id.toString(),
                addedAt: i.addedAt?.toISOString?.() || i.addedAt,
            })),
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'خطا در دریافت لیست'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {phone, name} = body;

        if (!phone) {
            return NextResponse.json({error: 'شماره تلفن الزامی است'}, {status: 400});
        }

        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length < 10 || cleaned.length > 12) {
            return NextResponse.json({error: 'فرمت شماره نامعتبر'}, {status: 400});
        }

        await client.connect();
        const db = client.db(DB_NAME);
        const coll = db.collection(COLLECTION);

        const exists = await coll.findOne({phone: cleaned});
        if (exists) {
            return NextResponse.json({error: 'این شماره قبلاً وجود دارد'}, {status: 409});
        }

        const result = await coll.insertOne({
            phone: cleaned,
            name: name?.trim() || null,
            addedAt: new Date(),
            active: true,
        });

        return NextResponse.json(
            {success: true, id: result.insertedId.toString()},
            {status: 201}
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'خطا در افزودن'}, {status: 500});
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({error: 'شناسه آیتم الزامی است'}, {status: 400});
        }

        await client.connect();
        const db = client.db(DB_NAME);
        const coll = db.collection(COLLECTION);

        const result = await coll.deleteOne({_id: new ObjectId(id)});

        if (result.deletedCount === 0) {
            return NextResponse.json({error: 'آیتم یافت نشد'}, {status: 404});
        }

        return NextResponse.json({success: true});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: 'خطا در حذف'}, {status: 500});
    }
}