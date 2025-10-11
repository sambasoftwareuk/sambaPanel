"use client";

import { useEffect, useState } from "react";
import { RefreshIcon } from "./_atoms/Icons";
import { Header1 } from "./_atoms/Headers";
import { PrimaryButton } from "./_atoms/Buttons";
import { useRouter, usePathname } from "next/navigation";

export default function Error({ error, reset }) {
  const router = useRouter();
  const pathname = usePathname();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    console.error("❌ Hata yakalandı:", error);
    if (pathname !== "/") {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      const timer = setTimeout(() => router.push("/"), 3000);
      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [error, router, pathname]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <Header1 className="text-red">Bir şeyler ters gitti</Header1>
      <p className="text-gray-600 my-2 max-w-md">
        {pathname === "/"
          ? "Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin."
          : ` Ana sayfaya ${countdown} saniye içinde yönlendiriliyorsunuz...`}
      </p>
      <PrimaryButton
        label={pathname === "/" ? "Sayfayı Yenile" : "Ana Sayfaya Dön"}
        icon={<RefreshIcon className="w-5 h-5" />}
        onClick={() => (pathname === "/" ? reset() : router.push("/"))}
      />
    </div>
  );
}
