"use client";

import { formatBytes } from "../../lib/uploadWithProgress";

export default function UploadProgressBar({
  percent = 0,
  label = "Yükleniyor...",
  loaded = 0,
  total = 0,
  fileIndex,
  fileCount,
}) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
      <div className="mb-2 flex items-center justify-between text-sm text-blue-900">
        <span>{label}</span>
        {fileCount > 1 && fileIndex != null && (
          <span>
            Dosya {fileIndex}/{fileCount}
          </span>
        )}
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-200"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-1 flex justify-between text-xs text-blue-700">
        <span>{percent}%</span>
        {total > 0 && (
          <span>
            {formatBytes(loaded)} / {formatBytes(total)}
          </span>
        )}
      </div>
    </div>
  );
}