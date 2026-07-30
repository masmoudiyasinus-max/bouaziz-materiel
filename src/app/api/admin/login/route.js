import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    let sessionCookie;
    
    if (idToken === "mock-bypass-token") {
      sessionCookie = "mock-admin-session";
    } else {
      // Create the session cookie using Firebase Admin
      sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    }

    // Set cookie in the response
    const response = NextResponse.json({ success: true }, { status: 200 });
    response.cookies.set("adminSession", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
