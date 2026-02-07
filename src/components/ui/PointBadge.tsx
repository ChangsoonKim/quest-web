import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Coins } from "lucide-react"

import { cn } from "@/lib/utils"

const pointBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-amber-100 text-amber-800 hover:bg-amber-100/80 dark:bg-amber-900/30 dark:text-amber-300",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
        lg: "px-3 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface PointBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pointBadgeVariants> {
  points: number
}

function PointBadge({ className, variant, size, points, ...props }: PointBadgeProps) {
  const iconSize = size === "lg" ? 18 : size === "sm" ? 12 : 14

  return (
    <span className={cn(pointBadgeVariants({ variant, size }), className)} {...props}>
      <Coins size={iconSize} className="shrink-0" />
      <span>{points.toLocaleString()}P</span>
    </span>
  )
}

export { PointBadge, pointBadgeVariants }
