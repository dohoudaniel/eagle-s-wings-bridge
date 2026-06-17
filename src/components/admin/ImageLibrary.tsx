import { useEffect, useState } from "react";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { ConfirmDialog } from "./ConfirmDialog";

interface ImageLibraryProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export function ImageLibrary({ onSuccess, onError }: ImageLibraryProps) {
  const [images, setImages] = useState<
    { name: string; path: string; url: string; size: number; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  async function loadImages() {
    setLoading(true);
    try {
      const data = await adminApi.listImages("cms");
      setImages(Array.isArray(data?.images) ? data.images : []);
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

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      onSuccess("URL copied to clipboard");
    } catch {
      onError("Could not copy URL. Copy it manually.");
    }
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
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-3xl font-bold text-foreground">Media Library</h2>
        <div className="flex items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-soft transition hover:shadow-glow">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 font-medium text-foreground transition hover:bg-muted">
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload video"}</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <p className="text-muted-foreground">No images uploaded yet.</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Upload images to use them in programs, stories, and hero slides.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {images.map((image) => (
            <div
              key={image.url}
              className="overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-soft"
            >
              <div className="aspect-square bg-muted">
                {image.name.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={image.url} className="h-full w-full object-cover" controls />
                ) : (
                  <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs text-muted-foreground" title={image.name}>
                  {image.name}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground/70">{formatBytes(image.size)}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(image.url)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted/70"
                  >
                    <Copy className="h-3 w-3" />
                    Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageToDelete(image.url)}
                    aria-label="Delete"
                    className="rounded-lg p-1.5 text-destructive transition hover:bg-destructive/10"
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
