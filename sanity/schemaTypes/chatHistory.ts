import { defineField, defineType } from "sanity";

export const chatHistory = defineType({
  name: "chatHistory",
  title: "Chat History",
  type: "document",
  fields: [
    defineField({
      name: "sessionId",
      title: "Session ID",
      type: "string",
      description: "Unique identifier for this chat session",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
    }),
    defineField({
      name: "userPhone",
      title: "User Phone",
      type: "string",
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
    }),
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
    }),
    defineField({
      name: "messages",
      title: "Messages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              options: {
                list: [
                  { title: "User", value: "user" },
                  { title: "Assistant", value: "assistant" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "text",
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "timestamp",
              title: "Timestamp",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              role: "role",
              content: "content",
              timestamp: "timestamp",
            },
            prepare({ role, content, timestamp }) {
              return {
                title: `${role}: ${content.substring(0, 50)}...`,
                subtitle: new Date(timestamp).toLocaleString(),
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      userName: "userName",
      userEmail: "userEmail",
      createdAt: "createdAt",
    },
    prepare({ userName, userEmail, createdAt }) {
      return {
        title: userName || userEmail || "Anonymous",
        subtitle: `Chat from ${new Date(createdAt).toLocaleString()}`,
      };
    },
  },
});
