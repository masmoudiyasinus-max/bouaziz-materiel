import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { products } from "@/data/products";

export async function POST(request) {
  try {
    const sessionCookie = request.cookies.get("adminSession")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify session
    await adminAuth.verifySessionCookie(sessionCookie, true);

    // Write products to Firestore
    const batch = adminDb.batch();
    for (const cat of products) {
      const docRef = adminDb.collection("catalog").doc(cat.id.toString());
      batch.set(docRef, cat);
    }
    
    await batch.commit();

    return NextResponse.json({ success: true, message: "Migration complete" });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ error: "Migration failed" }, { status: 500 });
  }
}
