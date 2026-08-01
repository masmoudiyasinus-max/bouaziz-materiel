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
}

export const config = {
  matcher: [
    // Skip internal paths and public files
    '/((?!api|_next/static|_next/image|images|Video.mp4|favicon.ico|logo.svg).*)',
  ],
};
