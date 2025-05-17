import { Button } from "@/components/atoms";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-full relative">
      <Button asChild className="absolute top-8 left-4 z-50">
        <Link href="/">Home</Link>
      </Button>
      {children}
    </div>
  );
}
