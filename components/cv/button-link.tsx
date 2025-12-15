import * as React from "react"

import { type VariantProps } from "class-variance-authority"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Variant = VariantProps<typeof buttonVariants>["variant"]
type Size = VariantProps<typeof buttonVariants>["size"]

type Props = React.ComponentProps<"a"> & {
  variant?: Variant
  size?: Size
}

export function ButtonLink({ className, variant, size, ...props }: Props) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
