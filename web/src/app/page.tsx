import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SearchRates from "@/components/SearchRates";
import SmokingGun from "@/components/SmokingGun";
import Calculator from "@/components/Calculator";
import USMap from "@/components/USMap";
import StateCards from "@/components/StateCards";
import Trends from "@/components/Trends";
import KnowYourRights from "@/components/KnowYourRights";
import TakeAction from "@/components/TakeAction";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SearchRates />
      <SmokingGun />
      <Calculator />
      <USMap />
      <StateCards />
      <Trends />
      <KnowYourRights />
      <TakeAction />
      <About />
    </>
  );
}
