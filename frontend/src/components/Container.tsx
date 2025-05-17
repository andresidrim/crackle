import { HTMLAttributes } from "react";
import { cn } from "@/utils/className";

export default function Container({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative w-[min(90%,1280px)] h-full flex flex-col items-center justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
