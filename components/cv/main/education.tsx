import {GraduationCap, Award} from 'lucide-react'

import {Card, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import type {CvProfile} from '@/components/cv/types'

type Props = {
  profile: CvProfile
}

export function Education({profile}: Props) {

  if (
    (!profile.education || profile.education.length === 0) &&
    (!profile.courses || profile.courses.length === 0)
  ) {
    return null
  }

  return (
    <section
      id="education"
      className="mb-20 scroll-mt-24"
    >
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-3xl font-bold">Education & Certifications</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {profile.education?.map((edu, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-2 transition-colors hover:border-emerald-500/10 md:first:col-span-2 md:odd:last:col-span-2 md:nth-[2]:col-span-2"
          >
            <div className="translate-y--8 absolute top-0 right-0 h-24 w-24 translate-x-8 text-emerald-500 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]">
              <GraduationCap className="h-full w-full" />
            </div>
            <CardHeader>
              <div className="flex items-start gap-2">
                <GraduationCap className="text-muted-foreground mt-1 h-5 w-5 shrink-0 transition-colors group-hover:text-emerald-500" />
                <div>
                  <CardTitle className="text-lg">{edu.institution}</CardTitle>
                  {edu.specialization && (
                    <p className="text-muted-foreground text-sm">{edu.specialization}</p>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {profile.courses?.map((cert, index) => (
          <Card
            key={index}
            className="group relative overflow-hidden border-2 transition-colors hover:border-emerald-500/10 md:last:col-span-2"
          >
            <div className="translate-y--8 absolute top-0 right-0 h-24 w-24 translate-x-8 text-emerald-500 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05]">
              <Award className="h-full w-full" />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Award className="text-muted-foreground mt-1 h-5 w-5 shrink-0 transition-colors group-hover:text-emerald-500" />
                  <div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    {cert.platform && (
                      <p className="text-muted-foreground mt-1 text-sm">{cert.platform}</p>
                    )}
                    {cert.badges && cert.badges.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {cert.badges.map((badge, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {cert.date && (
                  <Badge variant="secondary" className="shrink-0 whitespace-nowrap">
                    {cert.date}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
