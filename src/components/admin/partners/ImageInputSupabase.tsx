
import React, { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface ImageInputSupabaseProps {
  label: string;
  bucket: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  disabled?: boolean;
}

export default function ImageInputSupabase({
  label,
  bucket,
  value,
  onChange,
  accept = "image/png,image/jpeg,image/webp",
  disabled = false
}: ImageInputSupabaseProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = filename;

    // Upload no bucket
    const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      alert("Falha ao enviar imagem: " + error.message);
      setUploading(false);
      return;
    }

    // Pega a URL pública
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    onChange(data.publicUrl);
    setUploading(false);
  };

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (file) uploadImage(file);
  }

  function openDialog() {
    if (inputRef.current) inputRef.current.click();
  }

  return (
    <div>
      <label className="block font-semibold mb-1">{label}</label>
      {value && (
        <div className="mb-2">
          <img src={value} alt={label} className="max-h-32 rounded border" />
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        className="hidden"
        disabled={uploading || disabled}
      />
      <Button
        type="button"
        size="sm"
        onClick={openDialog}
        disabled={uploading || disabled}
        className="mb-2"
      >
        {uploading ? "Enviando..." : value ? "Trocar Imagem" : "Escolher Imagem"}
      </Button>
      {value && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onChange("")}
          className="ml-2"
          disabled={uploading || disabled}
        >
          Remover
        </Button>
      )}
    </div>
  );
}
