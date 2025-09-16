export default function DeleteConfirmModal({
  isOpen,
  title = "Öğeyi Sil",
  message = "Bu işlem geri alınamaz.",
  confirmLabel = "Sil",
  cancelLabel = "İptal",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red text-white rounded hover:bg-red-200"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
