"use client";

import { useRouter } from "next/navigation";

export const usePageUpdate = () => {
  const router = useRouter();

  // CREATE - Yeni sayfa oluştur
  const createPage = async (data) => {
    try {
      const res = await fetch(`/api/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Sayfa oluşturulamadı");
      }

      router.refresh();
      return { success: true, data: await res.json() };
    } catch (error) {
      console.error("Page create error:", error);
      throw error;
    }
  };

  // READ - Sayfa oku
  const getPage = async (pageId) => {
    try {
      const res = await fetch(`/api/pages/${pageId}`);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Sayfa bulunamadı");
      }

      return await res.json();
    } catch (error) {
      console.error("Page get error:", error);
      throw error;
    }
  };

  // UPDATE - Sayfa güncelle
  const updatePage = async (pageId, data) => {
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Güncelleme başarısız");
      }

      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("Page update error:", error);
      throw error;
    }
  };

  // DELETE - Sayfa sil
  const deletePage = async (pageId) => {
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Silme başarısız");
      }

      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("Page delete error:", error);
      throw error;
    }
  };

  // BULK UPDATE - Toplu güncelleme
  const bulkUpdate = async (pages) => {
    try {
      const res = await fetch(`/api/pages/bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pages }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Toplu güncelleme başarısız");
      }

      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("Bulk update error:", error);
      throw error;
    }
  };

  // BULK DELETE - Toplu silme
  const bulkDelete = async (pageIds) => {
    try {
      const res = await fetch(`/api/pages/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageIds }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || "Toplu silme başarısız");
      }

      router.refresh();
      return { success: true };
    } catch (error) {
      console.error("Bulk delete error:", error);
      throw error;
    }
  };

  return {
    createPage,
    getPage,
    updatePage,
    deletePage,
    bulkUpdate,
    bulkDelete,
  };
};
