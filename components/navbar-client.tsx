"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Menu,
  X,
  User,
  Briefcase,
  Cpu,
  FolderGit2,
  Zap,
  ZapOff,
} from "lucide-react";
import GradualBlur from "./GradualBlur";
import { motion, AnimatePresence } from "motion/react";
import { useUIStore } from "@/hooks/use-ui-store";
import Image from "next/image";
import {ButtonGroup} from "@/components/ui/button-group";


const navLinks = [
  { href: "#about", label: "About", icon: User },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#skills", label: "Skills", icon: Cpu },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
];

export function NavbarClient({
  logoUrl,
  name,
}: {
  logoUrl?: string | null;
  name?: string | null;
}) {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string>("");
  const { isReducedMotion, toggleReducedMotion } = useUIStore();

  const initials = React.useMemo(() => {
    if (!name) return "OD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ["about", "experience", "skills", "projects"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent ",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter flex items-center"
        >
          <div
            className={cn(
              "size-8 flex items-center justify-center overflow-hidden relative",
              logoUrl ? "bg-transparent" : "bg-emerald-600 rounded-lg text-white"
            )}
          >
            {logoUrl ? (
              <div
                role="img"
                className="h-full w-full from-emerald-950 to-emerald-900 bg-linear-to-t dark:from-white dark:to-emerald-100 transition-colors duration-300"
                style={{
                  maskImage: `url(${logoUrl})`,
                  WebkitMaskImage: `url(${logoUrl})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            ) : (
              initials
            )}
          </div>
          <span
            className={cn(
              "inline-block transition-opacity",
              isScrolled ? "opacity-100" : "opacity-50"
            )}
          >
            .dev
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-2 relative group/nav",
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground hover:text-emerald-600"
                )}
              >
                <link.icon className={cn(
                  "w-4 h-4 transition-transform duration-300",
                  isActive ? "scale-110" : "group-hover/nav:scale-110"
                )} />
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -top-4.25 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <div className="h-4 w-px bg-border" />
          <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleReducedMotion}
            title={isReducedMotion ? "Enable animations" : "Reduce motion"}
          >
            {isReducedMotion ? (
              <ZapOff className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </Button>
          <ModeToggle />
          </ButtonGroup>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleReducedMotion}
            title={isReducedMotion ? "Enable animations" : "Reduce motion"}
          >
            {isReducedMotion ? (
              <ZapOff className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </Button>
          <ModeToggle />
          </ButtonGroup>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 1, y: "-200%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: "-200%" }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 bg-transparent border-b shadow-lg p-4 flex flex-col justify-end items-end gap-4"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium p-2 rounded-md transition-colors flex items-center gap-2 w-full justify-end",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <GradualBlur
              target="parent"
              position="bottom"
              height="100%"
              strength={2}
              divCount={10}
              curve="bezier"
              exponential={true}
              opacity={1}
              zIndex={-1}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <GradualBlur
        target="parent"
        position="top"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={-1}
      />
    </header>
  );
}
