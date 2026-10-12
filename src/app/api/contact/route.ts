import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const name = body?.name?.toString().trim();
    const email = body?.email?.toString().trim();
    const message = body?.message?.toString().trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { ok: false, error: "Adresse e-mail invalide." },
        { status: 400 }
      );
    }

    // In a real deployment this would dispatch an email / store in DB.
    // For now we log and acknowledge.
    console.log("[CONTACT] Nouveau message:", { name, email, message });

    return NextResponse.json({
      ok: true,
      message: "Message bien reçu ! Je vous réponds dès que possible.",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue, réessayez plus tard." },
      { status: 500 }
    );
  }
}
