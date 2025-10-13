// app/api/items/[slug]/route.js
import { NextResponse } from "next/server";
import { getItemBySlug } from "@/lib/repos/products";

export async function GET(req, { params }) {
  const locale = req.headers.get("x-locale") || "tr-TR";
  const { slug } = params;
  const data = await getItemBySlug(locale, slug, "product");
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}
