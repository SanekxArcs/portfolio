import Link from "next/link";

export function Rodo() {
  return (
    <div className="container mx-auto my-10 grid gap-2 px-4">
      <p className="text-muted-foreground select-all text-xs">
        EN: I consent to the processing of my personal data as part of the recruitment process for the position I have applied for.
        I consent to the processing of my personal data contained in this application for the purpose of future recruitment by the company
        to which I have applied.
      </p>
      <Link
        href="https://nofluffjobs.com/pl/log/praca-w-it/cv/klauzula-cv-2023-aktualna-wersja-niezbedna-przy-rekrutacjach/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <p className="text-muted-foreground select-all text-xs">
          PL: Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji (zgodnie z ustawą
          z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu
          Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO).
        </p>
      </Link>
    </div>
  )
}
