import { NextResponse } from "next/server";

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

// Get preferred locale from cookies or accept-language
function getLocale(request) {
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;
  return defaultLocale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }

  // Extract current locale from pathname
  const currentLocale = locales.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) || defaultLocale;

  // Protect Admin Routes
  const isAdminRoute = locales.some((l) => pathname.startsWith(`/${l}/admin`));
  const isLoginPage = locales.some((l) => pathname.startsWith(`/${l}/admin/login`));
  const adminSession = request.cookies.get('admin_session')?.value;

  if (isAdminRoute && !isLoginPage && !adminSession) {
    const loginUrl = new URL(`/${currentLocale}/admin/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginPage && adminSession) {
    const adminUrl = new URL(`/${currentLocale}/admin`, request.url);
    return NextResponse.redirect(adminUrl);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    // Skip internal paths and public files
    '/((?!api|_next/static|_next/image|images|Video.mp4|favicon.ico|logo.svg).*)',
  ],
};
