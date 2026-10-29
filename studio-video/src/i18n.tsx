import { createContext, useContext, type ReactNode } from "react";

export type FilmLocale = "en" | "pl" | "ua";
const LocaleContext = createContext<FilmLocale>("en");
const copies = {
  en: {
    hook: [
      ["Got", "an", "idea?"],
      ["Let's", "build", "it."],
    ],
    websites: "Websites.",
    apps: "Web apps.",
    connected: ["APIs", "Automation", "AI tools", "All connected."],
    breakdown: ["One developer.", "Direct contact."],
    role: "Full-stack developer",
    finale: ["Let's", "build", "it."],
    services: "Websites · Web apps · Integrations",
    nodes: ["Store", "Data", "Team"],
  },
  pl: {
    hook: [
      ["Masz", "dobry", "pomysł?"],
      ["Zróbmy", "to", "razem."],
    ],
    websites: "Strony.",
    apps: "Aplikacje.",
    connected: ["API", "Automatyzacja", "Narzędzia AI", "Wszystko połączone."],
    breakdown: ["Jeden programista.", "Bez pośredników."],
    role: "Programista full-stack",
    finale: ["Zróbmy", "to", "razem."],
    services: "Strony · Aplikacje · Integracje",
    nodes: ["Sklep", "Dane", "Zespół"],
  },
  ua: {
    hook: [
      ["Маєш", "круту", "ідею?"],
      ["Втілимо", "її", "разом."],
    ],
    websites: "Сайти.",
    apps: "Вебзастосунки.",
    connected: ["API", "Автоматизація", "ШІ-інструменти", "Усе пов’язано."],
    breakdown: ["Один розробник.", "Прямий зв’язок."],
    role: "Full-stack розробник",
    finale: ["Втілимо", "її", "разом."],
    services: "Сайти · Вебзастосунки · Інтеграції",
    nodes: ["Магазин", "Дані", "Команда"],
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

export const useFilmLocale = () => useContext(LocaleContext);
