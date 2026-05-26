"use client";

import type { JSX } from "react";
import { DropZone } from "@/components/ui";
import {
  formatUploadPolicySummary,
  uploadAcceptAttribute,
  validateUploadedFiles
} from "@/domain/upload-policy";

export type IntakeUploadZoneProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  error?: string | null;
  onError: (message: string | null) => void;
};

export function IntakeUploadZone({
  files,
  onFilesChange,
  error,
  onError
}: IntakeUploadZoneProps): JSX.Element {
  function handleFilesSelected(selected: File[]): void {
    const next = [...files, ...selected];
    const validation = validateUploadedFiles(next);

    if (!validation.ok) {
      onError(validation.errors[0]);
      return;
    }

    onError(null);
    onFilesChange(next);
  }

  function handleRemove(index: number): void {
    onFilesChange(files.filter((_, currentIndex) => currentIndex !== index));
    onError(null);
  }

  return (
    <>
      <DropZone
        accept={uploadAcceptAttribute}
        files={files}
        helperText="심의 대상 패키지를 업로드하세요 (ZIP, PDF, JPG)"
        error={error}
        onFilesSelected={handleFilesSelected}
        onRemoveFile={handleRemove}
      />
      <p className="upload-policy-note">{formatUploadPolicySummary()}</p>
    </>
  );
}
