
const steps = [
    {
      number: "01",
      title: "Paste your URL",
      description: "Enter the long URL you want to shorten into the input field on our homepage.",
    },
    {
      number: "02",
      title: "Create your link",
      description: "Click the shorten button. You can also give your link an optional name for easier tracking.",
    },
    {
      number: "03",
      title: "Share and Track",
      description: "Share your new short link or its QR code. Track its performance on your personal dashboard.",
    },
  ];

export function HowItWorks() {
    return (
        <section className="py-12 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold">Get Started in Seconds</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Creating and sharing a short link is as easy as 1, 2, 3.
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
