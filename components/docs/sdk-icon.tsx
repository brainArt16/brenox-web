import Image from "next/image"
import { cn } from "@/lib/utils"

interface SdkIconProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function SdkIcon({ src, alt, size = 20, className }: SdkIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      unoptimized
    />
  )
}
