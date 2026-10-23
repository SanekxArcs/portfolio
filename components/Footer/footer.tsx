import Link from 'next/link'
import {
  Mail,
  User,
  Briefcase,
  Cpu,
  FolderGit2,
  Globe,
  Phone,
  Send,
  MessageCircle,
} from 'lucide-react'

import {Github, Linkedin, Facebook} from '@/components/icons/brand-icons'
import {BrandMark} from '@/components/brand-mark'
import {getProfile} from '@/lib/content'

import {Rodo} from '@/components/cv/main/rodo'
import {buttonVariants} from '@/components/ui/button'
import {ScrollToTop} from '@/components/scroll-to-top'
import {HighlightedText} from '@/components/cv/atoms/highlighted-text'
import {cn} from 'cn'

export const Footer = async () => {
  const profile = await getProfile()
  const currentYear = new Date().getFullYear()

  const allSkills = [
    ...(profile?.skillsFrontend || []),
    ...(profile?.skillsBackend || []),
    ...(profile?.skillsDevOps || []),
    ...(profile?.skillsOther || []),
  ]

  const navLinks = [
    {href: '#about', label: 'About', icon: User},
    {href: '#experience', label: 'Experience', icon: Briefcase},
    {href: '#skills', label: 'Skills', icon: Cpu},
    {href: '#projects', label: 'Projects', icon: FolderGit2},
  ]

  const socialLinks = profile?.links || []

  return (
    <footer className="bg-background/95 relative z-10 cursor-default overflow-hidden border-t pt-16 pb-8">
      {/* Decorative Background Icon */}
      <div className="pointer-events-none absolute -top-20 -right-20 opacity-[0.03] transition-transform duration-500 group-hover:scale-110">
        <Globe className="h-96 w-96" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <BrandMark logoUrl={profile?.logoUrl} />
              <span className="cursor-default text-xl font-bold tracking-tighter">
                {profile?.name || 'Oleksandr Dzisiak'}
              </span>
            </div>
            <div className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              <HighlightedText
                text={
                  profile?.description ||
                  'Building digital experiences with passion and precision. Focused on creating impactful and user-centric solutions.'
                }
                skills={allSkills}
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((link, i) => {
                const name = link.title?.toLowerCase() || ''
                return (
                  <Link
                    key={i}
                    href={link.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted/50 text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                    title={link.title || link.name || ''}
                  >
                    {name.includes('github') && <Github className="size-4" />}
                    {name.includes('linkedin') && <Linkedin className="size-4" />}
                    {name.includes('telegram') && <Send className="size-4" />}
                    {name.includes('facebook') && <Facebook className="size-4" />}
                    {name.includes('whatsapp') && <MessageCircle className="size-4" />}
                    {!name.includes('github') &&
                      !name.includes('linkedin') &&
                      !name.includes('telegram') &&
                      !name.includes('facebook') &&
                      !name.includes('whatsapp') && <Globe className="size-4" />}
                  </Link>
                )
              })}
              {profile?.contacts?.email && (
                <Link
                  href={`mailto:${profile.contacts.email}`}
                  className="bg-muted/50 text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                  title="Email Me"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground group flex items-center gap-2 text-sm transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  <link.icon className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-foreground text-sm font-bold tracking-wider uppercase">
              Get in Touch
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              {profile?.contacts?.location && (
                <div className="text-muted-foreground flex basis-full items-start gap-3 text-sm">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{profile.contacts.location}</span>
                </div>
              )}
              {profile?.contacts?.email && (
                <Link href={`mailto:${profile.contacts.email}`} className={cn(buttonVariants({variant: 'outline', size: 'icon'}), 'size-9 border-emerald-500/20')} aria-label="Email me" title="Email me"><Mail className="size-4" /></Link>
              )}
              <div className="flex">
                <Link
                  className={cn(buttonVariants({variant: 'outline', size: 'icon'}), 'size-9 border-emerald-500/20')}
                  aria-label="Call me"
                  title="Call me"
                  href={
                    profile?.contacts?.phoneNumber ? `tel:${profile.contacts.phoneNumber}` : '#cta'
                  }
                >
                    <Phone className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-border/50 mt-16 border-t pt-8">
          <Rodo />
          <div className="mt-8 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <span>© {currentYear}</span>
              <span className="hidden md:inline">•</span>
              <span>Built with Next.js & TypeScript</span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/SanekxArcs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground text-sm font-medium transition-colors hover:text-emerald-600"
              >
                GitHub
              </Link>
              <ScrollToTop />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
