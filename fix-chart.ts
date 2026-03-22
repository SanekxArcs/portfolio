import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { ComponentProps } from "react"

type TooltipProps = ComponentProps<typeof RechartsPrimitive.Tooltip>
type TooltipPayload = NonNullable<TooltipProps["payload"]>
