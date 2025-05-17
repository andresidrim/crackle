import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/className";

export default function Button({
  children,
  asChild = false,
  className,
  ...props
}: {
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(
        "bg-[#7C3AED] hover:bg-[#6B21A8] active:bg-[#581C87] text-white px-6 py-3 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus:outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
