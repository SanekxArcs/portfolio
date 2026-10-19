'use client'
import {motion, type Variants} from 'motion/react'
import {MapPin, MoveUpRight, Clock3, BriefcaseBusiness} from 'lucide-react'
import type {CvProfile} from '@/components/cv/types'

type Props = {profile: CvProfile; variants: Variants}
const timeCommitment = /^(?:part[\s-]?time|full[\s-]?time)$/i

export function HeroDetails({profile, variants}: Props) {
  const contacts = profile.contacts
  const options = [...new Set((contacts?.typeOfContract ?? []).map(value => value.trim()).filter(Boolean))]
  const availability = options.filter(value => timeCommitment.test(value))
  const contracts = options.filter(value => !timeCommitment.test(value))
  const facts = [
    ...(contacts?.location ? [{label: 'Based in', value: contacts.location, icon: MapPin}] : []),
    ...(typeof contacts?.relocationReady === 'boolean' ? [{label: 'Relocation', value: contacts.relocationReady ? 'Open to relocation' : 'Not considering relocation', icon: MoveUpRight}] : []),
    ...(availability.length ? [{label: 'Availability', value: availability.join(' / '), icon: Clock3}] : []),
    ...(contracts.length ? [{label: 'Contract', value: contracts.join(' / '), icon: BriefcaseBusiness}] : []),
  ]
  if (!facts.length) return null
  return <motion.dl className="hero-facts" variants={variants}>
    {facts.map(({label, value, icon: Icon}) => <div className="hero-fact" key={label}><dt><Icon size={13} aria-hidden="true" />{label}</dt><dd>{value}</dd></div>)}
  </motion.dl>
}
