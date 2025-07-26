import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedDiv } from "@/components/shared/AnimatedDiv";

const teamMembers = [
  { name: "Alice Johnson", role: "Lead Developer", image: "https://placehold.co/100x100.png" },
  { name: "Bob Williams", role: "UI/UX Designer", image: "https://placehold.co/100x100.png" },
  { name: "Charlie Brown", role: "AI Specialist", image: "https://placehold.co/100x100.png" },
  { name: "Diana Prince", role: "Marketing Lead", image: "https://placehold.co/100x100.png" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
        <section className="container mx-auto px-4 pt-16 pb-12 sm:pt-24 sm:pb-20 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">About SnipURL</h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                We believe in the power of simple, powerful tools to make a big impact. SnipURL was born from the idea that link shortening should be more than just a utility—it should be an intelligent, secure, and insightful experience.
            </p>
        </section>
        </AnimatedDiv>

        {/* Mission Section with 3D Enhancement */}
        <AnimatedDiv
             initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
        >
        <section className="bg-muted/40 py-12 sm:py-20">
            <div className="container mx-auto px-4">
                {/* 3D Interactive Section */}
                <div className="mb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Experience SnipURL
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            Interact with our 3D representation of link transformation
                        </p>
                    </div>
                    
                    {/* Interactive Visual */}
                    <div className="relative max-w-4xl mx-auto">
                        <div className="aspect-video rounded-2xl overflow-hidden border border-border/50 bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-32 h-32 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center mx-auto">
                                    <span className="text-4xl font-bold text-primary">SU</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-foreground">SnipURL</h3>
                                    <p className="text-muted-foreground">Modern URL Shortening</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Overlay Info */}
                        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                            <p className="text-sm text-muted-foreground">
                                ✨ Clean & Modern Design • Built with Next.js
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mission Content */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">Our Mission</h3>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Our mission is to provide the most advanced, secure, and user-friendly link management platform on the web. We leverage cutting-edge technology to not only shorten URLs but to protect our users from malicious content and provide actionable insights through intuitive analytics.
                        </p>
                        
                        {/* Feature highlights */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-muted-foreground">Advanced security scanning</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-muted-foreground">Real-time analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <span className="text-muted-foreground">Custom branded links</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                         <img
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop&crop=faces"
                            alt="Technology and innovation"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
        </AnimatedDiv>

        {/* Team Section */}
        <AnimatedDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
        >
        <section className="py-12 sm:py-20">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Meet the Team</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    The passionate minds behind SnipURL, dedicated to improving your digital experience.
                </p>
                <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {teamMembers.map((member, index) => (
                        <Card key={index} className="text-center bg-card/60 backdrop-blur-lg border-border/30">
                            <CardContent className="pt-6">
                                <Avatar className="h-24 w-24 mx-auto mb-4">
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback>{member.name.substring(0, 1)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-lg font-semibold">{member.name}</h3>
                                <p className="text-primary">{member.role}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        </AnimatedDiv>
      </main>
      <Footer />
    </div>
  );
}
