import { useState } from "react";
import { Copy, Upload, X } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

export function ImageUploader({
  onSuccess,
  onError,
}: {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState("cms");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const data = await adminApi.uploadImage(file, folder);
      setUploadedUrl(data.url);
      setFile(null);
      onSuccess("Image uploaded successfully");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(uploadedUrl);
    onSuccess("URL copied to clipboard");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Image Library</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <form onSubmit={handleUpload} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Folder</label>
            <input
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Image file</label>
            <label className="flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 transition">
              <Upload className="h-8 w-8 text-slate-400" />
              <span className="text-sm text-slate-600">
                {file ? file.name : "Click to select an image (JPG, PNG, WebP)"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!file || uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload image"}
          </button>
        </form>

        {uploadedUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-800">Upload successful</span>
              <button
                type="button"
                onClick={() => setUploadedUrl("")}
                className="text-green-700 hover:text-green-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={uploadedUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-green-200 rounded-lg bg-white"
              />
              <button
                type="button"
                onClick={copyUrl}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-500">
        Uploaded images are stored in the public Supabase Storage bucket and can be referenced by
        URL in content fields.
      </p>
    </div>
  );
}
