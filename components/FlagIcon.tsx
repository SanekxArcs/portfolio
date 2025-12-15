import React from "react";

interface FlagIconProps {
  languageCode: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ languageCode }) => {
  switch (languageCode.toLowerCase()) {
    case "english":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 75 50"
          className="size-5 rounded-sm"
        >
          <rect width="75" height="50" fill="#012169" />
          <path d="M0,0 L75,50 M75,0 L0,50" stroke="#FFF" strokeWidth="5" />
          <path
            d="M0,0 L75,50 M75,0 L0,50"
            stroke="#C8102E"
            strokeWidth="3"
            strokeDasharray="25,25"
          />
          <path d="M0,25 H75 M37.5,0 V50" stroke="#FFF" strokeWidth="15" />
          <path d="M0,25 H75 M37.5,0 V50" stroke="#C8102E" strokeWidth="9" />
        </svg>
      );
    case "ukrainian":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          className="size-5 rounded-full"
        >
          <rect width="1200" height="800" fill="#0057B7" />
          <rect width="1200" height="400" y="400" fill="#FFD700" />
        </svg>
      );
    case "polish":
    case "poland":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 8 5"
          className="size-5 rounded-full"
        >
          <rect width="8" height="5" fill="#fff" />
          <rect width="8" height="2.5" y="2.5" fill="#dc143c" />
        </svg>
      );
    case "german":
    case "deutsch":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 5 3"
          className="size-5 rounded-full"
        >
          <rect width="5" height="3" fill="#000" />
          <rect width="5" height="2" y="1" fill="#D00" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      );
    default:
      return null;
  }
};

export default FlagIcon;
