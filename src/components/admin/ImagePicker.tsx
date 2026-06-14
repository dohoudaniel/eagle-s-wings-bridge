import { useEffect, useState } from "react";
import { Check, Loader2, Trash2, Upload, X } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<{ name: string; path: string; url: string; size: number; created_at: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(value);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  async function loadImages() {
    setLoading(true);
    try {
      const data = await adminApi.listImages("cms");
      setImages(data.images);
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
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
        >
          Choose
        </button>
      </div>

      <Modal title="Image Library" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary hover:bg-slate-50 transition">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span className="text-sm text-slate-600">{uploading ? "Uploading..." : "Upload new image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : images.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">No images uploaded yet.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto p-1">
              {images.map((image) => (
                <div
                  key={image.url}
                  onClick={() => setSelected(image.url)}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer group ${
                    selected === image.url ? "border-primary" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                  {selected === image.url && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="bg-primary text-white rounded-full p-1">
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
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 truncate">
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
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
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
