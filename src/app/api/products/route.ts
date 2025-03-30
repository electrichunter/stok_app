import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "@/app/api/info/db";

export async function POST(request: NextRequest) {
    const db = await getDBConnection();
    try {
        const data = await request.json();

        if (!data.product_name || !data.category_id || !data.barcode || !data.stock_quantity || !data.price_in_dollars) {
            return NextResponse.json({ error: "Eksik alanlar var." }, { status: 400 });
        }

        const query = `
            INSERT INTO products (product_name, category_id, barcode, stock_quantity, price_in_dollars, info, created_at, updated_at, user_id, updated_by_user_id)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
        `;

        await db.execute(query, [
            data.product_name,
            data.category_id,
            data.barcode,
            data.stock_quantity,
            data.price_in_dollars,
            data.info || null,
            data.user_id || 1,
            data.updated_by_user_id || 1
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
