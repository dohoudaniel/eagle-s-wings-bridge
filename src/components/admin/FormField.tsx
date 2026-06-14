import { ImagePicker } from "./ImagePicker";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "datetime" | "image";
  options?: { value: string; label: string }[];
  required?: boolean;
}

export function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string | boolean | number | null;
  onChange: (name: string, value: string | boolean) => void;
}) {
  const inputClass =
    "w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary";

  if (field.type === "image") {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <ImagePicker value={String(value ?? "")} onChange={(url) => onChange(field.name, url)} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
          rows={4}
          className={inputClass}
        />
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-medium text-slate-700">{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(field.name, e.target.value)}
          required={field.required}
          className={inputClass}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={field.type === "datetime" ? "datetime-local" : field.type}
        value={String(value ?? "")}
        onChange={(e) => onChange(field.name, e.target.value)}
        required={field.required}
        className={inputClass}
      />
    </div>
  );
}
