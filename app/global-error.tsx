'use client'

import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import { toast } from "sonner";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
    useEffect(() => {
      toast.error("An unexpected Global Error occurred.");
    }, [error]);
  return (
    <html>
      <body>
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-bold">Something went wrong!</h2>
          <Button onClick={() => reset()}>Try again</Button>
        </div>
      </body>
    </html>
  )
}
