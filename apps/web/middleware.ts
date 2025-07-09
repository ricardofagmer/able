import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('endpoint-token');

  // Protected routes
 /* if (request.nextUrl.pathname.startsWith('/endpoint') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }*/

  return NextResponse.next();
}

export const config = {
  matcher: ['/endpoint/:path*']
}
