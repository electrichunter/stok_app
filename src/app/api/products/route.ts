import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "@/app/api/info/db";

// API'den gelen veri ile ürün eklemek
export async function POST(request: NextRequest) {
    const db = await getDBConnection(); // Bağlantı havuzundan bir bağlantı alın
    try {
        const {   product_name, category_id, barcode, stock_quantity, price_in_dollars, info, user_id, updated_by_user_id } = await request.json();
        
        const query = `
            INSERT INTO products
            ( product_name, category_id, barcode, stock_quantity, price_in_dollars, info, created_at, updated_at, user_id, updated_by_user_id)
            VALUES (  ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
        `;
        
        // Veritabanına veri ekleme
        const [result] = await db.execute(query, [
     
            product_name,
            category_id,
            barcode,
            stock_quantity,
            price_in_dollars,
            info,
            user_id,
            updated_by_user_id
        ]);
        
        return NextResponse.json({ success: true, message: "Ürün başarıyla eklendi!" });
    } catch (error) {
        console.error("Ürün ekleme hatası:", error);
        return NextResponse.json({ error: "Ürün eklenirken bir hata oluştu." }, { status: 500 });
    }
}

export async function GET() {
    const db = await getDBConnection(); // Bağlantı havuzundan bir bağlantı alın
    try {
        const [products] = await db.execute(
            "SELECT * FROM products ORDER BY product_id ASC"
        );
        
        return NextResponse.json(products);
    } catch (error) {
        console.error("Ürün çekme hatası:", error);
        return NextResponse.json({ error: "Ürün çekme hatası" }, { status: 500 });
    }
}
