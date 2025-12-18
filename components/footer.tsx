import Link from 'next/link'
import {Rodo} from './cv/main/rodo'
import {client} from '@/sanity/lib/client'
import {CV_PROFILE_DATA} from '@/sanity/queries/queries'
import {CV_PROFILE_DATAResult} from '@/sanity.types'
import {
  Github,
  Linkedin,
  Mail,
  User,
  Briefcase,
  Cpu,
  FolderGit2,
  Globe,
  MessageSquare,
  Send,
  Facebook,
  MessageCircle,
} from 'lucide-react'
import {Button} from './ui/button'
import {ScrollToTop} from './scroll-to-top'
import {HighlightedText} from './cv/atoms/highlighted-text'
import {cn} from '@/lib/utils'

export const Footer = async () => {
  const profile = await client.fetch<CV_PROFILE_DATAResult>(CV_PROFILE_DATA)
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

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'OD'

  return (
    <footer className="bg-background/95 relative overflow-hidden border-t pt-16 pb-8  cursor-default">
      {/* Decorative Background Icon */}
      <div className="pointer-events-none absolute -top-20 -right-20 opacity-[0.03] transition-transform duration-500 group-hover:scale-110">
        <Globe className="h-96 w-96" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center overflow-hidden relative',
                  profile?.logoUrl ? 'bg-transparent' : 'bg-emerald-600 rounded-lg text-white font-bold'
                )}
              >
                {profile?.logoUrl ? (
                  <div
                    role="img"
                    className="h-full w-full from-emerald-950 to-emerald-900 bg-linear-to-t dark:from-white dark:to-emerald-100 transition-colors duration-300"
                    style={{
                      maskImage: `url(${profile.logoUrl})`,
                      WebkitMaskImage: `url(${profile.logoUrl})`,
                      maskSize: 'contain',
                      WebkitMaskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskPosition: 'center',
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <span className="text-xl font-bold cursor-default tracking-tighter">
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
            <div className="space-y-3">
              {profile?.contacts?.location && (
                <div className="text-muted-foreground flex items-start gap-3 text-sm">
                  <Globe className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{profile.contacts.location}</span>
                </div>
              )}
              {profile?.contacts?.email && (
                <div className="text-muted-foreground flex items-start gap-3 text-sm">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <Link
                    href={`mailto:${profile.contacts.email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {profile.contacts.email}
                  </Link>
                </div>
              )}
              <div className="pt-2">
                <Link
                  href={
                    profile?.contacts?.phoneNumber
                      ? `tel:${profile.contacts.phoneNumber}`
                      : '#cta'
                  }
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 cursor-pointer border-emerald-500/20 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Let&apos;s Talk
                  </Button>
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
              <span>Built with Next.js & Sanity</span>
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
