import { NextResponse } from "next/server";
import { getDBConnection } from "@/app/api/info/db";

// GET isteği ile verileri çekiyoruz
export async function GET() {
    let db;
    try {
        // Veritabanı bağlantısını açıyoruz
        db = await getDBConnection();
        
        // Kategoriler tablosundaki tüm verileri çekiyoruz
        const [categories] = await db.execute(
            "SELECT * FROM categories ORDER BY category_id ASC"
        );
        
        // Çekilen kategorileri JSON formatında geri döndürüyoruz
        return NextResponse.json(categories);
    } catch (error) {
        // Hata durumunda JSON hata mesajı dönüyoruz
        console.error("Kategori çekme hatası:", error);
        return NextResponse.json({ error: "Kategori çekme hatası" }, { status: 500 });
    } finally {
        // Veritabanı bağlantısını kapatıyoruz
        /* if (db) db.end(); */
    }
}
