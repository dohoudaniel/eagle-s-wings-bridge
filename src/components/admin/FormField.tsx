import { ImagePicker } from "./ImagePicker";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "datetime" | "image";
  options?: { value: string; label: string }[];
  required?: boolean;
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-foreground transition placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string | boolean | number | null;
  onChange: (name: string, value: string | boolean) => void;
}) {
  const Label = () => (
    <label className={labelClass}>
      {field.label}
      {field.required && <span className="ml-1 text-destructive">*</span>}
    </label>
  );

  if (field.type === "image") {
    return (
      <div>
        <Label />
        <ImagePicker value={String(value ?? "")} onChange={(url) => onChange(field.name, url)} />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <Label />
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
      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="h-4 w-4 rounded border-border accent-primary"
        />
        <span className="text-sm font-medium text-foreground">{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div>
        <Label />
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
      <Label />
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
