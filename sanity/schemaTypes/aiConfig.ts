import { defineField, defineType } from "sanity";

export const aiConfig = defineType({
  name: "aiConfig",
  title: "AI Configuration",
  type: "document",
  fields: [
    defineField({
      name: "systemPrompt",
      title: "System Prompt",
      type: "text",
      rows: 10,
      description: "The main system prompt that instructs the AI on how to act and respond. This should include instructions to sell you as an employee or your services.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "additionalInfo",
      title: "Additional Information",
      type: "text",
      rows: 5,
      description: "Additional context or information to provide to the AI about you, your skills, services, or anything else relevant.",
    }),
    defineField({
      name: "greetingMessage",
      title: "Greeting Message",
      type: "string",
      description: "The initial message shown to users when they open the chat.",
      initialValue: "Hi! I'm an AI assistant here to tell you about my services. How can I help you today?",
    }),
  ],
  preview: {
    select: {
      title: "systemPrompt",
    },
    prepare({ title }) {
      return {
        title: "AI Configuration",
        subtitle: title?.substring(0, 60) + "...",
      };
    },
  },
});
