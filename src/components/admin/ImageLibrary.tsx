import { useEffect, useState } from "react";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ConfirmDialog } from "./ConfirmDialog";

interface ImageLibraryProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ImageLibrary({ onSuccess, onError }: ImageLibraryProps) {
  const [images, setImages] = useState<{ name: string; path: string; url: string; size: number; created_at: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  async function loadImages() {
    setLoading(true);
    try {
      const data = await adminApi.listImages("cms");
      setImages(data.images);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await adminApi.uploadImage(file, "cms");
      onSuccess("Image uploaded successfully");
      await loadImages();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await adminApi.uploadVideo(file, "cms");
      onSuccess("Video uploaded successfully");
      await loadImages();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete() {
    if (!imageToDelete) return;
    try {
      await adminApi.deleteImage(imageToDelete);
      onSuccess("Image deleted successfully");
      await loadImages();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setImageToDelete(null);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    onSuccess("URL copied to clipboard");
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Media Library</h2>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition cursor-pointer disabled:opacity-60">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploading ? "Uploading..." : "Upload image"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition cursor-pointer disabled:opacity-60">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>{uploading ? "Uploading..." : "Upload video"}</span>
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-500">No images uploaded yet.</p>
          <p className="text-sm text-slate-400 mt-1">Upload images to use them in programs, stories, and hero slides.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div
              key={image.url}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition"
            >
              <div className="aspect-square bg-slate-100">
                {image.name.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={image.url} className="h-full w-full object-cover" controls />
                ) : (
                  <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-500 truncate" title={image.name}>
                  {image.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{formatBytes(image.size)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => copyUrl(image.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition"
                  >
                    <Copy className="h-3 w-3" />
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageToDelete(image.url)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!imageToDelete}
        title="Delete image"
        message="This image will be removed from storage. Any content still using it will show a broken image."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setImageToDelete(null)}
      />
    </div>
  );
}
