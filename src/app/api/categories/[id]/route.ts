import { NextResponse, NextRequest } from "next/server";
import { getDBConnection } from "@/app/api/info/db";

export async function PUT(request: NextRequest, { params }: { params: { id:Int16Array } }) {
    try {
        const { id: categori_id } = params;
        const { category_name, category_info } = await request.json();

        if (!category_name || !category_info) {
            return NextResponse.json({ error: "Eksik bilgi gönderildi." }, { status: 400 });
        }

        const conn = await getDBConnection();

        await conn.execute(
            "UPDATE categories SET category_name = ?, category_info = ? WHERE category_id = ?",
            [category_name, category_info, categori_id]
        );

        conn.release();

        return NextResponse.json({ success: true, message: "Kategori başarıyla güncellendi." });
    } catch (error) {
        console.error("Kategori güncelleme hatası:", error);
        return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
    }
}
