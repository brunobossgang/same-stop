import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SearchRates from "@/components/SearchRates";
import SmokingGun from "@/components/SmokingGun";
import StateCards from "@/components/StateCards";
import Trends from "@/components/Trends";
import TakeAction from "@/components/TakeAction";
import About from "@/components/About";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SearchRates />
      <SmokingGun />
      <StateCards />
      <Trends />
      <TakeAction />
      <About />
    </>
  );
}
