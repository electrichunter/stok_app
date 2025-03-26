import { NextRequest, NextResponse } from 'next/server';
import { roleCheckMiddleware } from '@/app/api/middleware_role/role_check/roleCheckMiddleware';

export async function GET(req: NextRequest) {
    // UUID formatında rol id'lerini burada belirtin
    const allowedRoles = ["c86664e7f5d81e24be6283b27a31eb74"];  // Örneğin: Admin rolü için UUID

    // Rol kontrol middleware'ini çalıştır
    return roleCheckMiddleware(allowedRoles)(req);
}
