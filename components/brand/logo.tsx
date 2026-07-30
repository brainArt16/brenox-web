import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const sizes = {
  sm: { width: 96, height: 21 },
  md: { width: 120, height: 27 },
  lg: { width: 160, height: 36 },
} as const

export type LogoSize = keyof typeof sizes

type LogoProps = {
  size?: LogoSize
  /** Set to `false` to render without a link. Defaults to `"/"`. */
  href?: string | false
  className?: string
  priority?: boolean
}

export function Logo({ size = "md", href = "/", className, priority }: LogoProps) {
  const { width, height } = sizes[size]

  const image = (
    <Image
      src="/logo.svg"
      alt="Brenox"
      width={width}
      height={height}
      priority={priority}
      className="dark:invert"
    />
  )

  if (href === false) {
    return <span className={cn("inline-flex items-center", className)}>{image}</span>
  }

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {image}
    </Link>
  )
}
