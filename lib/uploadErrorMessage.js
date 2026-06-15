export function getUploadErrorMessage(error) {
  const msg = error?.message || "";
  if (msg.includes("5MB") || msg.includes("büyük") || msg.includes("too large")) {
    return "File is too large. Maximum size is 5 MB.";
  }
  if (msg.includes("Ağ hatası") || msg.includes("Network error")) {
    return "Network error. Please check your connection.";
  }
  if (msg.includes("Media")) {
    return "Image could not be saved. Please try again.";
  }
  return "Image could not be uploaded. Please try again.";
}
