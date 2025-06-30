import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(req: NextRequest): Promise<NextResponse | void> {
	const token = await getToken({ req });

	if (token?.role !== 'admin' && token?.role !== 'superAdmin') {
		const url = new URL('/', req.nextUrl.origin); 
		return NextResponse.redirect(url);
	}
}

export const config = {
	matcher: ['/admin-controls/:path*'],
};
