import React from 'react';
import FlagIcon from './FlagIcon';

interface LanguageProps {
  language: {
    name: string;
    level: string;
    progress: number;
  };
}

const Language: React.FC<LanguageProps> = ({ language }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <FlagIcon languageCode={language.name} />
        <span className="text-sm font-medium">{language.name}</span>
        <span className="text-xs text-muted-foreground">{language.level}</span>
      </div>
    </div>
  );
};

export default Language;
