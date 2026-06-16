import { NextResponse } from "next/server";
import { z } from "zod";
import { sendSmtpMail } from "@/lib/mail/smtp";

const SECURITY_ANSWER = "9";

const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  kvkkAccepted: z.literal(true),
  securityAnswer: z.string().trim(),
});

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function buildMailText(data) {
  return [
    "GreenStep web sitesi iletişim formundan yeni mesaj alındı.",
    "",
    `Ad Soyad: ${data.firstName} ${data.lastName}`,
    `E-posta: ${data.email}`,
    `Telefon: ${data.phone || "Belirtilmedi"}`,
    "",
    "Mesaj:",
    data.message,
  ].join("\n");
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: "Lütfen form alanlarını kontrol ediniz." }, { status: 400 });
    }

    if (parsed.data.securityAnswer !== SECURITY_ANSWER) {
      return NextResponse.json({ message: "Güvenlik sorusunun cevabı hatalı." }, { status: 400 });
    }

    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
    const from = process.env.CONTACT_MAIL_FROM || "noreply@greenstep.com";
    const to = process.env.CONTACT_MAIL_TO || from;

    await sendSmtpMail({
      host: getRequiredEnv("SMTP_HOST"),
      port: smtpPort,
      secure: smtpSecure,
      user: process.env.SMTP_USER || from,
      pass: getRequiredEnv("SMTP_PASS"),
      from,
      to,
      replyTo: parsed.data.email,
      subject: `İletişim Formu - ${parsed.data.firstName} ${parsed.data.lastName}`,
      text: buildMailText(parsed.data),
    });

    return NextResponse.json({ message: "Mesajınız başarıyla gönderildi." });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ message: "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz." }, { status: 500 });
  }
}
