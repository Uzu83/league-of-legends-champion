"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useQuiz } from "@/lib/store";
import type { DiagnosisType } from "@/lib/types";

export default function RetakeLink({
  type,
  className,
  children,
}: {
  type: DiagnosisType;
  className?: string;
  children: ReactNode;
}) {
  const reset = useQuiz((s) => s.reset);
  return (
    <Link
      href={`/q/${type}`}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
          return;
        reset(type);
      }}
    >
      {children}
    </Link>
  );
}
