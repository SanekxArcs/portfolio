export type CvContacts = {
  email?: string | null
  phoneNumber?: string | null
  location?: string | null
  relocationReady?: boolean | null
  typeOfContract?: string[] | null
  workAvailability?: string[] | null
}

export type CvLink = {
  link: string | null
  name: string | null
  title?: string | null
  iconName?: string | null
}

export type CvLanguage = {
  language: string | null
  level?: string | null
}

export type CvEducationItem = {
  institution?: string | null
  specialization?: string | null
}

export type CvProject = {
  title: string | null
  description?: string | null
  features?: string[] | null
  technologies?: string[] | null
  url?: string | null
  urlToCode?: string | null
  imageUrls?: (string | null)[] | null
  petProject?: boolean | null
  isPinned?: boolean | null
  nda?: boolean | null
}

export type CvCourse = {
  title: string | null
  platform?: string | null
  date?: string | null
  badges?: string[] | null
  visibleOnCV?: boolean | null
}

export type CvWorkExperience = {
  jobTitle: string | null
  jobTitle2?: string | null
  companyName?: string | null
  location?: string | null
  duration?: string | null
  type?: string | null
  description?: string[] | null
  website?: string | null
  websiteName?: string | null
  print?: boolean | null
  isRelated?: boolean | null
}

export type CvProfile = {
  _id: string
  name: string | null
  role: string | null
  about: string | null
  description?: string | null
  logoUrl?: string | null
  profilePhotoUrl?: string | null
  vcardQrUrl?: string | null
  vcardUrl?: string | null
  cvUrl?: string | null
  cvFileUrl?: string | null
  contacts?: CvContacts | null
  links: CvLink[] | null
  languages?: CvLanguage[] | null
  skillsFrontend?: string[] | null
  skillsBackend?: string[] | null
  skillsDevOps?: string[] | null
  skillsOther?: string[] | null
  softSkills?: {skill: string | null; description?: string | null}[] | null
  interests?: string[] | null
  education?: CvEducationItem[] | null
  petProjects?: CvProject[] | null
  commercialProjects?: CvProject[] | null
  projects?: CvProject[] | null
  courses?: CvCourse[] | null

  workExperience?: CvWorkExperience[] | null
}
