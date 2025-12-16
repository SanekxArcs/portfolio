import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Spoiler } from "spoiled";

interface ActionButtonProps {
  href: string;
  className?: string;
  classLink?: string;
  icon?: React.ReactNode;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  external?: boolean;
  download?: boolean;
  spoiler?: boolean;
  props?: React.HTMLAttributes<HTMLAnchorElement>;
}

export function ActionButton({
  href,
  icon,
  label,
  variant = "default",
  size = "lg",
  className,
  classLink,
  external = false,
  download = false,
  props,
  spoiler = false,
}: ActionButtonProps) {
  const buttonContent = (
    <>
      {React.cloneElement(
        icon as React.ReactElement<React.SVGProps<SVGSVGElement>>,
        {
          className: "size-4 group-hover:scale-110 transition-all duration-300",
        }
      )}
      {spoiler ? (
        <Spoiler revealOn="hover" fps={1} accentColor={["black", "white"]}>
          {label}
        </Spoiler>
      ) : (
        label || null
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(`group cursor-pointer`, classLink)}
        download={download}
        {...props}
      >
        <Button
          variant={variant}
          size={size}
          className={cn(
            "group-active:scale-90 transition-all duration-200 cursor-pointer",
            className
          )}
        >
          {buttonContent}
        </Button>
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(`group cursor-pointer`, classLink)}
      download={download}
      {...props}
    >
      <Button
        variant={variant}
        size={size}
        className={cn(
          "group-active:scale-90 transition-all duration-200 cursor-pointer",
          className
        )}
      >
        {buttonContent}
      </Button>
    </Link>
  );
}
