import React, { useEffect } from "react";
import Header from "./Component/Homepage/Header";
import Hero from "./Component/Homepage/Hero";
import Menu from "./Component/Homepage/Menu";
import Footer from "./Component/Homepage/Footer";

export default function HomePage() {
  useEffect(() => {
    console.log("ENTERED HOME PAGE");
  }, []);
  return (
    <div>
      <Header />
      <Hero />
      <Menu />
      <Footer />
    </div>
  );
}
