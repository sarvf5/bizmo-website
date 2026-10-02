import SmoothScroll from "@/components/SmoothScroll";
import Reveal from "@/components/Reveal";
import LocalNav from "@/components/ed/LocalNav";
import Hero from "@/components/ed/Hero";
import Highlights from "@/components/ed/Highlights";
import Manifesto from "@/components/ed/Manifesto";
import InsideFilm from "@/components/ed/InsideFilm";
import AppsBento from "@/components/ed/AppsBento";
import SpeedEd from "@/components/ed/SpeedEd";
import Security from "@/components/ed/Security";
import Closeups from "@/components/ed/Closeups";
import TechSpecs from "@/components/ed/TechSpecs";
import TrustEd from "@/components/ed/TrustEd";
import CompareEd from "@/components/ed/CompareEd";
import Who from "@/components/ed/Who";
import NotifyEd from "@/components/ed/NotifyEd";
import FooterEd from "@/components/ed/FooterEd";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Reveal />
      <LocalNav />
      <main id="main">
        <Hero />
        <Highlights />
        <Manifesto />
        <InsideFilm />
        <AppsBento />
        <SpeedEd />
        <Security />
        <Closeups />
        <TechSpecs />
        <TrustEd />
        <CompareEd />
        <Who />
        <NotifyEd />
      </main>
      <FooterEd />
    </>
  );
}
