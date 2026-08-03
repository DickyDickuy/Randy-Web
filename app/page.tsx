import Header from '@/components/layout/Header';
import Hero from '@/components/Hero';
import WhoWeAre from '@/components/sections/WhoWeAre';
import BespokeServices from '@/components/sections/BespokeServices';
import AboutCheeseAndPixels from '@/components/sections/AboutCheeseAndPixels';
import CaseStudies from '@/components/sections/CaseStudies';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden relative bg-white">
      <Header />
      <Hero />
      <WhoWeAre />
      <BespokeServices />
      <AboutCheeseAndPixels />
      <CaseStudies />
      <Footer />
    </main>
  );
}
