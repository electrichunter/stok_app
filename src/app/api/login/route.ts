import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getDBConnection } from "@/app/api/info/db";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        const db = await getDBConnection();

        // Kullanıcıyı veritabanından al
        const [rows]: any = await db.execute(
            "SELECT user_id, email, password_hash, role_id FROM users WHERE email = ?",
            [email]
        );

        // Kullanıcı var mı kontrol et
        if (rows.length === 0) {
            return NextResponse.json({ error: "Geçersiz giriş bilgileri1" }, { status: 401 });
        }

        const user = rows[0];

        // Şifreyi doğrula (hashleme)
     /*    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Geçersiz giriş bilgileri 2" }, { status: 401 });
        } */
    // Şifreyi doğrudan karşılaştır (hashleme olmadan doğrudan karşılaştırma test amaçlı yapıldı)
    if (password !== user.password_hash) {
        return NextResponse.json({ error: "Geçersiz giriş bilgileri" }, { status: 401 });
    }
        // JWT oluştur (role_id'yi de ekliyoruz)
        const token = jwt.sign(
            {
                id: user.user_id, 
                email: user.email, 
                role_id: user.role_id // role_id'yi token'a ekliyoruz
            },
            "your_secret_key", // Gizli anahtar
            { expiresIn: "1h" } // 1 saatlik geçerlilik
        );

        return NextResponse.json({ token });

    } catch (error) {
        console.error("Login API Hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
    }
}
