import { defineField, defineType } from "sanity";

export const cvProfile = defineType({
  name: "cvProfile",
  title: "CV Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Position",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "about",
      title: "About",
      type: "text",
      rows: 5,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "profilePhoto",
      title: "Profile photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "cvUrl",
      title: "CV link (URL)",
      type: "url",
      description: "Optional link to an online CV (e.g. site, Google Docs).",
    }),
    defineField({
      name: "cvFile",
      title: "CV file (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
      description: "Optional uploaded CV PDF file.",
    }),
    defineField({
      name: "contacts",
      title: "Contacts",
      type: "object",
      fields: [
        defineField({ name: "email", title: "Email", type: "string" }),
        defineField({
          name: "phoneNumber",
          title: "Phone number",
          type: "string",
        }),
        defineField({ name: "location", title: "Location", type: "string" }),
        defineField({
          name: "relocationReady",
          title: "Relocation ready",
          type: "boolean",
        }),
        defineField({
          name: "typeOfContract",
          title: "Type of contract",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: [
              "Full-time",
              "Part-time",
              "B2B",
              "Contract",
              "Temporary",
              "Internship",
            ],
          },
        }),
        defineField({
          name: "workAvailability",
          title: "Work availability",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: [
              "Immediately",
              "Within 2 weeks",
              "Within 1 month",
              "Not available",
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "link",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "name",
              title: "Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "title", title: "Tooltip", type: "string" }),
            defineField({
              name: "iconName",
              title: "Icon name (lucide)",
              type: "string",
              description:
                "Example: Github, Linkedin, Send, MessagesSquare, Facebook",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "language",
              title: "Language",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "level", title: "Level", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "softSkills",
      title: "Soft skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "skillsFrontend",
      title: "Frontend Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "skillsBackend",
      title: "Backend Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "skillsDevOps",
      title: "DevOps & Tools Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "skillsOther",
      title: "Other Technical Skills",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "interests",
      title: "Interests",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "institution",
              title: "Institution",
              type: "string",
            }),
            defineField({
              name: "specialization",
              title: "Specialization",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "petProject",
              title: "Pet Project?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "isPinned",
              title: "Pinned?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "nda",
              title: "NDA?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "array",
              of: [{ type: "image", options: { hotspot: true } }],
            }),
            defineField({
              name: "features",
              title: "Features",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "technologies",
              title: "Technologies",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({ name: "url", title: "URL", type: "url" }),
            defineField({ name: "urlToCode", title: "URL to Code", type: "url" }),
          ],
        },
      ],
    }),
    defineField({
      name: "courses",
      title: "Courses / Certificates",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
            }),
            defineField({ name: "date", title: "Date", type: "string" }),
            defineField({
              name: "badges",
              title: "Badges",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "visibleOnCV",
              title: "Visible on CV",
              type: "boolean",
              initialValue: true,
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "workExperience",
      title: "Work experience",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "jobTitle",
              title: "Job title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "jobTitle2",
              title: "Job title (second)",
              type: "string",
            }),
            defineField({
              name: "companyName",
              title: "Company",
              type: "string",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
            }),
            defineField({ name: "type", title: "Type", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({ name: "website", title: "Website", type: "url" }),
            defineField({
              name: "websiteName",
              title: "Website label",
              type: "string",
            }),
            defineField({
              name: "isRelated",
              title: "Related to role?",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "hideFromCV",
              title: "Hide",
              type: "boolean",
              initialValue: false,
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "profilePhoto",
    },
  },
});
