"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Menu, X, User, Briefcase, Cpu, FolderGit2 } from "lucide-react";
import GradualBlur from "./GradualBlur";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { href: "#about", label: "About", icon: User },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#skills", label: "Skills", icon: Cpu },
  { href: "#projects", label: "Projects", icon: FolderGit2 },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
          <span className="bg-emerald-600 text-white w-8 h-8 flex items-center justify-center rounded-lg">
            OD
          </span>
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-emerald-600 transition-colors flex items-center gap-2"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          <div className="h-4 w-px bg-border" />
          <ModeToggle />
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium p-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
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

export default Navbar;
