import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ProjectsGrid from "@/components/ProjectsGrid";
import SkillsViz from "@/components/SkillsViz";
import Timeline from "@/components/Timeline";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">

      <Header />
      <main>
        <Hero />
        <About />
        <ProjectsGrid />
        <SkillsViz />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
