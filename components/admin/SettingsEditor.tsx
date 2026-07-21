"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { Loader2, ShieldAlert } from "lucide-react";

export interface SettingItem {
  id: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

interface SettingsEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editItem?: SettingItem | null;
  protectedKeys: string[];
}

export default function SettingsEditor({
  isOpen,
  onClose,
  onSaved,
  editItem,
  protectedKeys,
}: SettingsEditorProps) {
  const { addToast } = useToast();
  const isEdit = !!editItem;
  const isProtected = isEdit && editItem ? protectedKeys.includes(editItem.key) : false;

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    key: "",
    value: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setForm({
          key: editItem.key,
          value: editItem.value,
        });
      } else {
        setForm({
          key: "",
          value: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editItem]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.key.trim() || form.key.length < 2) {
      newErrors.key = "Key must be at least 2 characters.";
    } else if (!/^[a-z0-9_.-]+$/.test(form.key)) {
      newErrors.key = "Key must contain only lowercase letters, numbers, underscores, hyphens, or dots.";
    }
    if (form.value === undefined || form.value === null) {
      newErrors.value = "Value is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/settings/${editItem!.id}`
        : "/api/admin/settings";
      const method = isEdit ? "PATCH" : "POST";

      const payload = {
        // Protected setting keys can never be edited
        ...(!isProtected && { key: form.key.trim().toLowerCase() }),
        value: form.value,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        addToast({
          type: "success",
          title: isEdit ? "Setting Updated" : "Setting Created",
          message: isEdit
            ? `Setting "${form.key}" has been updated.`
            : `Setting "${form.key}" has been created.`,
        });
        onSaved();
        onClose();
      } else {
        if (json.issues) {
          const apiErrors: Record<string, string> = {};
          for (const [k, msgs] of Object.entries(json.issues)) {
            apiErrors[k] = (msgs as string[])[0];
          }
          setErrors(apiErrors);
        }
        addToast({
          type: "error",
          title: "Save Failed",
          message: json.error || "Could not save setting configuration.",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Network Error",
        message: "Failed to connect to the server.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Setting: ${editItem?.key}` : "Add Custom Site Setting"}
      className="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {isProtected && (
          <div className="flex gap-2.5 p-3 rounded-lg bg-dragon-neon/5 border border-dragon-neon/15 items-start text-xs text-dragon-text-secondary">
            <ShieldAlert className="w-4 h-4 text-dragon-neon shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-dragon-neon uppercase tracking-wide">System Protected Key:</span> This is
              a required core system parameter. You can edit its configuration value, but its key name and existence are locked.
            </div>
          </div>
        )}

        {/* Setting Key */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Setting Key <span className="text-red-400">*</span>
          </label>
          <Input
            id="setting-key"
            placeholder="e.g. custom_analytics_id"
            value={form.key}
            onChange={(e) => setForm((prev) => ({ ...prev, key: e.target.value }))}
            disabled={saving || isEdit} // Key can never be updated once created to prevent breaking references
          />
          {!isEdit && (
            <p className="text-dragon-text-muted text-[11px] mt-1.5 leading-relaxed">
              Use lowercase characters, numbers, underscores (_), hyphens (-), or dots (.).
            </p>
          )}
          {errors.key && <p className="text-red-400 text-xs mt-1">{errors.key}</p>}
        </div>

        {/* Setting Value */}
        <div>
          <label className="block text-sm font-medium text-dragon-text-secondary mb-1.5">
            Setting Value <span className="text-red-400">*</span>
          </label>
          <Textarea
            id="setting-value"
            placeholder="Enter the text, URL, JSON string, or configuration details..."
            value={form.value}
            onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))}
            rows={5}
            disabled={saving}
          />
          {errors.value && <p className="text-red-400 text-xs mt-1">{errors.value}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Setting"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
