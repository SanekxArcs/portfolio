"use client"

import { FileBadge2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { SectionWrapper } from "@/components/cv/section-wrapper"
import type { CvCourse } from "@/components/cv/types"

type Props = {
  courses?: CvCourse[]
}

export function Certificates({ courses }: Props) {
  if (!courses?.length) return null

  return (
    <section id="certification" className="cursor-default select-none scroll-m-16">
      <SectionWrapper icon={<FileBadge2 className="mr-2" />} title="Certificates">
        <div className="grid gap-5">
          {courses.map((course, index) => (
            <div
              key={`${course.title}-${index}`}
              className={`${course.visibleOnCV === false ? "print:hidden" : ""} print:last:col-span-2`}
            >
              <h4>{course.title}</h4>
              {course.platform ? <h5>{course.platform}</h5> : null}
              <div className="flex flex-wrap gap-1 py-3 pr-10">
                {course.badges?.map((b, i) => (
                  <Badge variant="secondary" key={`${b}-${i}`}>
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </section>
  )
}
