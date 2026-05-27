import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Code,
  ShoppingBag,
  Layout,
  Database,
  Smartphone,
  Wrench,
  Check,
  ShieldCheck,
  Cpu,
  Briefcase,
  Compass,
  Network,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const WebDevelopment = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const servicePillars = [
    {
      title: "Business Website Development",
      description: "Professional websites designed to build credibility, improve user experience, and support business growth.",
      icon: <Layout className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Corporate Websites",
        "Service Websites",
        "Portfolio Websites",
        "Landing Pages"
      ]
    },
    {
      title: "E-Commerce Development",
      description: "Sell products online through secure and user-friendly e-commerce platforms.",
      icon: <ShoppingBag className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Online Stores",
        "Payment Integration",
        "Product Management",
        "Mobile Optimization"
      ]
    },
    {
      title: "Custom Web Applications",
      description: "Custom-built web applications designed for operations, management, and workflow automation.",
      icon: <Code className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Admin Dashboards",
        "Booking Systems",
        "Customer Portals",
        "Internal Platforms"
      ]
    },
    {
      title: "CRM & Business Tools",
      description: "Build custom CRM systems and digital tools that help manage leads, customers, teams, and operations more efficiently.",
      icon: <Database className="w-6 h-6 text-purple-400" />,
      subItems: [
        "CRM Development",
        "Lead Management Systems",
        "Workflow Automation",
        "Data Management Tools"
      ]
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform mobile applications built for customer engagement, operations, and digital services.",
      icon: <Smartphone className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Android Apps",
        "iOS Apps",
        "Hybrid Applications",
        "App UI/UX Design"
      ]
    },
    {
      title: "Website Maintenance & Support",
      description: "Ongoing updates, monitoring, and technical support to keep your platforms running smoothly.",
      icon: <Wrench className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Website Updates",
        "Security Monitoring",
        "Performance Optimization",
        "Technical Support"
      ]
    }
  ];

  const valueProps = [
    {
      title: "Build Stronger Credibility",
      description: "A professional website helps customers trust your business and understand your services faster.",
      icon: <ShieldCheck className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Improve Customer Experience",
      description: "Modern websites and apps make it easier for users to discover, interact with, and purchase from your business.",
      icon: <Compass className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Streamline Operations",
      description: "Custom dashboards, CRM systems, and automation tools help businesses save time and improve efficiency.",
      icon: <Cpu className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Stay Accessible Online",
      description: "Your business stays visible and accessible to customers across devices and platforms.",
      icon: <Network className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Support Long-Term Growth",
      description: "Scalable digital systems make it easier to expand services, manage operations, and grow sustainably.",
      icon: <Briefcase className="w-6 h-6 text-purple-400" />
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We understand your business goals, audience, and platform requirements before development begins."
    },
    {
      step: "02",
      title: "UI/UX Design",
      description: "We create clean, user-focused interfaces designed for usability and performance."
    },
    {
      step: "03",
      title: "Development",
      description: "Our team develops responsive websites, applications, and systems optimized for speed and scalability."
    },
    {
      step: "04",
      title: "Testing & Optimization",
      description: "Every project is tested for functionality, responsiveness, security, and user experience."
    },
    {
      step: "05",
      title: "Launch & Support",
      description: "We help deploy, monitor, and maintain your platform after launch."
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-kaki-black text-white">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden flex items-center justify-center min-h-[75vh]">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-black via-purple-950/20 to-kaki-black z-0" />
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl z-0" />

        <div className="container-custom relative z-10 text-center max-w-4xl pt-10">
          <div className="fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.25em] px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 inline-block mb-6">
              Engineering & Web Tech
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Web Development Services in Nagaland
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-10 leading-relaxed">
              Build modern websites, web applications, and digital tools designed to help your business grow, operate efficiently, and stay competitive online.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
                <Link to="/contact">
                  <span>Start Your Project</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Overview Section */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 fade-in-on-scroll">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Core Technology</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Professional Web Development Services
              </h2>
            </div>
            <div className="lg:col-span-7 fade-in-on-scroll animation-delay-200">
              <p className="text-lg text-purple-300 font-medium mb-6">
                Whether you need a company website, booking platform, internal dashboard, or custom business tool, our solutions are built around real business goals.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                We focus on performance, usability, and long-term scalability — so your digital presence works as hard as you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pillars */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Capabilities</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Full-Stack Digital Solutions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicePillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/30 flex flex-col justify-between fade-in-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div>
                  <div className="mb-6 p-4 inline-block bg-purple-500/10 text-purple-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-kaki-grey text-sm leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <div className="w-full h-[1px] bg-white/5 my-6" />

                  <ul className="space-y-3 text-sm text-kaki-grey">
                    {pillar.subItems.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="group-hover:text-white/95 transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Businesses Need Strong Digital Platforms */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Value Proposition</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Why Modern Businesses Need Strong Digital Platforms</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {valueProps.map((prop, index) => (
              <div
                key={prop.title}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.03] hover:border-purple-500/30 flex flex-col justify-between fade-in-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="mb-6 p-4 inline-block bg-purple-500/10 text-purple-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    {prop.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-kaki-grey leading-relaxed group-hover:text-white/90 transition-colors">
                    {prop.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Workflow</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Our Development Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.step}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/20 hover:scale-[1.03] transition-all duration-500 fade-in-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div>
                  <div className="text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 mb-6">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-kaki-grey leading-relaxed group-hover:text-white/90 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nagaland Specific Section */}
      <section className="section-padding bg-gradient-to-r from-kaki-dark-grey via-purple-900/20 to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom max-w-4xl text-center fade-in-on-scroll">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Local Context</span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Web Development for Businesses in Nagaland
          </h2>
          <p className="text-xl text-purple-200 mb-6 font-medium">
            We help businesses across Dimapur, Kohima, and beyond build websites, apps, and digital systems designed for modern business needs.
          </p>
          <p className="text-kaki-grey text-lg leading-relaxed">
            From startups to growing brands, our focus is on creating digital platforms that are functional, scalable, and built for long-term use. We understand local network environments and design optimized interfaces that load fast even on slower connections.
          </p>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="section-padding bg-gradient-to-r from-kaki-black via-purple-900/40 to-kaki-black border-t border-white/5">
        <div className="container-custom text-center py-8">
          <div className="fade-in-on-scroll max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Ready to Build Your Platform?
              </span>
            </h2>
            <p className="text-xl text-kaki-grey mb-12 leading-relaxed">
              Create a faster, smarter, and more scalable digital presence for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
                <Link to="/contact">Start Your Project</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm px-8 py-6 rounded-xl text-lg font-bold">
                <Link to="/works">Explore Our Work</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WebDevelopment;
