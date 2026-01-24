import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FooterSection from "@/components/FooterSection";

// deploy-test

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FooterSection />
      </div>
    </div>
  );
}