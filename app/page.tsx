import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Rail from "@/components/Rail";
import Reveal from "@/components/Reveal";
import Intro from "@/components/Intro";
import { DetailFilm, DeviceFilm, TrustFilm } from "@/components/film/films";
import Apps from "@/components/sections/Apps";
import Speed from "@/components/sections/Speed";
import HomeScreen from "@/components/sections/HomeScreen";
import SpecSheet from "@/components/sections/SpecSheet";
import Compare from "@/components/sections/Compare";
import Audience from "@/components/sections/Audience";
import Notify from "@/components/sections/Notify";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Intro />
      <SmoothScroll />
      <Reveal />
      <Cursor />
      <div aria-hidden="true" className="grain" />
      <Nav />
      <Rail />
      <main id="main">
        <DeviceFilm />
        <Apps />
        <Speed />
        <HomeScreen />
        <DetailFilm />
        <SpecSheet />
        <TrustFilm />
        <Compare />
        <Audience />
        <Notify />
      </main>
      <Footer />
    </>
  );
}
