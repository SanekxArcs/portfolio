import { defineQuery } from "next-sanity";

export const CV_PROFILE_DATA = defineQuery(`
*[_type == "cvProfile"][0]{
  _id,
  name,
  role,
  description,
  about,
  cvUrl,
  "logoUrl": logo.asset->url,
  "profilePhotoUrl": profilePhoto.asset->url,
  "cvFileUrl": cvFile.asset->url,
  contacts{
    email,
    phoneNumber,
    location,
    relocationReady,
    typeOfContract,
    workAvailability
  },
  links[]{
    link,
    name,
    title,
    iconName
  },
  languages[]{
    language,
    level
  },
  skillsFrontend,
  skillsBackend,
  skillsDevOps,
  skillsOther,
  softSkills[]{
    skill,
    description
  },
  interests,
  education[]{
    institution,
    specialization
  },
  projects[]{
    title,
    description,
    "imageUrls": image[].asset->url,
    features,
    technologies,
    url,
    urlToCode,
    petProject,
    isPinned,
    nda
  },
  courses[]{
    title,
    platform,
    date,
    badges,
    visibleOnCV
  },
  workExperience[]{
    jobTitle,
    jobTitle2,
    companyName,
    location,
    duration,
    type,
    description,
    website,
    websiteName,
    isRelated,
    hideFromCV
  }
}
`);
