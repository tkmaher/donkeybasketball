import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email } = await req.json();

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: {
        "X-Kit-Api-Key": process.env.KIT_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name: name, email_address: email }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Kit error:", res.status, data);
      return NextResponse.json({ error: "Signup failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Signup failed" }, { status: 502 });
  }
}