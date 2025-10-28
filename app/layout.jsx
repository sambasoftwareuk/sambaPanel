import { Geist, Geist_Mono, Merriweather } from "next/font/google";
import { Comic_Neue } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";
import { Footer } from "./_components/Footer";
import WhatsAppStickyButton from "./_components/WhatsAppStickyButton";
import ScrollToTopButton from "./_components/ScrollToTopButton";
import { ClerkProvider } from "@clerk/nextjs";
import { getMetaData } from "./utils/metadataHelper";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export async function generateMetadata() {
  const meta = await getMetaData("/");
  return {
    title: meta?.title || "Greenstep Su Soğutma Kuleleri",
    description:
      meta?.description ||
      "Greenstep su soğutma kuleleri ile ilgili detaylı bilgi alın.",
    icons: { icon: "/gs.svg" },
  };
}
export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`  ${roboto.variable} antialiased`}>
          <Navbar />
          <main id="top">{children}</main>
          <Footer />
          <div className="fixed bottom-6 right-6 md:bottom-16 flex items-center gap-4 z-50">
            <WhatsAppStickyButton />
            <ScrollToTopButton />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
