"use client";

import * as React from "react";
import { AtSign, Banknote, Contact2, Map, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/cv/button-link";
import { SectionWrapper } from "@/components/cv/section-wrapper";
import type { CvContacts } from "@/components/cv/types";

type Props = {
  contacts?: CvContacts;
  cvUrl?: string;
  cvFileUrl?: string;
};

export function Contacts({ contacts }: Props) {
  if (!contacts) return null;

  return (
    <div id="contacts">
      <SectionWrapper
        icon={<Contact2 className="mr-2" />}
        title="Contacts"
        separator={false}
      >
        <div className="flex flex-col items-start justify-start gap-1">
          {contacts.email ? (
            <ButtonLink
              variant="ghost"
              size="sm"
              href={`mailto:${contacts.email}?subject=Hello%20world!&body=Hello!`}
              title="Email for work"
            >
              <AtSign className="mr-2" />
              {contacts.email}
            </ButtonLink>
          ) : null}

          {contacts.phoneNumber ? (
            <ButtonLink
              variant="ghost"
              size="sm"
              href={`tel:${contacts.phoneNumber}`}
              title="Phone number"
            >
              <Phone className="mr-2" />
              {contacts.phoneNumber}
            </ButtonLink>
          ) : null}

          {contacts.location ? (
            <Button variant="ghost" size="sm">
              <p className="flex cursor-default select-none" title="Location">
                <MapPin className="mr-2" />
                {contacts.location}
              </p>
            </Button>
          ) : null}

          {typeof contacts.relocationReady === "boolean" ? (
            <Button variant="ghost" size="sm">
              <p
                className="flex cursor-default select-none"
                title="Relocation preference"
              >
                <Map className="mr-2" />
                {contacts.relocationReady
                  ? "Ready for relocation"
                  : "Not ready for relocation"}
              </p>
            </Button>
          ) : null}

          {contacts.typeOfContract ? (
            <Button variant="ghost" size="sm">
              <p
                className="flex cursor-default select-none"
                title="Contract type"
              >
                <Banknote className="mr-2" />
                {Array.isArray(contacts.typeOfContract)
                  ? contacts.typeOfContract.join(", ")
                  : contacts.typeOfContract}
              </p>
            </Button>
          ) : null}
        </div>
      </SectionWrapper>
    </div>
  );
}
