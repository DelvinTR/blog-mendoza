import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy: Protects /admin routes with HTTP Basic Auth.
 * 
 * In Next.js 16, the `middleware` convention has been renamed to `proxy`.
 * The exported function must be named `proxy`.
 * 
 * Credentials are read from environment variables,
 * with sensible defaults for local development only.
 */
export function proxy(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  if (url.pathname.startsWith('/admin')) {
    // Skip auth for prefetch requests to avoid browser login popups on public pages
    const isPrefetch = req.headers.get('x-nextjs-prefetch') === '1' || req.headers.get('purpose') === 'prefetch';
    if (isPrefetch) {
      return NextResponse.next();
    }

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const validUser = process.env.ADMIN_USER || 'admin';
      const validPass = process.env.ADMIN_PASSWORD || 'vinot2026';

      if (user === validUser && pwd === validPass) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Authentification requise', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Zone admin"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
