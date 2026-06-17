import { useEffect, useState } from "react";
import { Check, Loader2, Trash2, Upload } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<
    { name: string; path: string; url: string; size: number; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(value);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  async function loadImages() {
    setLoading(true);
    try {
      const data = await adminApi.listImages("cms");
      setImages(Array.isArray(data?.images) ? data.images : []);
    } catch {
      // fail silently; modal will just show empty state
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setSelected(value);
      loadImages();
    }
  }, [isOpen, value]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await adminApi.uploadImage(file, "cms");
      setSelected(data.url);
      await loadImages();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!imageToDelete) return;
    try {
      await adminApi.deleteImage(imageToDelete);
      if (selected === imageToDelete) setSelected("");
      await loadImages();
    } finally {
      setImageToDelete(null);
    }
  }

  function handleConfirm() {
    onChange(selected);
    setIsOpen(false);
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground transition placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Choose
        </button>
      </div>

      <Modal title="Image Library" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-3 transition hover:border-primary hover:bg-muted">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="text-sm text-muted-foreground">
                {uploading ? "Uploading..." : "Upload new image"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No images uploaded yet.
            </div>
          ) : (
            <div className="grid max-h-[360px] grid-cols-3 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
              {images.map((image) => (
                <div
                  key={image.url}
                  onClick={() => setSelected(image.url)}
                  className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                    selected === image.url
                      ? "border-primary"
                      : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                  {selected === image.url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                      <div className="rounded-full bg-primary p-1 text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageToDelete(image.url);
                    }}
                    aria-label="Delete"
                    className="absolute right-1 top-1 rounded-lg bg-destructive p-1 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 truncate bg-foreground/60 px-1.5 py-0.5 text-[10px] text-background">
                    {formatBytes(image.size)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-2.5 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-xl bg-gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-soft transition hover:shadow-glow"
            >
              Select image
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!imageToDelete}
        title="Delete image"
        message="This image will be removed from storage. Any content still using it will show a broken image."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setImageToDelete(null)}
      />
    </>
  );
}
