import { defineQuery } from "next-sanity";

export const CV_PROFILE_DATA = defineQuery(`
*[_type == "cvProfile"][0]{
  _id,
  _updatedAt,
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
    "title": select(nda == true => "Confidential project", title),
    description,
    "imageUrls": select(nda == true => [], image[].asset->url),
    features,
    technologies,
    "url": select(nda == true => null, url),
    "urlToCode": select(nda == true => null, urlToCode),
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
  workExperience[hideFromCV != true]{
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

export const NAVBAR_DATA = defineQuery(`
*[_type == "cvProfile"][0]{
  name,
  "logoUrl": logo.asset->url
}
`);

export const AI_CONFIG_DATA = defineQuery(`
*[_type == "aiConfig"][0]{
  _id,
  systemPrompt,
  additionalInfo,
  greetingMessage
}
`);
