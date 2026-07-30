import Header from '@/components/layout/Header';
import Hero from '@/components/Hero';
import WhoWeAre from '@/components/sections/WhoWeAre';
import BespokeServices from '@/components/sections/BespokeServices';
import AboutCheeseAndPixels from '@/components/sections/AboutCheeseAndPixels';
import MeetTheTeam from '@/components/sections/MeetTheTeam';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden relative bg-white">
      <Header />
      <Hero />
      <WhoWeAre />
      <BespokeServices />
      <AboutCheeseAndPixels />
      <MeetTheTeam />
      <ContactSection />
    </main>
  );
}
