import { cn } from "@/utils/className";
import { InputHTMLAttributes } from "react";

export default function Input({
  hasError = false,
  errorText = "",
  className,
  ...props
}: {
  hasError: boolean;
  errorText: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label htmlFor={props.name} className={cn("w-full space-y-1", className)}>
      <input
        id={props.name}
        className={cn(
          "bg-[#1F1F2E] text-white placeholder-[#9CA3AF] px-4 py-2 rounded-md ring-1 ring-[#A78BFA] focus:ring-2 focus:ring-[#C4B5FD] outline-none w-full",
          hasError && "ring-[#EF4444]",
        )}
        {...props}
      />
      <span
        className={cn("text-sm text-red-500", hasError ? "block" : "hidden")}
      >
        {errorText}
      </span>
    </label>
  );
}
