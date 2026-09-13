import Hero from "../components/Hero/Hero";
import Recruiters from "../components/Recruiter/Recruiters";
import Features from "../components/Features/Features";
import Statistics from "../components/Statistics/Statistics";
import CTASection from "../components/CTA/CTASection";
import Footer from "../components/Footer/Footer";

function Home() {
  return (
    <>
      <Hero />
      <Recruiters />
      <Features />
      <Statistics />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;