'use client'
import {motion, Variants} from 'motion/react'
import {ActionButton} from '@/components/cv/atoms/action-button'
import {mainHeadConfig} from '../main-head.config'
import type {CvProfile} from '@/components/cv/types'

type Props = {
  profile: CvProfile
  variants: Variants
}

export function HeroSocials({profile, variants}: Props) {
  const {icons, socials} = mainHeadConfig

  const githubLink = profile.links?.find(
    (link) => link.iconName === 'Github' || link.title?.toLowerCase().includes('github'),
  )
  const linkedinLink = profile.links?.find(
    (link) => link.iconName === 'Linkedin' || link.title?.toLowerCase().includes('linkedin'),
  )
  const facebookLink = profile.links?.find(
    (link) => link.iconName === 'Facebook' || link.title?.toLowerCase().includes('facebook'),
  )
  const telegramLink = profile.links?.find(
    (link) => link.iconName === 'Telegram' || link.title?.toLowerCase().includes('telegram'),
  )
  const whatsappLink = profile.links?.find(
    (link) => link.iconName === 'Whatsapp' || link.title?.toLowerCase().includes('whatsapp'),
  )

  return (
    <motion.div className="mb-6 flex flex-row flex-wrap gap-3" variants={variants}>
      {githubLink && (
        <ActionButton
          href={githubLink.link || '#'}
          icon={<icons.Github />}
          label={socials.github}
          variant="outline"
          className="text-muted-foreground"
          external
        />
      )}
      {linkedinLink && (
        <ActionButton
          href={linkedinLink.link || '#'}
          icon={<icons.Linkedin />}
          label={socials.linkedin}
          variant="outline"
          className="text-muted-foreground"
          external
        />
      )}
      {facebookLink && (
        <ActionButton
          href={facebookLink.link || '#'}
          icon={<icons.Facebook />}
          label={socials.facebook}
          variant="outline"
          className="text-muted-foreground"
          external
        />
      )}
      {telegramLink && (
        <ActionButton
          href={telegramLink.link || '#'}
          icon={<icons.Send />}
          label={socials.telegram}
          variant="outline"
          className="text-muted-foreground"
          external
        />
      )}
      {whatsappLink && (
        <ActionButton
          href={whatsappLink.link || '#'}
          icon={<icons.MessageCircle />}
          label={socials.whatsapp}
          variant="outline"
          className="text-muted-foreground"
          external
        />
      )}
    </motion.div>
  )
}
