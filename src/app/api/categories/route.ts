import { NextResponse } from "next/server";
import { getDBConnection } from "@/app/api/info/db";
import { NextRequest } from "next/server";
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





    // 📌 Ürün ekleme
export async function POST(request: NextRequest) {
    const db = await getDBConnection();
    try {
        const { category_info,category_name } = await request.json();

        if (!category_info && !category_name) {
            return NextResponse.json({ error: "Tüm alanlar zorunludur!" }, { status: 400 });
        }

        const query = `
            INSERT INTO categories
            (category_name, category_info)
            VALUES (?, ?)
        `;
        
        await db.execute(query, [
            category_name,
            category_info,
        ]);

        return NextResponse.json({ success: true, message: "Ürün başarıyla eklendi!" });
    } catch (error) {
        console.error("Ürün ekleme hatası:", error);
        return NextResponse.json({ error: "Ürün eklenirken bir hata oluştu." }, { status: 500 });
    }
    }