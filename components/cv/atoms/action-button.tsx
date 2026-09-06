import React from 'react'
import Link from 'next/link'
import {buttonVariants} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import { useVibrationOnClick } from '@/hooks/use-vibration'

interface ActionButtonProps {
  href: string
  className?: string
  classLink?: string
  icon?: React.ReactNode
  label?: string
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  external?: boolean
  download?: boolean
  spoiler?: boolean
  props?: React.HTMLAttributes<HTMLAnchorElement>
}

export function ActionButton({
  href,
  icon,
  label,
  variant = 'default',
  size = 'lg',
  className,
  classLink,
  external = false,
  download = false,
  props,
  spoiler = false,
}: ActionButtonProps) {
    const vibrate = useVibrationOnClick(50);
  const buttonContent = (
    <>
      {React.isValidElement(icon) && React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
        className: 'size-4 group-hover/button:scale-110 transition-all duration-300',
      })}
      {spoiler ? (
        <span className="blur-sm transition-[filter] group-hover/button:blur-none group-focus/button:blur-none">
          {label}
        </span>
      ) : (
        label || null
      )}
    </>
  )

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({variant, size}), 'group/button cursor-pointer', classLink, className)}
        download={download}
        onClick={vibrate}
        {...props}
      >
          {buttonContent}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={cn(buttonVariants({variant, size}), 'group/button cursor-pointer', classLink, className)}
      download={download}
      onClick={vibrate}
      {...props}
    >
        {buttonContent}
    </Link>
  )
}
