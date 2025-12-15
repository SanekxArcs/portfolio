"use client";

import {
  Mail,
  Github,
  Linkedin,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Map,
  Banknote,
  BadgeCheck,
  Facebook,
  Send,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CvProfile } from "@/components/cv/types";
import Image from "next/image";
import { ActionButton } from "@/components/cv/atoms/action-button";
import { ButtonGroup } from "@/components/ui/button-group";
import FlagIcon from "@/components/FlagIcon";

type Props = {
  profile: CvProfile;
};

export function MainHead({ profile }: Props) {
  const githubLink = profile.links?.find(
    (link) =>
      link.iconName === "Github" || link.title?.toLowerCase().includes("github")
  );
  const linkedinLink = profile.links?.find(
    (link) =>
      link.iconName === "Linkedin" ||
      link.title?.toLowerCase().includes("linkedin")
  );
  const facebookLink = profile.links?.find(
    (link) =>
      link.iconName === "Facebook" ||
      link.title?.toLowerCase().includes("facebook")
  );
  const telegramLink = profile.links?.find(
    (link) =>
      link.iconName === "Telegram" ||
      link.title?.toLowerCase().includes("telegram")
  );
  const whatsappLink = profile.links?.find(
    (link) =>
      link.iconName === "Whatsapp" ||
      link.title?.toLowerCase().includes("whatsapp")
  );

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <section
      className={`mb-20 mt-15 pt-10 cursor-default transition-all duration-1000 `}
    >
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 md:w-2/3">
          <div className="inline-block mb-4">
            <Badge
              variant="secondary"
              className="text-sm p-2.5 font-medium animate-pulse bg-emerald-950/80"
            >
              <BadgeCheck className="text-emerald-600 mr-1" />
              {profile.contacts?.workAvailability &&
              Array.isArray(profile.contacts.workAvailability) &&
              profile.contacts.workAvailability.length > 0
                ? profile.contacts.workAvailability[0] === "Immediately"
                  ? "Available for opportunities"
                  : profile.contacts.workAvailability[0]
                : "Available for opportunities"}
            </Badge>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-linear-to-r from-foreground to-primary dark:from-foreground dark:to-emerald-950 bg-clip-text text-transparent leading-tight">
            {profile.name}
          </h1>
          <p className="text-2xl sm:text-3xl text-muted-foreground mb-6 font-light">
            {profile.role}
          </p>
          {profile.description && (
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              {profile.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mb-8">
            <ButtonGroup>
              {profile.cvFileUrl && (
                <ActionButton
                  href={profile.cvFileUrl}
                  icon={<Download />}
                  label="Save CV"
                  className="rounded-r-none"
                  download
                  external
                />
              )}
              {profile.cvUrl && (
                <ActionButton
                  href={profile.cvUrl}
                  icon={<ExternalLink />}
                  label="View CV"
                  className="rounded-l-none"
                  external
                />
              )}
            </ButtonGroup>
            <ButtonGroup>
              {profile.contacts?.email && (
                <ActionButton
                  href={`mailto:${profile.contacts?.email}`}
                  icon={<Mail />}
                  label={profile.contacts.email}
                  variant="outline"
                  className="rounded-r-none text-muted-foreground"
                />
              )}
              {profile.contacts?.phoneNumber && (
                <ActionButton
                  href={`tel:${profile.contacts.phoneNumber}`}
                  icon={<Phone />}
                  label={profile.contacts.phoneNumber}
                  variant="outline"
                  className="rounded-l-none text-muted-foreground"
                />
              )}
            </ButtonGroup>
          </div>
          <div className="flex flex-row flex-wrap gap-3 mb-6">
            {githubLink && (
              <ActionButton
                href={githubLink.link}
                icon={<Github />}
                label="GitHub"
                variant="outline"
                className="text-muted-foreground"
                external
              />
            )}
            {linkedinLink && (
              <ActionButton
                href={linkedinLink.link}
                icon={<Linkedin />}
                label="LinkedIn"
                variant="outline"
                className="text-muted-foreground"
                external
              />
            )}
            {facebookLink && (
              <ActionButton
                href={facebookLink.link}
                icon={<Facebook />}
                label="Facebook"
                variant="outline"
                className="text-muted-foreground"
                external
              />
            )}
            {telegramLink && (
              <ActionButton
                href={telegramLink.link}
                icon={<Send />}
                label="Telegram"
                variant="outline"
                className="text-muted-foreground"
                external
              />
            )}
            {whatsappLink && (
              <ActionButton
                href={whatsappLink.link}
                icon={<MessageCircle />}
                label="WhatsApp"
                variant="outline"
                className="text-muted-foreground"
                external
              />
            )}
          </div>

          {profile.languages && profile.languages.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-4">
              {profile.languages.map((lang, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-xs bg-background/50 gap-1.5 pl-1.5"
                >
                  <FlagIcon languageCode={lang.language} />
                  <span>
                    {lang.language}
                    {lang.level && (
                      <span className="text-muted-foreground ml-1">
                        - {lang.level}
                      </span>
                    )}
                  </span>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-row flex-wrap gap-2 mb-4">
            {profile.contacts?.location && (
              <ActionButton
                href="https://www.google.pl/maps?q=Warszawa"
                icon={<MapPin />}
                label={profile.contacts.location}
                variant="link"
                size="sm"
                className="text-muted-foreground"
              />
            )}
            {typeof profile.contacts?.relocationReady === "boolean" && (
              <ActionButton
                icon={<Map className="w-4 h-4" />}
                href="https://www.google.com/maps"
                size="sm"
                variant="link"
                label={
                  profile.contacts.relocationReady
                    ? "Ready for relocation"
                    : "Not ready for relocation"
                }
                className="flex items-center gap-2 text-muted-foreground"
              />
            )}
            {profile.contacts?.typeOfContract && (
              <ActionButton
                href="https://www.google.com/search?sca_esv=abeb4f522ce11e62&rlz=1C1GCEA_enPL1169PL1169&sxsrf=AE3TifPNNaVsgDOm_XURono7CbK3wAkWZg:1765816565495&q=B2B+umowa&sa=X&ved=2ahUKEwjezP-og8CRAxUwIxAIHfjhPOoQ1QJ6BAhuEAE&biw=1718&bih=1270&dpr=1"
                variant="link"
                size="sm"
                icon={<Banknote className="w-4 h-4" />}
                label={
                  Array.isArray(profile.contacts.typeOfContract)
                    ? profile.contacts.typeOfContract.join(", ")
                    : profile.contacts.typeOfContract
                }
                className="flex items-center gap-2 text-muted-foreground"
              />
            )}
          </div>
        </div>

        <div className="relative group w-1/3 m-auto lg:mx-0">
          <div className="w-64 h-64 rounded-2xl bg-linear-to-br from-secondary to-muted dark:from-primary dark:to-secondary overflow-hidden shadow-2xl transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 relative flex justify-center items-center">
            {profile.profilePhotoUrl ? (
              <Image
                src={profile.profilePhotoUrl}
                alt={profile.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="cursor-default absolute inset-0 flex items-center justify-center text-8xl font-bold text-primary/30">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
