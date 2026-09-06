export function Cta() {
  return (
    <section id="cta" className="group relative cursor-default overflow-hidden py-24">
      <div className="absolute inset-0 origin-bottom-right -skew-y-3 transform bg-emerald-950/5 transition-transform duration-700 group-hover:skew-y-0 dark:bg-emerald-950/20" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h2 className="from-primary dark:from-primary bg-linear-to-r bg-clip-text py-2 text-4xl font-bold tracking-tight text-transparent md:text-5xl dark:to-emerald-950">
            Ready to start your next project?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl leading-relaxed">
            I&apos;m currently available for freelance work and open to full-time opportunities. If
            you&apos;re interested in working together, let&apos;s have a chat.
          </p>
        </div>
      </div>
    </section>
  )
}
