import Hero from "@/components/Hero";
import NoiseBackground from "@/components/NoiseBackground";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import CinematicTransition from "@/components/CinematicTransition";
import StorytellingSection from "@/components/StorytellingSection";

export default function Home() {
  return (
    <main className="relative bg-[#070a07]">
      <LoadingScreen />
      <CustomCursor />
      <NoiseBackground />
      <Hero />
      <CinematicTransition />
      <StorytellingSection />
    </main>
  );
}
