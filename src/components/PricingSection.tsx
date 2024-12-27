import { ArrowRight, Sparkles } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const PricingSection = () => {
  return (
    <div>
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple Pricing
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                features: [
                  "Unlimited text messages",
                  "10 group channels",
                  "720p video calls",
                  "Basic support",
                ],
              },
              {
                name: "Pro",
                price: "$9.99",
                features: [
                  "Everything in Free",
                  "Unlimited channels",
                  "1080p video calls",
                  "Priority support",
                  "Custom emojis",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Everything in Pro",
                  "4K video calls",
                  "24/7 support",
                  "API access",
                  "Custom branding",
                ],
              },
            ].map((plan, index) => (
              <Card
                key={index}
                className={`p-6 ${
                  plan.popular ? "border-primary relative" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 -translate-x-1/2">
                    <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                      Popular
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingSection;
