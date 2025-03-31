import { NextRequest, NextResponse } from "next/server";
import { getDBConnection } from "@/app/api/info/db";

// 📌 En son 4 ürünü listeleme
export async function GET() {
    const db = await getDBConnection();
    try {
        const [latestProducts] = await db.execute(
            "SELECT * FROM products ORDER BY product_id DESC LIMIT 4"
        );
        return NextResponse.json(latestProducts);
    } catch (error) {
        console.error("Son ürünleri çekme hatası:", error);
        return NextResponse.json({ error: "Son ürünleri çekme hatası" }, { status: 500 });
    }
}