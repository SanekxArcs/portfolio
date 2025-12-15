'use client';

import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Contact,
  FileCode2,
  Menu,
  School,
  FileBadge2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// Hardcoded for now, or could be moved to a separate data file
const headInformation = {
  name: "Oleksandr Dzisiak",
  work: "Front-End Developer",
};

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const navigationItems: NavItem[] = [
  {
    href: "#contacts",
    icon: <Contact className="w-4 h-4 mr-2" />,
    label: "Contacts",
  },
  {
    href: "#projects",
    icon: <FileCode2 className="w-4 h-4 mr-2" />,
    label: "Projects",
  },
  {
    href: "#work",
    icon: <Building2 className="w-4 h-4 mr-2" />,
    label: "Work experience",
  },
  {
    href: "#education",
    icon: <School className="w-4 h-4 mr-2" />,
    label: "Education",
  },
  {
    href: "#certification",
    icon: <FileBadge2 className="w-4 h-4 mr-2" />,
    label: "Certification",
  },
];

const ProfileSection = () => (
  <div className="flex gap-2 items-center">
    <div className="w-10 h-10 overflow-hidden transition-all duration-700 border-2 rounded-full border-primary group bg-gradient-to-br from-primary/40 to-primary/70">
       <Avatar>
        <AvatarImage src="/profile.webp" alt={headInformation.name} />
        <AvatarFallback>OD</AvatarFallback>
      </Avatar>
    </div>
    <div className="flex flex-col items-start justify-center">
      <p className="font-black leading-none">{headInformation.name}</p>
      <p className="text-sm text-muted-foreground">{headInformation.work}</p>
    </div>
  </div>
);

export const Header = () => {
  return (
    <AnimatePresence>
      <motion.header
        initial={{ opacity: 0, scale: 0, y: -112 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="px-4 sticky top-0 rounded-br-md rounded-bl-md bg-gradient-to-br w-full flex items-center justify-between from-primary/10 to-primary/70 backdrop-blur-md h-14 z-50 border-b border-primary/20"
      >
        <ProfileSection />

        <div className="flex items-center gap-2 w-fit">
          <div>
            <ModeToggle />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button size="icon" variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navigationItems.map((item) => (
                <DropdownMenuItem key={item.href}>
                  <Link href={item.href} className="flex items-center cursor-pointer">
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>
    </AnimatePresence>
  );
};
