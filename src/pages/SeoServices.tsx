import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Search,
  Share2,
  Settings,
  MapPin,
  Check,
  TrendingUp,
  Compass,
  Layers,
  Zap
} from 'lucide-react';

const SeoServices = () => {
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

  const pillars = [
    {
      title: "On-Page SEO",
      description: "Optimize the structure and content of your website to improve search visibility and user experience.",
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Title & Meta Optimization",
        "Content Optimization",
        "Internal Linking",
        "Image Optimization",
        "URL Structure",
        "Header Tag Optimization"
      ]
    },
    {
      title: "Off-Page SEO",
      description: "Build authority and trust through strategic backlink acquisition and brand visibility.",
      icon: <Share2 className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Quality Link Building",
        "Brand Mentions",
        "Local Citations",
        "Guest Contributions",
        "Social Signals"
      ]
    },
    {
      title: "Technical SEO",
      description: "Improve your website’s performance, crawlability, and search engine accessibility.",
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Site Speed Optimization",
        "Mobile Optimization",
        "XML Sitemaps",
        "Schema Markup",
        "Core Web Vitals",
        "Indexing Optimization"
      ]
    },
    {
      title: "Local SEO",
      description: "Increase visibility in location-based searches across Kohima, Dimapur, and surrounding regions.",
      icon: <MapPin className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Google Business Profile Optimization",
        "Review Management",
        "Local Citations",
        "Location Pages",
        "NAP Consistency",
        "Local Keyword Strategy"
      ]
    },
    {
      title: "Generative Engine Optimization (GEO)",
      description: "Optimize your business for AI-powered search experiences and conversational discovery platforms.",
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      subItems: [
        "AI Search Visibility",
        "Entity Optimization",
        "Structured Content Strategy",
        "Knowledge Graph Signals",
        "Authority Building",
        "AI-Friendly Content Architecture"
      ]
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Website Audit",
      description: "We identify technical issues, content gaps, and growth opportunities across your website."
    },
    {
      step: "02",
      title: "Keyword & Search Research",
      description: "We identify high-intent search opportunities across traditional and AI-driven search experiences."
    },
    {
      step: "03",
      title: "On-Page Optimization",
      description: "We improve content structure, metadata, and website experience to align with search intent."
    },
    {
      step: "04",
      title: "Authority Building",
      description: "We strengthen your online credibility through backlinks, citations, and strategic content distribution."
    },
    {
      step: "05",
      title: "GEO Optimization",
      description: "We improve content structure, brand signals, and topical authority to increase discoverability across AI-powered search platforms."
    },
    {
      step: "06",
      title: "Ongoing Optimization",
      description: "Search continues to evolve. We monitor performance, track visibility, and refine strategies continuously."
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
              Search Engine Optimization
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                SEO & GEO Services in Nagaland
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-10 leading-relaxed">
              We help businesses across Kohima, Dimapur, and beyond improve visibility through Search Engine Optimization (SEO) and Generative Engine Optimization (GEO) — helping you get discovered on Google, AI-powered search platforms, and emerging search experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
                <Link to="/contact">
                  <span>Get Free SEO Audit</span>
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
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Strategic Growth</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Professional SEO & GEO Services for Businesses in Nagaland
              </h2>
            </div>
            <div className="lg:col-span-7 fade-in-on-scroll animation-delay-200">
              <p className="text-lg text-purple-300 font-medium mb-6">
                Search is evolving. Today, people discover businesses through Google, maps, social platforms, and increasingly through AI tools like ChatGPT, Gemini, Claude, and Perplexity.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                Our approach combines traditional SEO with Generative Engine Optimization (GEO) to improve visibility wherever customers search for information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of SEO */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Expertise</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Five Pillars of Successful Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/30 flex flex-col justify-between fade-in-on-scroll"
                style={{ animationDelay: `${index * 150}ms` }}
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
                  <p className="text-kaki-grey leading-relaxed mb-6">
                    {pillar.description}
                  </p>

                  <div className="w-full h-[1px] bg-white/5 my-6" />

                  <ul className="flex flex-col gap-3 text-sm text-kaki-grey">
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

      {/* Why SEO & GEO Matter */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-1 fade-in-on-scroll">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Value Proposition</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-8 text-white leading-tight">
                Why SEO & GEO Matter
              </h2>
              <div className="relative rounded-3xl overflow-hidden border border-white/10 p-[1px] bg-gradient-to-br from-white/10 to-transparent">
                <div className="bg-kaki-black/60 backdrop-blur-md p-8 rounded-3xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="text-white font-bold">The Evolution of Search</span>
                  </div>
                  <p className="text-kaki-grey leading-relaxed text-sm">
                    A modern search strategy combines traditional SEO with GEO to improve visibility across search engines and AI-powered discovery platforms.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-2 fade-in-on-scroll animation-delay-200 space-y-6">
              <p className="text-xl text-purple-300 font-medium leading-relaxed">
                People no longer search only on Google. Many users now ask questions directly to AI tools before making decisions, researching services, or comparing businesses.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                A modern search strategy combines traditional SEO with GEO to improve visibility across search engines and AI-powered discovery platforms.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                The businesses that adapt early will be easier to find, easier to trust, and more likely to be recommended.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Process Section */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Methodology</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Our SEO & GEO Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                Get Found Where People Search
              </span>
            </h2>
            <p className="text-xl text-kaki-grey mb-12 leading-relaxed">
              Build stronger visibility across Google, Maps, and emerging AI-powered search platforms through modern SEO and GEO strategies.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-12 py-6 rounded-xl text-xl font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
              <Link to="/contact">Call for Free Audit</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeoServices;
