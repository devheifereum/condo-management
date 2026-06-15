import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg bg-paper-raised border border-paper-line shadow-card",
        className
      )}
      {...rest}
    />
  );
}
