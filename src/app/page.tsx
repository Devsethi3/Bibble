"use client";

import React, { JSX } from "react";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  DownloadCloud,
  Users,
  Video,
  Shield,
  Loader2,
  ChevronRight,
  Zap,
  Lock,
  Globe,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { GiClover } from "react-icons/gi";

const DecorativeShape = ({
  className,
  type = "circle",
  delay = "0",
}: {
  className: string;
  type?: "circle" | "hexagon" | "triangle" | "star";
  delay?: string;
}) => {
  const shapes: Record<
    "circle" | "hexagon" | "triangle" | "star",
    JSX.Element
  > = {
    circle: (
      <circle
        cx="50"
        cy="50"
        r="40"
        className={`animate-pulse [animation-delay:${delay}ms]`}
      />
    ),
    hexagon: (
      <path
        d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30 Z"
        className={`animate-pulse [animation-delay:${delay}ms]`}
      />
    ),
    triangle: (
      <path
        d="M50 10 L90 90 L10 90 Z"
        className={`animate-pulse [animation-delay:${delay}ms]`}
      />
    ),
    star: (
      <path
        d="M50 0 L61 35H97L68 57L79 91L50 70L21 91L32 57L3 35H39Z"
        className={`animate-pulse [animation-delay:${delay}ms]`}
      />
    ),
  };

  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full fill-primary/10">
        {shapes[type]}
      </svg>
    </div>
  );
};

const WavePattern = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 overflow-hidden">
    <div
      className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] 
      dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] 
      [background-size:16px_16px] 
      [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_70%,transparent_100%)]
      animate-subtle-drift"
    />
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 dark:from-primary/10 dark:to-primary/10 animate-gradient-shift" />
  </div>
);

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <WavePattern />

      <DecorativeShape
        className="top-40 left-0 w-72 h-72 blur-3xl"
        type="circle"
        delay="0"
      />
      <DecorativeShape
        className="top-20 right-0 w-96 h-96 blur-3xl"
        type="hexagon"
        delay="200"
      />
      <DecorativeShape
        className="bottom-40 left-20 w-64 h-64 blur-3xl"
        type="star"
        delay="400"
      />

      <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <GiClover className="h-6 w-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Bibble
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Testimonials", "Integrations", "Pricing"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-sm font-medium transition-colors hover:text-primary group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            {!isLoaded ? (
              <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
            ) : isSignedIn ? (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-[34px] w-[34px]",
                    userButtonPopoverFooter: "hidden",
                  },
                }}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in">
                  <Button variant="ghost" className="font-medium">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative pt-32 pb-20 px-4 md:pt-40 md:pb-32">
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 text-sm border border-primary/20 py-1 px-4 rounded-full 
        bg-primary/5 dark:bg-primary/10 text-primary animate-fade-in"
            >
              <Zap className="h-4 w-4 animate-pulse" />
              Revolutionizing Team Collaboration
            </span>
          </div>

          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl tracking-tight leading-tight mb-6">
            <span className="block bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Empower Your Team real
            </span>
            <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent mt-2">
              Time Features
            </span>
          </h1>

          <p className="mt-6 md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience the future of team communication with crystal-clear video
            calls, secure messaging, and powerful collaboration tools.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Button
              size="lg"
              className="text-white shadow-lg shadow-primary/25 dark:shadow-primary/15 hover:scale-105 transition-all group"
            >
              <DownloadCloud className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
              Download for windows
            </Button>
            <Link href="/get-started">
              <Button
                variant="secondary"
                size="lg"
                className=" shadow-lg lg:w-fit w-full hover:scale-105 transition-all group"
              >
                Open in Browser
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <section id="features" className="py-20 bg-muted/50 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Powerful Features for Modern Teams
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "Crystal Clear Video",
                description:
                  "Experience unparalleled HD video quality with up to 25 participants. Perfect for team meetings, webinars, and virtual events.",
              },
              {
                icon: Lock,
                title: "Bank-Grade Security",
                description:
                  "Your privacy is our priority. Benefit from end-to-end encryption, two-factor authentication, and advanced threat protection.",
              },
              {
                icon: Globe,
                title: "Global Infrastructure",
                description:
                  "Connect from anywhere with our globally distributed network, ensuring low-latency and high-availability communication.",
              },
              {
                icon: MessageSquare,
                title: "Smart Messaging",
                description:
                  "Rich text formatting, file sharing, and thread organization make conversations more productive and organized.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Create unlimited channels, share screens, and collaborate in real-time with integrated tools and plugins.",
              },
              {
                icon: Shield,
                title: "Advanced Controls",
                description:
                  "Comprehensive admin tools, usage analytics, and custom policies give you complete control over your workspace.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="p-6 group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50"
              >
                <feature.icon className="h-12 w-12 mb-4 text-primary transition-transform group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
