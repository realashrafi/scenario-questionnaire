// lib/jwt.ts
export const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error(
        'متغیر محیطی JWT_SECRET تنظیم نشده است. لطفاً در فایل .env مقدار معتبر بگذارید.'
    );
}

// حالا می‌تونی در همه جا فقط import کنی و خیالت راحت باشه