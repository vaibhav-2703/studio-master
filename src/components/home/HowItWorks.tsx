
const steps = [
    {
      number: "01",
      title: "Enter your URL",
      description: "Paste the long URL you want to shorten into the input field.",
    },
    {
      number: "02",
      title: "Customize your link",
      description: "Hit the shorten button. Add a custom name or alias if you want.",
    },
    {
      number: "03",
      title: "Share and monitor",
      description: "Use your new short link anywhere. Check click stats in your dashboard.",
    },
  ];

export function HowItWorks() {
    return (
        <section className="py-12 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold">How it works</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Three simple steps to create and share your short links.
                    </p>
                </div>
                <div className="mt-12 grid gap-12 md:grid-cols-3 relative">
                    {/* Dashed line connector for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-16">
                        <svg width="100%" height="100%"><line x1="0" y1="50%" x2="100%" y2="50%" strokeWidth="2" stroke="hsl(var(--border))" strokeDasharray="8, 8"/></svg>
                    </div>

                    {steps.map((step, index) => (
                        <div key={index} className="text-center relative bg-background p-4 z-10">
                            <div className="relative inline-block mb-4">
                                <div className="text-8xl font-bold text-primary/10">{step.number}</div>
                            </div>
                            <h3 className="text-xl font-semibold mt-2">{step.title}</h3>
                            <p className="text-muted-foreground mt-2">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
