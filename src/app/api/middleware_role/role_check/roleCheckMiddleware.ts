import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function roleCheckMiddleware(allowedRoles: string[]) {
    return async (req: NextRequest) => {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
        }

        try {
            const decoded: any = jwt.verify(token, 'your_secret_key');

            // Kullanıcının rolünü al (UUID şeklinde)
            const userRole = decoded.role_id;

            // Eğer rol izin verilen rollerde değilse, erişim reddedilir
            if (!allowedRoles.includes(userRole)) {
                return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 });
            }

            // İzin verilen rol varsa, burada işlem yapılabilir (response döndürülebilir)
            return NextResponse.json({ message: 'Erişim izin verildi' }); // Burada izin verilen işlem yapılır
        } catch (error) {
            return NextResponse.json({ error: 'Token geçersiz veya süresi dolmuş' }, { status: 401 });
        }
    };
}
