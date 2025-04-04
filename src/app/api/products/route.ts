import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "@/app/api/info/db";
 
export async function GET() {
    const db = await getDBConnection();
    try {
        const [products] = await db.execute(
            `SELECT p.product_id, p.barcode, p.product_name, p.category_id, 
                    p.stock_quantity, p.price_in_dollars, c.category_name 
             FROM products p
             LEFT JOIN categories c ON p.category_id = c.category_id
             ORDER BY p.product_id ASC`
        );
        return NextResponse.json(products);
    } catch (error) {
        console.error("Ürün çekme hatası:", error);
        return NextResponse.json({ error: "Ürün çekme hatası" }, { status: 500 });
    }
}


// 📌 Ürün ekleme
export async function POST(request: NextRequest) {
    const db = await getDBConnection();
    try {
        const { product_name, category_id, barcode, stock_quantity, price_in_dollars, info, user_id, updated_by_user_id } = await request.json();

        if (!product_name || !category_id || !barcode || !stock_quantity || !price_in_dollars) {
            return NextResponse.json({ error: "Tüm alanlar zorunludur!" }, { status: 400 });
        }

        const query = `
            INSERT INTO products
            (product_name, category_id, barcode, stock_quantity, price_in_dollars, info, created_at, updated_at, user_id, updated_by_user_id)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?)
        `;
        
        await db.execute(query, [
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
    // 📌 Ürün güncelleme
    export async function PUT(request: NextRequest) {
        const db = await getDBConnection();
        try {
            // Request'den gelen JSON verisini al
            const { product_id, product_name, category_id, stock_quantity, price_in_dollars } = await request.json();
    
            // Gerekli alanların kontrolü
            if (!product_id || !product_name || !category_id || !stock_quantity || !price_in_dollars) {
                return NextResponse.json({ error: "Tüm alanlar zorunludur!" }, { status: 400 });
            }
    
            // SQL sorgusu
            const query = `
                UPDATE products 
                SET product_name = ?, category_id = ?, stock_quantity = ?, price_in_dollars = ?, updated_at = NOW()
                WHERE product_id = ?
            `;
    
            // Veritabanı işlemi
            await db.execute(query, [product_name, category_id, stock_quantity, price_in_dollars, product_id]);
    
            // Başarı durumunda yanıt
            return NextResponse.json({ success: true, message: "Ürün başarıyla güncellendi!" });
        } catch (error) {
            console.error("Ürün güncelleme hatası:", error);
            return NextResponse.json({ error: "Ürün güncellenirken hata oluştu." }, { status: 500 });
        }
    }