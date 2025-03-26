import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import { getDBConnection } from "@/app/api/info/db";
import { RowDataPacket } from "mysql2";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req: NextRequest) {
    try {
        const { action, email, password } = await req.json();
        if (!action || !email || !password) {
            return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 });
        }

        const db = await getDBConnection();

        if (action === "login") {
            const [rows] = await db.execute<RowDataPacket[]>("SELECT id, email, password_hash FROM users WHERE email = ?", [email]);

            if (!Array.isArray(rows) || rows.length === 0) {
                return NextResponse.json({ error: "Geçersiz giriş bilgileri" }, { status: 401 });
            }

            const user = rows[0] as { id: number; email: string; password_hash: string };
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return NextResponse.json({ error: "Geçersiz giriş bilgileri" }, { status: 401 });
            }

            // const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
            // return NextResponse.json({ token }, { status: 200 });
            return NextResponse.json({ message: "Giriş başarılı" }, { status: 200 });
        }

        if (action === "register") {
            const [existingUsers] = await db.execute<RowDataPacket[]>("SELECT id FROM users WHERE email = ?", [email]);

            if (Array.isArray(existingUsers) && existingUsers.length > 0) {
                return NextResponse.json({ error: "Bu e-posta zaten kullanılıyor" }, { status: 400 });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute("INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, NOW())", [email, hashedPassword]);

            return NextResponse.json({ message: "Kayıt başarılı" }, { status: 201 });
        }

        return NextResponse.json({ error: "Geçersiz işlem" }, { status: 400 });
    } catch (error) {
        console.error("Auth API Hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}

// GET isteği için eklenen yeni fonksiyon
export async function GET(req: NextRequest) {
    return NextResponse.json({ message: "Bu endpoint yalnızca POST metodunu destekler." }, { status: 405 });
}
