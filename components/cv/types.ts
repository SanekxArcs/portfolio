export type CvContacts = {
  email?: string;
  phoneNumber?: string;
  location?: string;
  relocationReady?: boolean;
  typeOfContract?: string[];
  workAvailability?: string[];
};

export type CvLink = {
  link: string;
  name: string;
  title?: string;
  iconName?: string;
};

export type CvLanguage = {
  language: string;
  level?: string;
};

export type CvEducationItem = {
  institution?: string;
  specialization?: string;
};

export type CvProject = {
  title: string;
  description?: string;
  features?: string[];
  technologies?: string[];
  url?: string;
  urlToCode?: string;
  imageUrls?: string[];
  petProject?: boolean;
  isPinned?: boolean;
  nda?: boolean;
};

export type CvCourse = {
  title: string;
  platform?: string;
  date?: string;
  badges?: string[];
  visibleOnCV?: boolean;
};

export type CvWorkExperience = {
  jobTitle: string;
  jobTitle2?: string;
  companyName?: string;
  location?: string;
  duration?: string;
  type?: string;
  description?: string[];
  website?: string;
  websiteName?: string;
  print?: boolean;
  isRelated?: boolean;
};

export type CvProfile = {
  _id: string;
  name: string;
  role: string;
  about: string;
  description?: string;
  profilePhotoUrl?: string;
  vcardQrUrl?: string;
  vcardUrl?: string;
  cvUrl?: string;
  cvFileUrl?: string;
  contacts?: CvContacts;
  links: CvLink[];
  languages?: CvLanguage[];
  skillsFrontend?: string[];
  skillsBackend?: string[];
  skillsDevOps?: string[];
  skillsOther?: string[];
  softSkills?: string[];
  interests?: string[];
  education?: CvEducationItem[];
  petProjects?: CvProject[];
  commercialProjects?: CvProject[];
  projects?: CvProject[];
  courses?: CvCourse[];

  workExperience?: CvWorkExperience[];
};
