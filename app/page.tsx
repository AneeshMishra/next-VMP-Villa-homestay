import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import RoomsSection from "@/components/sections/RoomsSection";
import FacilitiesSection from "@/components/sections/FacilitiesSection";
import EcoStory from "@/components/sections/EcoStory";
import Gallery from "@/components/sections/Gallery";
import LocationSection from "@/components/sections/LocationSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "VMP Villa Home Stay — Agra | Where Agra Feels Like Home",
  description:
    "A peaceful eco-conscious homestay in Agra, just 4.2 km from the Taj Mahal. Book directly and save. 3 room types, home-cooked meals, and heartfelt hospitality.",
};

export default function HomePage() {
  return (
    <>
      <div style={{ marginTop: "calc(var(--nav-h) * -1)" }}>
        <Hero />
      </div>
      <RoomsSection />
      <FacilitiesSection />
      <EcoStory />
      <Gallery />
      <LocationSection />
      <ReviewsSection />
      <FaqSection limit={4} />
      <ContactSection />
    </>
  );
}
