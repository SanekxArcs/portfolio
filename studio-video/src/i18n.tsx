import { createContext, useContext, type ReactNode } from "react";

export type FilmLocale = "en" | "pl";
const LocaleContext = createContext<FilmLocale>("en");
const copies = {
  en: {
    header: ["WEB STUDIO", "INDEPENDENT WEB DEVELOPMENT"],
    opening: {
      label: "YOUR NEXT PROJECT",
      lead: "Need a",
      first: "website?",
      second: "web app?",
      support: "For your business. For your team.",
    },
    websites: {
      label: "WEBSITES",
      wide: ["A clear first impression."],
      portrait: ["A clear first", "impression."],
      support: "Design + development + mobile",
    },
    applications: {
      label: "WEB APPS & TOOLS",
      wide: ["Built around your work."],
      portrait: ["Built around", "your work."],
      support: "Your customers. Your team. Your workflow.",
      erm: "ERM / RESOURCE MANAGEMENT",
      buddy: "WORK BUDDY / TIME TRACKING",
    },
    connections: {
      label: "INTEGRATIONS",
      wide: ["Less busywork."],
      portrait: ["Less busywork."],
      support: "Connect the tools you already use.",
      nodes: ["YOUR STORE", "YOUR DATA", "YOUR TEAM"],
      terms: ["APIs", "Automation", "AI tools"],
    },
    personal: {
      label: "WORK DIRECTLY WITH ME",
      title: ["One developer.", "Direct contact."],
      size: [115, 141],
      roles: ["FULL-STACK DEVELOPER", "SOLUTIONS ENGINEER"],
    },
    closing: {
      label: "LET'S TALK",
      title: ["Tell me what", "you're building."],
      services: "WEBSITES · WEB APPS · INTEGRATIONS",
    },
  },
  pl: {
    header: ["STUDIO WWW", "NIEZALEŻNE STUDIO WEBOWE"],
    opening: {
      label: "TWÓJ NOWY PROJEKT",
      lead: "Potrzebujesz",
      first: "strony?",
      second: "aplikacji?",
      support: "Dla Twojej firmy. Dla Twojego zespołu.",
    },
    websites: {
      label: "STRONY INTERNETOWE",
      wide: ["Dobre pierwsze wrażenie."],
      portrait: ["Dobre pierwsze", "wrażenie."],
      support: "Projekt + kod + wersja mobilna",
    },
    applications: {
      label: "APLIKACJE I NARZĘDZIA",
      wide: ["Narzędzia do Twojej pracy."],
      portrait: ["Narzędzia", "do Twojej pracy."],
      support: "Dla klientów. Dla zespołu. Na co dzień.",
      erm: "ERM / ZARZĄDZANIE ZASOBAMI",
      buddy: "WORK BUDDY / POMIAR CZASU",
    },
    connections: {
      label: "INTEGRACJE",
      wide: ["Mniej ręcznej pracy."],
      portrait: ["Mniej ręcznej", "pracy."],
      support: "Połącz narzędzia, z których już korzystasz.",
      nodes: ["TWÓJ SKLEP", "TWOJE DANE", "TWÓJ ZESPÓŁ"],
      terms: ["API", "Automatyzacja", "Narzędzia AI"],
    },
    personal: {
      label: "PRACUJESZ BEZPOŚREDNIO ZE MNĄ",
      title: ["Jeden programista.", "Bez pośredników."],
      size: [96, 104],
      roles: ["PROGRAMISTA FULL-STACK", "SOLUTIONS ENGINEER"],
    },
    closing: {
      label: "POROZMAWIAJMY",
      title: ["Opowiedz mi", "o projekcie."],
      services: "STRONY · APLIKACJE · INTEGRACJE",
    },
  },
};

export const FilmLanguage = ({
  locale,
  children,
}: {
  locale: FilmLocale;
  children: ReactNode;
}) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);
export const useFilmCopy = () => copies[useContext(LocaleContext)];
