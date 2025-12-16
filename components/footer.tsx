import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <p className="text-muted-foreground text-sm max-w-md">
            Building digital experiences with passion and precision.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {currentYear}</span>
            <span>•</span>
            <span>Built by</span>
            <Link
              href="https://github.com/SanekxArcs"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-emerald-600 transition-colors"
            >
              Sanekx Arcs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
