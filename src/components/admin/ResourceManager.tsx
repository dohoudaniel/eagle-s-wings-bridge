import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { DataTable } from "./DataTable";
import { FormField, type FieldConfig as FormFieldConfig } from "./FormField";
import { Modal } from "./Modal";

export type { FormFieldConfig as FieldConfig };

interface ResourceManagerProps<T> {
  title: string;
  fields: FormFieldConfig[];
  keyField?: string;
  load: () => Promise<T[]>;
  create: (data: Record<string, unknown>) => Promise<T>;
  update: (id: string, data: Record<string, unknown>) => Promise<T>;
  remove: (id: string) => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  columns: { key: string; header: string; render?: (item: T) => React.ReactNode }[];
}

export function ResourceManager<T>({
  title,
  fields,
  keyField = "id",
  load,
  create,
  update,
  remove,
  onSuccess,
  onError,
  columns,
}: ResourceManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  async function fetchItems() {
    setLoading(true);
    try {
      const data = await load();
      setItems(data);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  const initialData = useMemo(() => {
    const data: Record<string, unknown> = {};
    fields.forEach((f) => {
      data[f.name] = f.type === "checkbox" ? true : "";
    });
    return data;
  }, [fields]);

  function openCreate() {
    setEditing(null);
    setFormData({ ...initialData });
    setModalOpen(true);
  }

  function openEdit(item: T) {
    setEditing(item);
    const data: Record<string, unknown> = {};
    fields.forEach((f) => {
      const value = (item as Record<string, unknown>)[f.name];
      if (f.type === "datetime" && typeof value === "string") {
        data[f.name] = value.slice(0, 16);
      } else {
        data[f.name] = value ?? (f.type === "checkbox" ? false : "");
      }
    });
    setFormData(data);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      fields.forEach((f) => {
        let value = formData[f.name];
        if (f.type === "number") {
          value = value === "" ? null : Number(value);
        }
        payload[f.name] = value;
      });

      if (editing) {
        await update(String((editing as Record<string, unknown>)[keyField]), payload);
        onSuccess("Item updated successfully");
      } else {
        await create(payload);
        onSuccess("Item created successfully");
      }
      setModalOpen(false);
      await fetchItems();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save item");
    } finally {
      setSaving(false);
    }
  }

  function promptDelete(item: T) {
    setItemToDelete(item);
  }

  async function handleConfirmDelete() {
    if (!itemToDelete) return;
    try {
      await remove(String((itemToDelete as Record<string, unknown>)[keyField]));
      onSuccess("Item deleted successfully");
      setItemToDelete(null);
      await fetchItems();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete item");
    }
  }

  function handleChange(name: string, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-soft transition hover:shadow-glow"
        >
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        keyField={keyField}
        onEdit={openEdit}
        onDelete={promptDelete}
        loading={loading}
      />

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title={`Delete ${title.replace(/s$/, "")}`}
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />

      <Modal
        title={editing ? `Edit ${title.replace(/s$/, "")}` : `Create ${title.replace(/s$/, "")}`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={formData[field.name] as string | boolean | number | null}
              onChange={handleChange}
            />
          ))}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl px-4 py-2.5 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gradient-primary px-4 py-2.5 font-medium text-primary-foreground shadow-soft transition hover:shadow-glow disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
