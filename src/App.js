import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Cpu, ArrowRight, ArrowUpRight, Droplet, 
  ChevronRight, Menu, X, MessageCircle, Send, 
  Phone, Mail, MapPin, CheckCircle, HelpCircle, Activity, 
  Camera, Star, Quote, Plus, Minus, ThermometerSun
} from 'lucide-react';

// --- IMPORT YOUR LOGO HERE ---
import logo from './logo.svg';
import TerraAI from './components/TerraAI';

// ==========================================
// 1. DATA & CONSTANTS
// ==========================================
const NAVIGATION_LINKS = [
  { label: "Identity", href: "#our-identity" },
  { label: "Solutions", href: "#solutions" },
  { label: "Data Intelligence", href: "#intelligence" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "FAQ", href: "#faq" }
];

const FAQ_DATA = [
  {
    question: "What exactly is Biophilic Design?",
    answer: "Biophilic design is a concept used within the building industry to increase occupant connectivity to the natural environment through the use of direct nature, indirect nature, and space and place conditions. We use it to create spaces that actively lower stress and improve cognitive function."
  },
  {
    question: "How does the sensory data collection work?",
    answer: "We deploy non-intrusive, smart ecological sensors in your soil and ambient environment. These monitor moisture, light spectrum, microbiome health, and air quality, transmitting data to our TerraSense dashboard so we can precisely tune your ecosystem."
  },
  {
    question: "Do you only work on large commercial projects?",
    answer: "No. While we handle extensive corporate ecosystems and public spaces, we also design and monitor bespoke residential gardens, balconies, and indoor green spaces. Ecosystems scale, and so do our solutions."
  },
  {
    question: "What happens during the free consultation?",
    answer: "We discuss your current space, your aesthetic preferences, and the specific sensory disconnects you're experiencing. Our experts will then outline a preliminary roadmap for integrating nature-centric design into your daily life."
  }
];

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Tech Executive, Bangalore",
    text: "TerraSense didn't just redesign our office courtyard; they brought it to life. The data-driven approach to plant selection meant our greenery is thriving without constant manual upkeep.",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Homeowner",
    text: "I wanted a space to disconnect from screens. The biophilic layout they created for my balcony is my new sanctuary. The sensory intelligence behind it is brilliant.",
    rating: 5
  },
  {
    name: "Dr. Anil Kumar",
    role: "Wellness Clinic Director",
    text: "Incorporating TerraSense's ecological designs into our waiting rooms visibly reduced patient anxiety. Their understanding of human-nature connectivity is unmatched.",
    rating: 5
  }
];

const PORTFOLIO_IMAGES = [
  { id: 1, category: "Corporate", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, category: "Residential", url: "https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?q=80&w=1932&auto=format&fit=crop" },
  { id: 3, category: "Public", url: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1854&auto=format&fit=crop" },
  { id: 4, category: "Corporate", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" },
  { id: 5, category: "Residential", url: "https://images.unsplash.com/photo-1524431144429-03fdd30ece26?q=80&w=2070&auto=format&fit=crop" },
  { id: 6, category: "Data", url: "https://images.unsplash.com/photo-1592504938644-884b25687a74?q=80&w=2070&auto=format&fit=crop" }
];

const MOCK_SENSOR_DATA = [
  { time: '08:00', moisture: 45, light: 20, health: 85 },
  { time: '10:00', moisture: 42, light: 65, health: 86 },
  { time: '12:00', moisture: 38, light: 90, health: 88 },
  { time: '14:00', moisture: 35, light: 95, health: 87 },
  { time: '16:00', moisture: 30, light: 70, health: 85 },
  { time: '18:00', moisture: 55, light: 30, health: 92 },
  { time: '20:00', moisture: 52, light: 5, health: 94 },
];

// ==========================================
// 2. CUSTOM HOOKS
// ==========================================
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
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return [ref, isVisible];
};

// ==========================================
// 3. SHARED UI COMPONENTS
// ==========================================
const WaveDivider = ({ fill = "#E8DFD0", className = "", position = "bottom" }) => {
  const isTop = position === "top";
  return (
    <div className={`absolute left-0 w-full overflow-hidden leading-none z-10 pointer-events-none ${isTop ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}>
      <svg className="relative block w-full h-[40px] md:h-[90px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,119.5,193.33,109.1,238.16,101.65,283.47,73.5,321.39,56.44Z" fill={fill}></path>
      </svg>
    </div>
  );
};

const FadeInSection = ({ children, className = "", delay = "delay-0", direction = "up" }) => {
  const [ref, isVisible] = useScrollReveal();
  
  const directions = {
    up: 'translate-y-12',
    down: '-translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
    none: 'translate-y-0 translate-x-0 scale-95'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? `opacity-100 translate-y-0 translate-x-0 scale-100 ${delay}` : `opacity-0 ${directions[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading = false, ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    sm: "px-6 py-2.5 text-sm",
    md: "px-8 py-4 text-base hover:-translate-y-1",
    lg: "px-10 py-5 text-lg hover:-translate-y-1"
  };

  const variants = {
    primary: "bg-[#C85A3D] text-white hover:bg-[#a64a32] shadow-lg hover:shadow-xl focus:ring-[#C85A3D]",
    secondary: "bg-[#2C4C3B] text-[#E8DFD0] hover:bg-[#1f362a] shadow-lg hover:shadow-xl focus:ring-[#2C4C3B]",
    outline: "border-2 border-[#2C4C3B] text-[#2C4C3B] hover:bg-[#2C4C3B] hover:text-[#E8DFD0] focus:ring-[#2C4C3B]",
    glass: "bg-[#E8DFD0]/20 text-[#E8DFD0] backdrop-blur-md border border-[#E8DFD0]/30 hover:bg-[#E8DFD0]/30 shadow-lg hover:shadow-xl"
  };

  return (
    <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} disabled={isLoading} {...props}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </button>
  );
};

// ==========================================
// 4. COMPLEX COMPONENTS
// ==========================================

// 4.1 Multi-Step Consultation Modal
const ConsultationModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', spaceType: 'Residential', size: '', message: '' });

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleNext = (e) => { e.preventDefault(); setStep(2); };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      access_key: "7e75877f-8124-441e-8e43-4a1e70c69ba5",
      subject: `New Consultation Request: ${formData.name}`,
      from_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      space_type: formData.spaceType,
      size_sq_ft: formData.size,
      message: formData.message,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStep(3);
        setTimeout(() => {
          onClose();
          setStep(1);
          setFormData({ name: '', email: '', phone: '', spaceType: 'Residential', size: '', message: '' });
        }, 3000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#2C4C3B]/80 backdrop-blur-sm transition-opacity">
      <div className="bg-[#FAF7F2] rounded-[30px] p-8 md:p-10 max-w-xl w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-[#2C4C3B]/5 rounded-full text-[#2C4C3B]/60 hover:text-[#C85A3D] hover:bg-[#C85A3D]/10 transition-all">
          <X size={20} />
        </button>
        
        {step < 3 && (
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-[#C85A3D]' : 'bg-[#2C4C3B]/10'} transition-colors duration-500`}></div>
            <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-[#C85A3D]' : 'bg-[#2C4C3B]/10'} transition-colors duration-500`}></div>
          </div>
        )}

        {step === 1 && (
          <FadeInSection direction="none" className="space-y-6">
            <div>
              <h3 className="text-3xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-2">Let's grow together.</h3>
              <p className="text-[#2C4C3B]/70 text-sm">Step 1: Your Contact Details</p>
            </div>
            <form onSubmit={handleNext} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C4C3B]/70 mb-2">Full Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-white border border-[#2C4C3B]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C85A3D]/50 transition-all text-[#2C4C3B]" placeholder="Jane Doe" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C4C3B]/70 mb-2">Email</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-white border border-[#2C4C3B]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C85A3D]/50 transition-all text-[#2C4C3B]" placeholder="jane@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C4C3B]/70 mb-2 flex items-center gap-1">
                    Phone <span className="text-[#C85A3D]">*</span>
                  </label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-white border border-[#2C4C3B]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C85A3D]/50 transition-all text-[#2C4C3B]" placeholder="+91 98765 43210" />
                </div>
              </div>
              <Button type="submit" variant="primary" className="w-full mt-4 justify-between group">
                Continue to Details <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </FadeInSection>
        )}

        {step === 2 && (
          <FadeInSection direction="none" className="space-y-6">
            <div>
              <h3 className="text-3xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-2">About your space.</h3>
              <p className="text-[#2C4C3B]/70 text-sm">Step 2: Environmental Context</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C4C3B]/70 mb-2">Space Type</label>
                  <select name="spaceType" value={formData.spaceType} onChange={handleChange} className="w-full bg-white border border-[#2C4C3B]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C85A3D]/50 transition-all text-[#2C4C3B]">
                    <option>Residential Garden</option>
                    <option>Balcony / Terrace</option>
                    <option>Corporate Office</option>
                    <option>Public / Community Space</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#2C4C3B]/70 mb-2">Est. Size (sq ft)</label>
                  <input name="size" value={formData.size} onChange={handleChange} type="text" className="w-full bg-white border border-[#2C4C3B]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C85A3D]/50 transition-all text-[#2C4C3B]" placeholder="e.g. 500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#2C4C3B]/70 mb-2">What are your ecological goals?</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="3" className="w-full bg-white border border-[#2C4C3B]/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C85A3D]/50 transition-all text-[#2C4C3B] resize-none" placeholder="Looking to reduce stress, improve air quality, or build a sensory garden..."></textarea>
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="px-6" disabled={isSubmitting}>Back</Button>
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Request Consultation'}
                </Button>
              </div>
            </form>
          </FadeInSection>
        )}

        {step === 3 && (
          <FadeInSection direction="none" className="text-center py-10 space-y-4">
            <div className="w-20 h-20 bg-[#C85A3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-[#C85A3D]" />
            </div>
            <h3 className="text-3xl font-['Playfair_Display',serif] text-[#2C4C3B]">Request Sent!</h3>
            <p className="text-[#2C4C3B]/70 max-w-sm mx-auto">
              Your details have been securely transmitted to our team. We will review your space requirements and be in touch shortly.
            </p>
          </FadeInSection>
        )}
      </div>
    </div>
  );
};

// 4.2 Interactive FAQ Accordion
const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-3xl mx-auto">
      {FAQ_DATA.map((faq, index) => (
        <div key={index} className="mb-4 border border-[#2C4C3B]/10 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-[#C85A3D]/30 shadow-sm">
          <button 
            className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          >
            <span className="font-['Playfair_Display',serif] text-xl text-[#2C4C3B] font-medium pr-8">{faq.question}</span>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-[#C85A3D] text-white' : 'bg-[#FAF7F2] text-[#2C4C3B]'}`}>
              {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
            </div>
          </button>
          <div 
            className={`px-6 overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <p className="text-[#2C4C3B]/70 leading-relaxed border-t border-[#2C4C3B]/5 pt-4">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// 4.3 Ecological Intelligence Dashboard Mockup
const DataDashboard = () => {
  const [activeTab, setActiveTab] = useState('moisture');
  
  const maxVal = 100;
  const chartHeight = 150;
  const chartWidth = 600;
  const stepX = chartWidth / (MOCK_SENSOR_DATA.length - 1);
  
  const points = MOCK_SENSOR_DATA.map((data, i) => {
    const x = i * stepX;
    const y = chartHeight - (data[activeTab] / maxVal) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const getThemeColor = () => {
    if(activeTab === 'moisture') return '#3B82F6';
    if(activeTab === 'light') return '#EAB308';
    return '#22C55E';
  };

  return (
    <div className="bg-white rounded-[30px] p-8 shadow-xl border border-[#2C4C3B]/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-2xl font-['Playfair_Display',serif] text-[#2C4C3B] flex items-center gap-2">
            <Activity className="text-[#C85A3D]" /> Live Ecosystem Telemetry
          </h3>
          <p className="text-[#2C4C3B]/60 text-sm mt-1">Real-time sensory data from a monitored corporate atrium.</p>
        </div>
        
        <div className="flex bg-[#FAF7F2] p-1 rounded-xl">
          {['moisture', 'light', 'health'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white shadow-sm text-[#C85A3D]' : 'text-[#2C4C3B]/60 hover:text-[#2C4C3B]'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[200px] w-full overflow-hidden border-b border-l border-[#2C4C3B]/10 pl-2 pb-2">
        <div className="absolute left-2 top-0 bottom-6 flex flex-col justify-between text-[10px] text-[#2C4C3B]/40 py-2">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        
        <div className="w-full h-full pl-8 pb-6 relative">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full preserve-3d" preserveAspectRatio="none">
            <line x1="0" y1={chartHeight/2} x2={chartWidth} y2={chartHeight/2} stroke="#2C4C3B" strokeOpacity="0.05" strokeDasharray="4 4" />
            <polyline 
              fill="none" 
              stroke={getThemeColor()} 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points} 
              className="animate-[dash_2s_ease-out_forwards]"
              style={{ strokeDasharray: 2000, strokeDashoffset: 0 }}
            />
            {MOCK_SENSOR_DATA.map((data, i) => (
              <circle 
                key={i}
                cx={i * stepX} 
                cy={chartHeight - (data[activeTab] / maxVal) * chartHeight} 
                r="5" 
                fill="white" 
                stroke={getThemeColor()}
                strokeWidth="2"
                className="hover:r-8 transition-all cursor-pointer shadow-lg"
              >
                <title>{`${data[activeTab]}% at ${data.time}`}</title>
              </circle>
            ))}
          </svg>
          
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-[#2C4C3B]/50 px-1">
            {MOCK_SENSOR_DATA.map((d, i) => <span key={i}>{d.time}</span>)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-[#FAF7F2] rounded-xl p-4 text-center">
          <Droplet className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[#2C4C3B]">52%</div>
          <div className="text-[10px] uppercase tracking-wider text-[#2C4C3B]/60">Avg Moisture</div>
        </div>
        <div className="bg-[#FAF7F2] rounded-xl p-4 text-center">
          <ThermometerSun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[#2C4C3B]">75%</div>
          <div className="text-[10px] uppercase tracking-wider text-[#2C4C3B]/60">Light Exposure</div>
        </div>
        <div className="bg-[#FAF7F2] rounded-xl p-4 text-center">
          <Activity className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-[#2C4C3B]">94%</div>
          <div className="text-[10px] uppercase tracking-wider text-[#2C4C3B]/60">Microbiome</div>
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 5. MAIN APPLICATION
// ==========================================
export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
      html { scroll-behavior: smooth; }
      ::-webkit-scrollbar { width: 10px; }
      ::-webkit-scrollbar-track { background: #E8DFD0; }
      ::-webkit-scrollbar-thumb { background: #2C4C3B; border-radius: 5px; }
      ::-webkit-scrollbar-thumb:hover { background: #1a2d23; }
      @keyframes dash { to { stroke-dashoffset: 0; } }
    `;
    document.head.appendChild(style);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#E8DFD0] text-[#2C4C3B] font-['Inter',sans-serif] selection:bg-[#C85A3D] selection:text-white overflow-x-hidden relative">
      
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* THE NEW AI WIDGET IS IMPLEMENTED HERE */}
      <TerraAI/>

      {/* --- 1. NAVIGATION --- */}
      <nav className={`fixed w-full z-[80] transition-all duration-500 ${isScrolled ? 'bg-[#E8DFD0]/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0 mr-4 md:mr-8 whitespace-nowrap" onClick={() => window.scrollTo(0,0)}>
            <img 
              src={logo} 
              alt="TerraSense Logo" 
              className="w-10 h-10 md:w-11 md:h-11 object-contain transform group-hover:scale-105 transition-transform duration-300 shrink-0" 
            />
            <span className="text-xl md:text-[1.65rem] font-bold tracking-tight mt-1 flex items-center">
              <span className="text-[#C85A3D]">Terra</span><span className="text-[#2C4C3B]">Sense</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 bg-white/40 px-8 py-3 rounded-full backdrop-blur-sm border border-white/50">
            {NAVIGATION_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium hover:text-[#C85A3D] transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:block shrink-0 ml-8">
            <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm" className="group">
              <Phone className="w-4 h-4 mr-2 group-hover:animate-pulse" /> 
              Book Call
            </Button>
          </div>

          <button 
            className="lg:hidden text-[#2C4C3B] p-2 bg-white/50 rounded-full backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <div className={`lg:hidden absolute top-full left-0 w-full bg-[#E8DFD0] shadow-2xl transition-all duration-300 origin-top overflow-hidden ${mobileMenuOpen ? 'max-h-[500px] border-t border-[#2C4C3B]/10' : 'max-h-0'}`}>
          <div className="p-6 flex flex-col gap-4">
            {NAVIGATION_LINKS.map((link) => (
              <a key={link.label} onClick={() => setMobileMenuOpen(false)} href={link.href} className="text-lg font-medium border-b border-[#2C4C3B]/10 pb-3 flex justify-between items-center group">
                {link.label}
                <ChevronRight size={18} className="text-[#C85A3D] opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
            <Button onClick={() => { setIsModalOpen(true); setMobileMenuOpen(false); }} variant="primary" className="mt-4 w-full">Free Consultation</Button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="relative h-screen min-h-[700px] max-h-[1000px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-center bg-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop')",
            transform: `translateY(${isScrolled ? '10px' : '0px'})`
          }}
        >
          <div className="absolute inset-0 bg-[#2C4C3B]/50 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C4C3B]/40 via-transparent to-[#2C4C3B]/90 z-10" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-16 md:mt-24">
          <FadeInSection direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
              <span className="w-2 h-2 rounded-full bg-[#C85A3D] animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-[#C85A3D] absolute"></span>
              <p className="uppercase tracking-[0.15em] text-xs font-bold text-white">
                Live Data • Biophilic Design • Ecology
              </p>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-['Playfair_Display',serif] text-white leading-[1.1] mb-8 drop-shadow-xl">
              Energy that grows <br/> <span className="text-[#E8DFD0] italic font-light">with you.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 font-light leading-relaxed drop-shadow-md">
              We translate what plants sense into designs that reconnect people with their ecosystems. An invisible touch, rooted in data, grown with care.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => setIsModalOpen(true)} variant="primary" size="lg" className="w-full sm:w-auto shadow-[0_0_40px_rgba(200,90,61,0.5)] border-2 border-[#C85A3D]">
                Free Consultation <ArrowRight className="ml-3 w-5 h-5" />
              </Button>
              <a href="#solutions" className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-full text-lg font-medium transition-all duration-300 ease-in-out hover:-translate-y-1 bg-white/10 text-white backdrop-blur-md border-2 border-white/30 hover:bg-white/20 shadow-lg">
                View Methodology
              </a>
            </div>
          </FadeInSection>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-bounce opacity-70">
          <span className="text-white text-xs uppercase tracking-widest mb-2 font-medium">Scroll</span>
          <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-[#C85A3D] rounded-full"></div>
          </div>
        </div>

        <WaveDivider fill="#E8DFD0" />
      </section>

      {/* --- 3. BRAND IDENTITY SECTION --- */}
      <section id="our-identity" className="py-24 md:py-32 relative bg-[#E8DFD0] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2C4C3B]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C85A3D]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <FadeInSection direction="right">
              <div className="relative aspect-square max-w-md mx-auto w-full">
                <div className="absolute inset-0 bg-[#C85A3D]/10 rounded-full scale-105 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-0 border border-[#2C4C3B]/10 rounded-full scale-110 border-dashed" />
                
                <div className="relative z-10 w-full h-full flex items-center justify-center border border-white rounded-full bg-white/60 shadow-[0_20px_50px_rgba(44,76,59,0.1)] backdrop-blur-md p-16 group transition-all duration-700 hover:bg-white">
                   <img src={logo} alt="TerraSense Identity Logo" className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-700" />
                </div>
                
                <div className="hidden md:block absolute -left-12 top-1/4 w-32 border-t border-[#2C4C3B] border-dashed">
                  <div className="absolute right-0 -top-1.5 w-3 h-3 rounded-full border-2 border-[#2C4C3B] bg-[#C85A3D] animate-pulse"></div>
                  <div className="absolute -top-7 -left-40 w-48 text-sm">
                    <strong className="text-[#C85A3D] block font-bold">The Human Element</strong>
                    <span className="text-[#2C4C3B]/70">Representing tactile touch & personal identity.</span>
                  </div>
                </div>
                
                <div className="hidden md:block absolute -right-12 top-2/3 w-32 border-t border-[#2C4C3B] border-dashed">
                  <div className="absolute left-0 -top-1.5 w-3 h-3 rounded-full border-2 border-[#2C4C3B] bg-[#1A532C] animate-pulse"></div>
                  <div className="absolute -top-7 -right-44 w-48 text-sm text-right">
                    <strong className="text-[#1A532C] block font-bold">The Biophilic Core</strong>
                    <span className="text-[#2C4C3B]/70">Nature-centric elements to cultivate active care.</span>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="left" delay="delay-200">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-[#C85A3D]"></span>
                <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase">Our Core Identity</h4>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display',serif] text-[#2C4C3B] leading-[1.15] mb-6">
                The human element meets the biophilic core.
              </h2>
              <p className="text-lg text-[#2C4C3B]/80 mb-6 leading-relaxed font-light">
                The TerraSense mark physically merges human identity with botanical life — a fingerprint fused with a leaf. It summarizes our entire mandate in a single, scalable icon.
              </p>
              <p className="text-lg text-[#2C4C3B]/80 mb-10 leading-relaxed font-light">
                We represent tactile touch, personal identity, and the exact sensory connection lost to modern technology — restored through nature-centric data and meticulous architectural design.
              </p>
              
              <div className="grid grid-cols-2 gap-8 p-6 bg-white/50 rounded-2xl border border-white mb-10">
                <div className="flex gap-4 items-start">
                  <MapPin className="w-6 h-6 text-[#C85A3D] shrink-0 mt-1" />
                  <div>
                    <h5 className="text-xs text-[#2C4C3B]/60 uppercase tracking-wider mb-1 font-bold">Headquarters</h5>
                    <p className="font-medium text-[#2C4C3B]">Bengaluru, India</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <Activity className="w-6 h-6 text-[#C85A3D] shrink-0 mt-1" />
                  <div>
                    <h5 className="text-xs text-[#2C4C3B]/60 uppercase tracking-wider mb-1 font-bold">Approach</h5>
                    <p className="font-medium text-[#2C4C3B]">Field-first, Data-driven</p>
                  </div>
                </div>
              </div>
              
              <Button onClick={() => setIsModalOpen(true)} variant="primary" className="group shadow-xl">
                Start Your Project <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* --- 4. PROBLEM/SOLUTION STATEMENT --- */}
      <section className="py-24 bg-[#FAF7F2] relative">
        <WaveDivider fill="#FAF7F2" position="top" className="-mt-[50px] md:-mt-[89px] z-10" />
        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <FadeInSection direction="up">
              <h2 className="text-3xl md:text-5xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-6 leading-tight">
                Defining the Modern Deficit <br className="hidden md:block"/> and the Biophilic Response
              </h2>
              <p className="text-lg text-[#2C4C3B]/70 leading-relaxed">
                As urban environments become increasingly synthetic, the biological necessity for nature is ignored, leading to measurable decreases in well-being and productivity.
              </p>
            </FadeInSection>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
            <FadeInSection direction="up" delay="delay-100" className="h-full">
              <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-md border border-[#2C4C3B]/5 h-full relative overflow-hidden group hover:shadow-xl transition-shadow duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full transition-transform group-hover:scale-125 duration-700 ease-out"></div>
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-8 text-gray-500 relative z-10">
                  <Cpu size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4 relative z-10">The Environmental Problem</h3>
                <p className="text-[#2C4C3B]/70 leading-relaxed mb-4 relative z-10 text-lg">
                  Tech reliance has replaced human intuition, creating a severe tactile sensory disconnect from nature. 
                </p>
                <p className="text-[#2C4C3B]/70 leading-relaxed relative z-10 text-lg">
                  Current technology-rich interfaces offer severely limited opportunities to reconnect with core ecological values, leaving spaces sterile and residents fatigued.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection direction="up" delay="delay-200" className="h-full">
              <div className="bg-[#2C4C3B] text-[#E8DFD0] p-10 md:p-12 rounded-[2.5rem] shadow-2xl h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#C85A3D]/20 rounded-bl-full transition-transform group-hover:scale-125 duration-700 ease-out"></div>
                <div className="w-16 h-16 bg-[#C85A3D] rounded-2xl flex items-center justify-center mb-8 text-white relative z-10 shadow-lg shadow-[#C85A3D]/30">
                  <Leaf size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-['Playfair_Display',serif] text-white mb-4 relative z-10">The Biophilic Approach</h3>
                <p className="text-[#E8DFD0]/90 leading-relaxed mb-4 relative z-10 text-lg">
                  Integrating nature and data-driven design to actively improve sensory well-being and cognitive performance.
                </p>
                <p className="text-[#E8DFD0]/90 leading-relaxed relative z-10 text-lg">
                  The goal is to reconnect human life through nature-centric elements, shifting the focus to eco-aware plant enthusiasts and addressing sustainable, measurable ecological concerns.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
        <WaveDivider fill="#E8DFD0" />
      </section>

      {/* --- 5. SOLUTIONS & PILLARS --- */}
      <section id="solutions" className="py-24 md:py-32 bg-[#E8DFD0]">
        <div className="container mx-auto px-6 md:px-12 text-center mb-20">
          <FadeInSection direction="up">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-12 bg-[#C85A3D]"></span>
              <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase">Methodology</h4>
              <span className="h-px w-12 bg-[#C85A3D]"></span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display',serif] text-[#2C4C3B] leading-tight max-w-3xl mx-auto">
              Three pillars of ecological reconnection.
            </h2>
          </FadeInSection>
        </div>

        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            
            <FadeInSection direction="up" delay="delay-100">
              <div className="bg-[#FAF7F2] rounded-[2.5rem] rounded-tr-[5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-white">
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?q=80&w=1932&auto=format&fit=crop" alt="Garden setup" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute bottom-6 left-6 z-20">
                     <span className="bg-[#C85A3D] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md">Sensory</span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex-grow flex flex-col items-start text-left bg-white relative z-20 -mt-2 rounded-t-3xl">
                  <h3 className="text-3xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">Plant Sensory Data</h3>
                  <p className="text-[#2C4C3B]/70 leading-relaxed mb-8 flex-grow text-lg font-light">
                    Field-curated sensory readings from living gardens — soil samples, microbiome cultures, and ecological baselines that tell the story of a place.
                  </p>
                  <button onClick={() => setIsModalOpen(true)} className="text-[#C85A3D] font-bold tracking-wide flex items-center group-hover:text-[#2C4C3B] transition-colors mt-auto group/btn">
                    Request Assessment <ChevronRight size={18} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="up" delay="delay-200">
              <div className="bg-[#FAF7F2] rounded-[2.5rem] rounded-tr-[5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-white mt-0 md:mt-12">
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Biophilic design space" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute bottom-6 left-6 z-20">
                     <span className="bg-[#2C4C3B] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md">Design</span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex-grow flex flex-col items-start text-left bg-white relative z-20 -mt-2 rounded-t-3xl">
                  <h3 className="text-3xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">Biophilic Design</h3>
                  <p className="text-[#2C4C3B]/70 leading-relaxed mb-8 flex-grow text-lg font-light">
                    Integrating nature and design to actively improve sensory well-being — reconnecting spaces with ecological rhythms and living systems.
                  </p>
                  <button onClick={() => setIsModalOpen(true)} className="text-[#2C4C3B] font-bold tracking-wide flex items-center group-hover:text-[#C85A3D] transition-colors mt-auto group/btn">
                    Consult Designers <ChevronRight size={18} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection direction="up" delay="delay-300">
              <div className="bg-[#FAF7F2] rounded-[2.5rem] rounded-tr-[5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border border-white mt-0 md:mt-24">
                <div className="h-72 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1854&auto=format&fit=crop" alt="Botanical intelligence" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute bottom-6 left-6 z-20">
                     <span className="bg-[#E2A64E] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md">Intelligence</span>
                  </div>
                </div>
                <div className="p-8 md:p-10 flex-grow flex flex-col items-start text-left bg-white relative z-20 -mt-2 rounded-t-3xl">
                  <h3 className="text-3xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">Ecological Intelligence</h3>
                  <p className="text-[#2C4C3B]/70 leading-relaxed mb-8 flex-grow text-lg font-light">
                    Data-driven insights from living ecosystems — translating complex plant signals into actionable ecological knowledge for design and planning.
                  </p>
                  <a href="#intelligence" className="text-[#a3702a] font-bold tracking-wide flex items-center hover:text-[#2C4C3B] transition-colors mt-auto group/btn">
                    View Data Models <ChevronRight size={18} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* --- 6. ECOLOGICAL DASHBOARD --- */}
      <section id="intelligence" className="py-24 md:py-32 bg-[#2C4C3B] text-white relative">
        <WaveDivider fill="#2C4C3B" position="top" className="-mt-[50px] md:-mt-[99px]" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 mt-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInSection direction="right">
              <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4">Proprietary Tech</h4>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display',serif] mb-6 leading-tight">
                Listening to the <br className="hidden md:block"/> invisible ecosystem.
              </h2>
              <p className="text-lg text-white/80 mb-6 font-light leading-relaxed">
                Biophilic design is more than aesthetics; it is a living system. We don't just plant greenery and leave. We deploy discrete ecological sensors that monitor the microscopic health of your environment.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="text-[#C85A3D] w-5 h-5 shrink-0" /> Real-time soil microbiome tracking
                </li>
                <li className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="text-[#C85A3D] w-5 h-5 shrink-0" /> Ambient light and humidity balancing
                </li>
                <li className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="text-[#C85A3D] w-5 h-5 shrink-0" /> Air quality and oxygen output metrics
                </li>
              </ul>
              <Button onClick={() => setIsModalOpen(true)} variant="primary" className="bg-[#E8DFD0] text-[#2C4C3B] hover:bg-white border-none">
                Integrate Our Tech
              </Button>
            </FadeInSection>
            
            <FadeInSection direction="left" delay="delay-200">
              <DataDashboard />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* --- 7. PORTFOLIO / GALLERY --- */}
      <section id="portfolio" className="py-24 md:py-32 bg-[#FAF7F2]">
        <div className="container mx-auto px-6 md:px-12">
          <FadeInSection direction="up" className="text-center mb-16">
            <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4">Our Work</h4>
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-6">Spaces we've awakened.</h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_IMAGES.map((img, idx) => (
              <FadeInSection key={img.id} direction="up" delay={`delay-${(idx % 3) * 100}`}>
                <div className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500">
                  <img src={img.url} alt={`TerraSense project ${img.id}`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-4 border border-white/30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-[#2C4C3B] text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-sm">
                      {img.category}
                    </span>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" className="border-[#2C4C3B]/20">View Full Gallery</Button>
          </div>
        </div>
      </section>

      {/* --- 8. TESTIMONIALS --- */}
      <section className="py-24 md:py-32 bg-[#E8DFD0] relative overflow-hidden">
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-[800px] h-[800px]">
          <img src={logo} alt="Background" className="w-full h-full object-contain" />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeInSection direction="up" className="text-center mb-16">
            <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4">Client Impact</h4>
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display',serif] text-[#2C4C3B]">Life, re-rooted.</h2>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, idx) => (
              <FadeInSection key={idx} direction="up" delay={`delay-${idx * 100}`}>
                <div className="bg-white rounded-3xl p-8 shadow-lg relative h-full flex flex-col border border-white hover:border-[#C85A3D]/20 transition-colors">
                  <Quote className="text-[#E8DFD0] w-12 h-12 absolute top-6 right-6 opacity-50" />
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C85A3D] text-[#C85A3D]" />
                    ))}
                  </div>
                  <p className="text-[#2C4C3B]/80 italic mb-8 flex-grow text-lg">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-[#2C4C3B]/10">
                    <div className="w-12 h-12 rounded-full bg-[#E8DFD0] flex items-center justify-center font-['Playfair_Display',serif] text-xl text-[#2C4C3B] font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2C4C3B]">{testimonial.name}</h4>
                      <p className="text-xs text-[#2C4C3B]/60 uppercase tracking-wider">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* --- 9. FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-[#FAF7F2]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <FadeInSection direction="up">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display',serif] text-[#2C4C3B] mb-4">
                Curious Minds
              </h2>
              <p className="text-[#2C4C3B]/60 max-w-2xl mx-auto">Everything you need to know about integrating nature and ecological intelligence into your personal or professional space.</p>
            </FadeInSection>
          </div>
          <FadeInSection direction="up" delay="delay-100">
            <FAQAccordion />
          </FadeInSection>
          <div className="text-center mt-12 text-[#2C4C3B]/70">
            <p>Still have questions? <span onClick={() => setIsModalOpen(true)} className="text-[#C85A3D] font-bold cursor-pointer hover:underline">Book a Call</span></p>
          </div>
        </div>
      </section>

      {/* --- 10. STATS SECTION --- */}
      <section className="bg-[#C85A3D] text-[#E8DFD0] py-24 md:py-32 relative z-10">
        <WaveDivider fill="#E8DFD0" position="top" className="-mt-[50px] md:-mt-[89px]" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-[#E8DFD0]/30">
            <FadeInSection delay="delay-100" direction="up">
              <div className="py-6 md:py-0 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display',serif] mb-2 font-bold text-white group-hover:scale-110 transition-transform duration-500">12+</div>
                <div className="text-lg font-medium tracking-wide uppercase text-white/80">Garden Data<br/>Projects</div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay="delay-200" direction="up">
              <div className="py-6 md:py-0 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display',serif] mb-2 font-bold text-white group-hover:scale-110 transition-transform duration-500">40+</div>
                <div className="text-lg font-medium tracking-wide uppercase text-white/80">Plant Species<br/>Monitored</div>
              </div>
            </FadeInSection>
            
            <FadeInSection delay="delay-300" direction="up">
              <div className="py-6 md:py-0 group">
                <div className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display',serif] mb-2 font-bold text-white group-hover:scale-110 transition-transform duration-500">100%</div>
                <div className="text-lg font-medium tracking-wide uppercase text-white/80">Nature Centric<br/>Approach</div>
              </div>
            </FadeInSection>
          </div>
        </div>
        
        <WaveDivider fill="#2C4C3B" position="bottom" className="-mb-1" />
      </section>

      {/* --- 11. CTA / FOOTER --- */}
      <footer className="bg-[#2C4C3B] text-[#E8DFD0] relative pt-32 pb-12 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[#C85A3D]/10 blur-[100px] pointer-events-none"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 mb-24 items-center bg-white/5 p-10 md:p-16 rounded-[40px] border border-white/10 backdrop-blur-sm">
            <FadeInSection direction="right">
              <h4 className="text-[#C85A3D] font-bold tracking-widest text-sm uppercase mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-[#C85A3D]"></span> Begin your journey
              </h4>
              <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] mb-6 leading-[1.1] text-white">
                Ready to reconnect <br/>with your ecosystem?
              </h2>
              <p className="text-lg text-[#E8DFD0]/70 mb-0 max-w-md font-light leading-relaxed">
                Our team of ecologists and biophilic designers will create a bespoke sensory plan for your garden or space — at no cost to you.
              </p>
            </FadeInSection>
            
            <FadeInSection direction="left" delay="delay-200" className="lg:text-right">
              <div className="bg-[#FAF7F2] rounded-[30px] p-8 md:p-10 inline-block text-left text-[#2C4C3B] shadow-2xl transform hover:-translate-y-2 transition-transform duration-500 border border-white w-full max-w-md">
                 <h3 className="text-2xl font-['Playfair_Display',serif] mb-2 text-[#2C4C3B]">Start a conversation</h3>
                 <p className="text-[#2C4C3B]/60 mb-8 text-sm">No commitment. Just a dialogue about improving the sensory health of your space.</p>
                 <Button onClick={() => setIsModalOpen(true)} variant="primary" className="w-full justify-between group shadow-xl hover:shadow-[#C85A3D]/30">
                   Book Free Consultation 
                   <span className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                   </span>
                 </Button>
                 <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#2C4C3B]/50 font-medium">
                   <Mail className="w-3 h-3" /> or email directly at <a href="mailto:info@terrasense.in" className="text-[#C85A3D] hover:underline">info@terrasense.in</a>
                 </div>
              </div>
            </FadeInSection>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-12 border-t border-[#E8DFD0]/10">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6 shrink-0 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                <img 
                  src={logo} 
                  alt="TerraSense Footer Logo" 
                  className="w-10 h-10 object-contain brightness-0 invert opacity-90 hover:opacity-100 hover:rotate-12 transition-all" 
                />
                <span className="text-2xl font-bold tracking-tight text-white">
                  TerraSense
                </span>
              </div>
              <p className="text-sm text-[#E8DFD0]/60 max-w-xs leading-relaxed font-light mb-6">
                Rooted in data. Grown with care.<br/>
                Restoring the exact sensory connection lost to modern technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C85A3D] hover:text-white transition-all text-white/60">IN</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C85A3D] hover:text-white transition-all text-white/60">TW</a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C85A3D] hover:text-white transition-all text-white/60">IG</a>
              </div>
            </div>
            
            <div className="col-span-1">
              <h5 className="font-bold tracking-wider text-xs uppercase mb-6 text-white">Explore</h5>
              <ul className="space-y-4 text-sm text-[#E8DFD0]/70">
                <li><a href="#solutions" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">Solutions</a></li>
                <li><a href="#portfolio" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">Gallery</a></li>
                <li><a href="#intelligence" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">Data Model</a></li>
                <li><a href="#our-identity" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">About Us</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h5 className="font-bold tracking-wider text-xs uppercase mb-6 text-white">Legal</h5>
              <ul className="space-y-4 text-sm text-[#E8DFD0]/70">
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#C85A3D] transition-colors inline-block hover:translate-x-1">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h5 className="font-bold tracking-wider text-xs uppercase mb-6 text-white">Connect</h5>
              <ul className="space-y-4 text-sm text-[#E8DFD0]/70">
                <li><span onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 hover:text-[#C85A3D] transition-colors cursor-pointer group"><HelpCircle className="w-4 h-4 group-hover:scale-110 transition-transform"/> Consultation</span></li>
                <li><a href="mailto:info@terrasense.in" className="flex items-center gap-2 hover:text-[#C85A3D] transition-colors cursor-pointer group"><Mail className="w-4 h-4 group-hover:scale-110 transition-transform"/> Email Us</a></li>
                <li><span className="flex items-center gap-2 hover:text-[#C85A3D] transition-colors cursor-pointer group"><MapPin className="w-4 h-4 group-hover:scale-110 transition-transform"/> Bengaluru, IN</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#E8DFD0]/40 mt-8 border-t border-white/5">
            <p>© {new Date().getFullYear()} TerraSense. All rights reserved. Designed for the ecosystem.</p>
            <p className="mt-4 md:mt-0 flex items-center gap-1">Rooted in data. Grown with <Leaf className="w-3 h-3 text-[#C85A3D]" /></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
