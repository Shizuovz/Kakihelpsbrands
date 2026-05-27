import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Palette,
  Award,
  Calendar,
  Megaphone,
  Layout,
  Printer,
  Check,
  Sparkles,
  TrendingUp,
  Users,
  Layers,
  Compass,
  Eye
} from 'lucide-react';

const GraphicDesign = () => {
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
      title: "Social Media Design",
      description: "Creative visuals designed for engagement, campaigns, and consistent brand presence online.",
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Social Media Posts",
        "Story Designs",
        "Campaign Creatives",
        "Ad Creatives"
      ]
    },
    {
      title: "Branding & Identity Design",
      description: "Build a recognizable brand identity with visuals designed for long-term consistency.",
      icon: <Award className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Logo Design",
        "Brand Identity Systems",
        "Typography & Color Systems",
        "Brand Guidelines"
      ]
    },
    {
      title: "Event Branding",
      description: "Complete visual branding for concerts, festivals, launches, business events, and campaigns.",
      icon: <Calendar className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Event Posters",
        "Stage Visuals",
        "Backdrops & Banners",
        "Event Collaterals"
      ]
    },
    {
      title: "Marketing & Advertising Design",
      description: "Design assets created for promotions, campaigns, and business marketing materials.",
      icon: <Megaphone className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Digital Ads",
        "Flyers & Brochures",
        "Promotional Creatives",
        "Campaign Assets"
      ]
    },
    {
      title: "Website & Digital Assets",
      description: "Design visuals optimized for websites, apps, and digital platforms.",
      icon: <Layout className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Website Banners",
        "UI Graphics",
        "App Assets",
        "Icons & Visual Elements"
      ]
    },
    {
      title: "Print & Publication Design",
      description: "Professional print-ready designs for offline branding and large-format visibility.",
      icon: <Printer className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Hoardings & Billboards",
        "Magazine Layouts",
        "Packaging Design",
        "Business Stationery"
      ]
    }
  ];

  const valueProps = [
    {
      title: "Build Stronger Brand Recognition",
      description: "Consistent visuals help people recognize and remember your business more easily.",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Improve Marketing Performance",
      description: "Well-designed creatives capture attention faster and improve engagement across platforms.",
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Create Professional Brand Perception",
      description: "Strong branding builds credibility and trust with potential customers.",
      icon: <Award className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Support Online & Offline Visibility",
      description: "Design plays a major role across social media, websites, events, advertising, and print campaigns.",
      icon: <Eye className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Communicate More Clearly",
      description: "Visual communication helps businesses present information faster and more effectively.",
      icon: <Compass className="w-6 h-6 text-purple-400" />
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Brand Understanding",
      description: "We understand your brand identity, goals, audience, and creative direction."
    },
    {
      step: "02",
      title: "Concept Development",
      description: "We develop visual concepts aligned with your campaign, platform, or branding needs."
    },
    {
      step: "03",
      title: "Design Execution",
      description: "Our team creates polished, platform-optimized designs focused on clarity and impact."
    },
    {
      step: "04",
      title: "Revisions & Refinement",
      description: "We refine layouts, visuals, and branding elements based on feedback and usability."
    },
    {
      step: "05",
      title: "Final Delivery",
      description: "All files are delivered in formats optimized for digital, print, and production use."
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
              Creative & Visual Identity
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Graphic Design Services in Nagaland
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-10 leading-relaxed">
              Designs that help your brand look professional, stay consistent, and stand out across digital and offline platforms.
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
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Branded Visuals</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Professional Graphic Design Services
              </h2>
            </div>
            <div className="lg:col-span-7 fade-in-on-scroll animation-delay-200">
              <p className="text-lg text-purple-300 font-medium mb-6">
                Strong design shapes how people see and remember your brand.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                We create visual assets that support marketing, branding, campaigns, events, and business communication across multiple platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pillars */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Formats</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Full-Scope Creative Design</h2>
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

      {/* Why Good Design Matters */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Value Proposition</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Why Good Design Matters</h2>
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

      {/* Design Process Section */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Workflow</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Our Design Process</h2>
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

      {/* Bottom CTA Section */}
      <section className="section-padding bg-gradient-to-r from-kaki-black via-purple-900/40 to-kaki-black border-t border-white/5">
        <div className="container-custom text-center py-8">
          <div className="fade-in-on-scroll max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Ready to Strengthen Your Brand Visuals?
              </span>
            </h2>
            <p className="text-xl text-kaki-grey mb-12 leading-relaxed">
              Create designs that help your business stay consistent, recognizable, and visually impactful.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
                <Link to="/contact">Start Your Project</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm px-8 py-6 rounded-xl text-lg font-bold">
                <Link to="/works">Explore Our Creative Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GraphicDesign;
