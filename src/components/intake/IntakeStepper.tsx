"use client";

import type { JSX } from "react";
import { Stepper, type StepStatus } from "@/components/ui";

export type IntakeStepperProps = {
  hasTitle: boolean;
  hasFiles: boolean;
  hasUploadResult: boolean;
};

function deriveStatuses({
  hasTitle,
  hasFiles,
  hasUploadResult
}: IntakeStepperProps): [StepStatus, StepStatus, StepStatus, StepStatus] {
  if (hasUploadResult) {
    return ["done", "done", "done", "done"];
  }

  if (hasFiles) {
    return [hasTitle ? "done" : "active", "done", "active", "pending"];
  }

  if (hasTitle) {
    return ["done", "active", "pending", "pending"];
  }

  return ["active", "pending", "pending", "pending"];
}

export function IntakeStepper(props: IntakeStepperProps): JSX.Element {
  const [meta, upload, check, submit] = deriveStatuses(props);

  return (
    <Stepper
      ariaLabel="신규 심의 요청 진행 단계"
      steps={[
        { key: "meta", label: "요청 메타", status: meta },
        { key: "upload", label: "자료 업로드", status: upload },
        { key: "check", label: "자동 분류 확인", status: check },
        { key: "submit", label: "제출 완료", status: submit }
      ]}
    />
  );
}
