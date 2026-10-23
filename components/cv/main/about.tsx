import {User, Speech} from 'lucide-react'

import {Card, CardContent} from '@/components/ui/card'
import type {CvProfile} from '@/components/cv/types'
import {HighlightedText} from '@/components/cv/atoms/highlighted-text'
import {getAllSkills} from '@/lib/cv-utils'
import './about.css'

type Props = {profile: CvProfile}

export function About({profile}: Props) {
  const allSkills = getAllSkills(profile)
  const paragraphs = (profile.about ?? '').split(/\r?\n\s*\r?\n/).map(text => text.trim()).filter(Boolean)
  const strengths = (profile.softSkills ?? []).filter(item => item.skill?.trim() || item.description?.trim())

  return (
    <section id="about" aria-labelledby="about-title" className="mb-20 scroll-mt-24">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        </div>
        <h2 id="about-title" className="text-3xl font-bold">About Me</h2>
      </div>

      <Card className="about-card border-2 py-0">
        <CardContent className="about-content p-6 lg:p-8">
          {paragraphs.length > 0 && <div className="about-bio">
            {paragraphs.map((text, index) => <p key={index}>
              <HighlightedText text={text} skills={allSkills} highlightClassName="text-emerald-700 dark:text-emerald-400" />
            </p>)}
          </div>}
          {strengths.length > 0 && <div className="about-strengths" data-has-bio={paragraphs.length > 0}>
            <div className="about-strengths-heading">
              <Speech size={18} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <h3 id="about-strengths-title">Soft Skills</h3>
            </div>
            <ul className="about-strengths-grid" aria-labelledby="about-strengths-title">
              {strengths.map((item, index) => <li className="about-strength" key={index}>
                {item.skill && <h4>{item.skill}</h4>}
                {item.description && <p>{item.description}</p>}
              </li>)}
            </ul>
          </div>}
        </CardContent>
      </Card>
    </section>
  )
}
