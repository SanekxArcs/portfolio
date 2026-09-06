import {User, Speech} from 'lucide-react'

import {Card, CardContent} from '@/components/ui/card'
import type {CvProfile} from '@/components/cv/types'
import {HighlightedText} from '@/components/cv/atoms/highlighted-text'
import {getAllSkills} from '@/lib/cv-utils'

type Props = {
  profile: CvProfile
}

export function About({profile}: Props) {
  const allSkills = getAllSkills(profile)

  return (
    <section
      id="about"
      className="mb-20 scroll-mt-24"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <User className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">About Me</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="">
          <Card className="group relative h-full overflow-hidden border-2">
            <div className="translate-y--8 absolute top-0 right-0 h-24 w-24 translate-x-8 text-emerald-500 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]">
              <User className="h-full w-full" />
            </div>
            <CardContent className="p-6 pt-0 lg:p-8 lg:pt-0">
              <p className="text-muted-foreground text-lg leading-relaxed">
                <HighlightedText
                  text={profile.about || ''}
                  skills={allSkills}
                  highlightClassName="group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                />
              </p>
              {profile.softSkills && profile.softSkills.length > 0 && (
                <>
                  <div className="mt-2 flex items-center justify-between gap-2 pt-2 pb-6 text-xl">
                    <div className="flex items-center gap-2 text-xl">
                      <Speech className="h-5 w-5 text-emerald-500" />
                      Soft Skills
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {profile.softSkills.map((item, i) => (
                      <div
                        key={i}
                        className="group/skill relative border-l-2 border-emerald-500/20 pl-4 transition-colors hover:border-emerald-500"
                      >
                        <div className="text-foreground font-bold transition-colors group-hover/skill:text-emerald-600 dark:group-hover/skill:text-emerald-400">
                          {item.skill}
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground mt-1 text-sm leading-snug">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
