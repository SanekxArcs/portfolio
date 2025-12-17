"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useEffect } from "react";

export default function NotFound() {
    useEffect(() => {
    toast.warning("Could not find requested resource (404).");
  }, []);
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">404 Not Found</h2>
      <p className="text-muted-foreground">Could not find requested resource</p>
      <Button>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}
