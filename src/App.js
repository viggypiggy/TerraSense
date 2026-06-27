import React, { useState, useEffect, useRef } from 'react';
import { Leaf, Cpu, ArrowRight, ArrowUpRight, Droplet, Sun, Wind, ChevronRight, Menu, X } from 'lucide-react';

// --- IMPORT YOUR UPLOADED SVG LOGO HERE ---
import logo from './logo.svg';

// --- CUSTOM HOOKS ---
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// --- BRAND ASSETS ---
const WaveDivider = ({ fill = "#E8DFD0", className = "", position = "bottom" }) => {
  const isTop = position === "top";
  return (
    <div className={`absolute left-0 w-full overflow-hidden leading-none ${isTop ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}>
      <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,119.5,193.33,109.1,238.16,101.65,283.47,73.5,321.39,56.44Z" fill={fill}></path>
      </svg>
    </div>
  );
};

// --- SHARED COMPONENTS ---
const FadeInSection = ({ children, className = "", delay = "delay-0" }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? `opacity-100 translate-y-0 ${delay}` : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-300 ease-in-out hover:-translate-y-1";
  const variants = {
    primary: "bg-[#C85A3D] text-white hover:bg-[#a64a32] shadow-lg hover:shadow-xl",
    secondary: "bg-[#2C4C3B] text-[#E8DFD0] hover:bg-[#1f362a] shadow-lg hover:shadow-xl",
    outline: "border-2 border-[#2C4C3B] text-[#2C4C3B] hover:bg-[#2C4C3B] hover:text-[#E8DFD0]",
    ghost: "text-[#2C4C3B] hover:text-[#C85A3D] bg-transparent"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Inject Google Font for that "Editorial Serif" look
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ["Our Identity", "Solutions", "Approach", "Projects"];

  return (
    <div className="min-h-screen bg-[#E8DFD0] text-[#2C4C3B] font-['Inter',sans-serif] selection:bg-[#C85A3D] selection:text-white overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-[#E8DFD0]/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* 1. NAVIGATION LOGO */}
            <img 
              src={logo} 
              alt="TerraSense Logo" 
              className="w-10 h-10 object-contain transform group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-[1.65rem] font-bold tracking-tight mt-1 hidden sm:block">
              <span className="text-[#C85A3D]">Terra</span><span className="text-[#2C4C3B]">Sense</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-medium hover:text-[#C85A3D] transition-colors">
                {link}
              </a>
            ))}
            <Button variant="primary" className="!py-2.5 !px-6 text-sm">Free consultation</Button>
          </div>

          <button className="md:hidden text-[#2C4C3B]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#E8DFD0] border-t border-[#2C4C3B]/10 shadow-lg p-6 flex flex-col gap-4 md:hidden">
            {navLinks.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-lg font-medium border-b border-[#2C4C3B]/10 pb-2">
                {link}
              </a>
            ))}
            <Button variant="primary" className="mt-4 w-full">Free consultation</Button>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#2C4C3B]/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2C4C3B]/80 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop" 
            alt="Botanical aesthetic with dark green leaves" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto mt-20">
          <FadeInSection>
            <p className="uppercase tracking-[0.2em] text-sm text-[#E8DFD0] font-medium mb-6">
              Plant Sensory Data • Biophilic Design • Ecological Intelligence
            </p>
            <h1 className="text-5xl md:text-7xl font-['Playfair_Display',serif] text-white leading-tight mb-8 drop-shadow-lg">
              Energy that grows <br/> <span className="text-[#E8DFD0] italic">with you.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed drop-shadow">
              We translate what plants sense into designs that reconnect people with their ecosystems. An invisible touch, rooted in data, grown with care.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" className="w-full sm:w-auto shadow-[0_0_40px_rgba(200,90,61,0.4)]">
                Free consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="secondary" className="w-full sm:w-auto bg-[#E8DFD0]/20 backdrop-blur-md border border-[#E8DFD0]/30 hover:bg-[#E8DFD0]/30">
                Our solutions
              </Button>
            </div>
          </FadeInSection>
        </div>
        <WaveDivider fill="#E8DFD0" />
      </section>

      {/* --- BRAND IDENTITY SECTION --- */}
      <section id="our-identity" className="py-24 md:py-32 relative bg-[#E8DFD0]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-[#C85A3D]/5 rounded-full scale-110" />
                <div className="relative z-10 w-full h-full flex items-center justify-center border border-[#2C4C3B]/10 rounded-full bg-white/40 shadow-xl backdrop-blur-sm p-16 group">
                   
                   {/* 2. IDENTITY SECTION LOGO */}
                   <img 
                    src={logo} 
                    alt="TerraSense Identity Logo" 
                    className="w-full h-full object-contain drop-shadow-lg transform group-hover:scale-105 transition-transform duration-700" 
                   />

                </div>
                
                {/* Connecting Line Annotations (Desktop Only) */}
                <div className="hidden md:block absolute -left-20 top-1/4 w-32 border-t border-[#2C4C3B] border-dashed">
                  <div className="absolute -top-6 -left-32 w-48 text-sm">
                    <strong className="text-[#C85A3D] block">The Human Element</strong>
                    Represents tactile touch & personal identity.
                  </div>
                  <div className="absolute right-0 -top-1.5 w-3 h-3 rounded-full border-2 border-[#2C4C3B] bg-[#E8DFD0]"></div>
                </div>
                
                <div className="hidden md:block absolute -right-20 top-2/3 w-32 border-t border-[#2C4C3B] border-dashed">
                  <div className="absolute left-0 -top-1.5 w-3 h-3 rounded-full border-2 border-[#2C4C3B] bg-[#E8DFD0]"></div>
                  <div className="absolute -top-6 -right-36 w-48 text-sm text-right">
                    <strong className="text-[#C85A3D] block">The Biophilic Core</strong>
                    Nature-centric elements to cultivate active care.
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay="delay-200">
              <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4">Our Identity</h4>
              <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] text-[#2C4C3B] leading-tight mb-6">
                The human element meets the biophilic core.
              </h2>
              <p className="text-lg text-[#2C4C3B]/80 mb-6 leading-relaxed">
                The TerraSense mark physically merges human identity with botanical life — a fingerprint fused with a leaf. It summarizes our entire mandate in a single, scalable icon.
              </p>
              <p className="text-lg text-[#2C4C3B]/80 mb-8 leading-relaxed">
                We represent tactile touch, personal identity, and the exact sensory connection lost to modern technology — restored through nature-centric data and design.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#2C4C3B]/20">
                <div>
                  <h5 className="text-xs text-[#2C4C3B]/60 uppercase tracking-wider mb-2">Founded</h5>
                  <p className="font-medium text-[#C85A3D]">Bangalore,<br/>India</p>
                </div>
                <div>
                  <h5 className="text-xs text-[#2C4C3B]/60 uppercase tracking-wider mb-2">Approach</h5>
                  <p className="font-medium text-[#C85A3D]">Field-first,<br/>data-driven</p>
                </div>
              </div>
              <Button variant="primary" className="mt-10">Our story <ArrowUpRight className="ml-2 w-4 h-4" /></Button>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* --- THE PROBLEM VS SOLUTION SECTION --- */}
      <section id="approach" className="py-24 bg-[#FAF7F2] relative">
        <WaveDivider fill="#FAF7F2" position="top" className="-mt-[50px] md:-mt-[99px] z-10" />
        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="text-center mb-16">
            <FadeInSection>
              <h2 className="text-3xl md:text-5xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">
                Defining the Modern Deficit <br/> and the Biophilic Response
              </h2>
            </FadeInSection>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* The Problem */}
            <FadeInSection delay="delay-100">
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-[#2C4C3B]/5 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2C4C3B]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="w-16 h-16 bg-[#2C4C3B]/10 rounded-2xl flex items-center justify-center mb-8 text-[#2C4C3B]">
                  <Cpu size={32} />
                </div>
                <h3 className="text-2xl font-['Playfair_Display',serif] mb-4">The Environmental Problem</h3>
                <p className="text-[#2C4C3B]/70 leading-relaxed mb-4">
                  Tech reliance has replaced human intuition, creating a severe tactile sensory disconnect from nature. 
                </p>
                <p className="text-[#2C4C3B]/70 leading-relaxed">
                  Current technology-rich interfaces offer severely limited opportunities to reconnect with core values.
                </p>
              </div>
            </FadeInSection>

            {/* The Solution */}
            <FadeInSection delay="delay-200">
              <div className="bg-[#2C4C3B] text-[#E8DFD0] p-10 rounded-2xl shadow-xl h-full relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#C85A3D]/20 rounded-tl-full -mr-10 -mb-10 transition-transform group-hover:scale-110"></div>
                <div className="w-16 h-16 bg-[#C85A3D] rounded-2xl flex items-center justify-center mb-8 text-white">
                  <Leaf size={32} />
                </div>
                <h3 className="text-2xl font-['Playfair_Display',serif] mb-4">The Biophilic Approach</h3>
                <p className="text-[#E8DFD0]/80 leading-relaxed mb-4">
                  Integrating nature and design to actively improve sensory well-being.
                </p>
                <p className="text-[#E8DFD0]/80 leading-relaxed">
                  The goal is to reconnect human life through nature-centric elements, shifting the focus to eco-aware plant enthusiasts and addressing sustainable ecological concerns.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
        <WaveDivider fill="#E8DFD0" />
      </section>

      {/* --- THREE PILLARS (SOLUTIONS) --- */}
      <section id="solutions" className="py-24 md:py-32 bg-[#E8DFD0]">
        <div className="container mx-auto px-6 md:px-12 text-center mb-16">
          <FadeInSection>
            <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4">What we do</h4>
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display',serif] text-[#2C4C3B]">
              Three pillars of <br/> ecological reconnection.
            </h2>
          </FadeInSection>
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <FadeInSection delay="delay-100">
              <div className="bg-[#FAF7F2] rounded-[40px] rounded-t-[100px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-white">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?q=80&w=1932&auto=format&fit=crop" 
                    alt="Garden setup" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-[#FAF7F2]">
                      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,119.5,193.33,109.1,238.16,101.65,283.47,73.5,321.39,56.44Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col items-start text-left">
                  <span className="bg-[#C85A3D]/20 text-[#C85A3D] text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-6">Sensory</span>
                  <h3 className="text-2xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">Plant Sensory Data</h3>
                  <p className="text-[#2C4C3B]/70 leading-relaxed mb-8 flex-grow">
                    Field-curated sensory readings from living gardens — soil samples, microbiome cultures, and ecological baselines that tell the story of a place.
                  </p>
                  <a href="#" className="text-[#C85A3D] font-semibold flex items-center group-hover:text-[#2C4C3B] transition-colors mt-auto">
                    Learn more <ChevronRight size={18} className="ml-1" />
                  </a>
                </div>
              </div>
            </FadeInSection>

            {/* Pillar 2 */}
            <FadeInSection delay="delay-200">
              <div className="bg-[#FAF7F2] rounded-[40px] rounded-t-[100px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-white mt-0 md:mt-12">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                    alt="Biophilic design space" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-[#FAF7F2]">
                      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,119.5,193.33,109.1,238.16,101.65,283.47,73.5,321.39,56.44Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col items-start text-left">
                  <span className="bg-[#2C4C3B]/20 text-[#2C4C3B] text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-6">Design</span>
                  <h3 className="text-2xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">Biophilic Design</h3>
                  <p className="text-[#2C4C3B]/70 leading-relaxed mb-8 flex-grow">
                    Integrating nature and design to actively improve sensory well-being — reconnecting spaces with ecological rhythms and living systems.
                  </p>
                  <a href="#" className="text-[#2C4C3B] font-semibold flex items-center group-hover:text-[#C85A3D] transition-colors mt-auto">
                    Learn more <ChevronRight size={18} className="ml-1" />
                  </a>
                </div>
              </div>
            </FadeInSection>

            {/* Pillar 3 */}
            <FadeInSection delay="delay-300">
              <div className="bg-[#FAF7F2] rounded-[40px] rounded-t-[100px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-white mt-0 md:mt-24">
                <div className="h-64 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-transparent transition-colors"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1854&auto=format&fit=crop" 
                    alt="Botanical intelligence" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 w-full z-20 translate-y-1">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 fill-[#FAF7F2]">
                      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,119.5,193.33,109.1,238.16,101.65,283.47,73.5,321.39,56.44Z"></path>
                    </svg>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col items-start text-left">
                  <span className="bg-[#E2A64E]/20 text-[#a3702a] text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-6">Intelligence</span>
                  <h3 className="text-2xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">Ecological Intelligence</h3>
                  <p className="text-[#2C4C3B]/70 leading-relaxed mb-8 flex-grow">
                    Data-driven insights from living ecosystems — translating complex plant signals into actionable ecological knowledge for design and planning.
                  </p>
                  <a href="#" className="text-[#a3702a] font-semibold flex items-center group-hover:text-[#2C4C3B] transition-colors mt-auto">
                    Learn more <ChevronRight size={18} className="ml-1" />
                  </a>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-[#C85A3D] text-[#E8DFD0] py-24 md:py-32 relative">
        <WaveDivider fill="#E8DFD0" position="top" className="-mt-[50px] md:-mt-[99px]" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-[#E8DFD0]/30">
            <FadeInSection delay="delay-100">
              <div className="py-6 md:py-0">
                <div className="text-6xl md:text-7xl font-['Playfair_Display',serif] mb-2 font-bold text-white">12+</div>
                <div className="text-lg font-medium tracking-wide uppercase">Garden Data<br/>Projects</div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay="delay-200">
              <div className="py-6 md:py-0">
                <div className="text-6xl md:text-7xl font-['Playfair_Display',serif] mb-2 font-bold text-white">40+</div>
                <div className="text-lg font-medium tracking-wide uppercase">Plant Species<br/>Monitored</div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay="delay-300">
              <div className="py-6 md:py-0">
                <div className="text-6xl md:text-7xl font-['Playfair_Display',serif] mb-2 font-bold text-white">100%</div>
                <div className="text-lg font-medium tracking-wide uppercase">Nature Centric<br/>Approach</div>
              </div>
            </FadeInSection>
          </div>
        </div>
        
        <WaveDivider fill="#E8DFD0" position="bottom" />
      </section>

      {/* --- CTA / FOOTER --- */}
      <footer className="bg-[#2C4C3B] text-[#E8DFD0] relative pt-32 pb-12">
        <WaveDivider fill="#2C4C3B" position="top" className="-mt-[50px] md:-mt-[99px]" />
        
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 mb-24 items-center">
            <FadeInSection>
              <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4">Begin your journey</h4>
              <h2 className="text-5xl md:text-6xl font-['Playfair_Display',serif] mb-6 leading-tight text-white">
                Ready to reconnect <br/>with your ecosystem?
              </h2>
              <p className="text-lg text-[#E8DFD0]/70 mb-10 max-w-md">
                Our team of ecologists and biophilic designers will create a bespoke sensory plan for your garden or space — at no cost to you.
              </p>
            </FadeInSection>
            
            <FadeInSection delay="delay-200" className="md:text-right">
              <div className="bg-[#E8DFD0] rounded-[40px] p-8 md:p-12 inline-block text-left text-[#2C4C3B] shadow-2xl transform hover:-translate-y-2 transition-transform duration-500">
                 <h3 className="text-2xl font-['Playfair_Display',serif] mb-2">Start a conversation</h3>
                 <p className="text-[#2C4C3B]/70 mb-8 text-sm">No commitment. Just a dialogue about your space.</p>
                 <Button variant="primary" className="w-full justify-between group">
                   Get a free consultation 
                   <span className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                   </span>
                 </Button>
              </div>
            </FadeInSection>
          </div>

          <div className="grid md:grid-cols-4 gap-12 py-12 border-t border-[#E8DFD0]/10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                
                {/* 3. FOOTER LOGO */}
                {/* Notice the `brightness-0 invert` classes here - they turn your SVG white automatically so it looks good on the dark green background! */}
                <img 
                  src={logo} 
                  alt="TerraSense Footer Logo" 
                  className="w-10 h-10 object-contain brightness-0 invert opacity-90" 
                />
                
                <span className="text-2xl font-bold tracking-tight text-white">
                  TerraSense
                </span>
              </div>
              <p className="text-sm text-[#E8DFD0]/60 max-w-sm">
                Rooted in data. Grown with care.<br/>
                Restoring the exact sensory connection lost to modern technology.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold tracking-wider text-xs uppercase mb-6 text-white">Explore</h5>
              <ul className="space-y-4 text-sm text-[#E8DFD0]/70">
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors">Gallery</a></li>
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors">About</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold tracking-wider text-xs uppercase mb-6 text-white">Connect</h5>
              <ul className="space-y-4 text-sm text-[#E8DFD0]/70">
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors">Contact us</a></li>
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors">Free consultation</a></li>
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors">Data Curation Log</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#E8DFD0]/40 mt-8">
            <p>© {new Date().getFullYear()} TerraSense. All rights reserved. Rooted in data.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
