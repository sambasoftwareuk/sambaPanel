export function getUploadErrorMessage(error) {
  const msg = error?.message || "";
  if (msg.includes("5MB") || msg.includes("büyük")) {
    return "Dosya çok büyük. En fazla 5 MB yükleyebilirsiniz.";
  }
  if (msg.includes("Ağ hatası")) {
    return "Bağlantı hatası. İnternetinizi kontrol edin.";
  }
  return "Resim yüklenemedi. Lütfen tekrar deneyin.";
}
