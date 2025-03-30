import { NextRequest, NextResponse } from 'next/server';
// Assuming you have a database connection established
 import { db } from '@/app/api/info/db'; // Adjust the path as necessary

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    console.log('Full Request:', req);
    console.log('Params:', params);

    // Check if the 'id' parameter exists
    if (!id) {
        console.error('ID parametresi eksik!');
        return NextResponse.json({ error: "ID parametresi eksik!" }, { status: 400 });
    }

    try {
        console.log('ID:', id);
        const requestBody = await req.json();
        console.log("Request Body:", requestBody);

        // *** SQL UPDATE LOGIC HERE ***
        // Example using a hypothetical 'db' connection
        try {
            // Assuming 'products' table and 'product_id' column
            const query = `
                UPDATE products
                SET product_name = ?, category_id = ?, stock_quantity = ?, price_in_dollars = ?
                WHERE product_id = ?
            `;
            const values = [
                requestBody.product_name,
                requestBody.category_id,
                requestBody.stock_quantity,
                requestBody.price_in_dollars,
                id
            ];

            // Execute the query
            const connection = await db;
            const result = await connection.query(query, values);

            console.log("Database update result:", result);

        } catch (dbError) {
            console.error("Database update error:", dbError);
            return NextResponse.json({ error: "Database update failed", details: dbError instanceof Error ? dbError.message : "Unknown database error" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Güncelleme başarılı!" }, { status: 200 });

    } catch (error) {
        console.error("Hata oluştu:", error);
        return NextResponse.json(
            { error: "Sunucu hatası", details: error instanceof Error ? error.message : "Bilinmeyen hata" },
            { status: 500 }
        );
    }
}
