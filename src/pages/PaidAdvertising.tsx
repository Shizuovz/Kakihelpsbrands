import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Search,
  Chrome,
  Tv,
  RefreshCw,
  Settings,
  FileText,
  Check,
  DollarSign,
  Target,
  TrendingUp,
  Eye,
  Sliders,
  Activity
} from 'lucide-react';

const PaidAdvertising = () => {
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
      title: "Google Ads Management",
      description: "Reach people actively searching for your products or services through high-intent Google search campaigns.",
      icon: <Chrome className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Search Ads",
        "Keyword Targeting",
        "Bid Optimization",
        "Conversion Tracking"
      ]
    },
    {
      title: "Facebook & Instagram Ads",
      description: "Run targeted campaigns designed around audience behavior, interests, and engagement patterns.",
      icon: <Target className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Audience Targeting",
        "Lead Generation Campaigns",
        "Retargeting Ads",
        "Creative Testing"
      ]
    },
    {
      title: "Display Advertising",
      description: "Increase visibility through visual ad placements across websites, apps, and digital platforms.",
      icon: <Tv className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Banner Campaigns",
        "Awareness Campaigns",
        "Audience Expansion",
        "Brand Visibility"
      ]
    },
    {
      title: "Remarketing Campaigns",
      description: "Reconnect with visitors who interacted with your business but didn’t convert the first time.",
      icon: <RefreshCw className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Retargeting Ads",
        "Audience Segmentation",
        "Conversion Campaigns",
        "Funnel Optimization"
      ]
    },
    {
      title: "Campaign Optimization",
      description: "Continuous monitoring and testing to improve performance and reduce wasted ad spend.",
      icon: <Settings className="w-6 h-6 text-purple-400" />,
      subItems: [
        "A/B Testing",
        "Budget Optimization",
        "Performance Analysis",
        "Conversion Tracking"
      ]
    },
    {
      title: "Landing Page Design",
      description: "Landing pages designed to support conversions, lead generation, and campaign performance.",
      icon: <FileText className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Conversion-Focused Layouts",
        "Mobile Optimization",
        "Fast Loading Speed",
        "Clear Call-to-Actions"
      ]
    }
  ];

  const valueProps = [
    {
      title: "Reach Customers Faster",
      description: "Appear in front of people already searching for products or services related to your business.",
      icon: <Eye className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Target the Right Audience",
      description: "Reach users based on location, interests, search intent, and online behavior.",
      icon: <Target className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Control Your Budget",
      description: "Scale campaigns based on goals, performance, and advertising priorities.",
      icon: <DollarSign className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Track Real Results",
      description: "Measure clicks, leads, conversions, and campaign performance with accurate reporting.",
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Stay Flexible",
      description: "Adjust campaigns, targeting, and creatives based on real-time performance data.",
      icon: <Sliders className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Support Long-Term Growth",
      description: "Use paid advertising alongside SEO and content marketing for a stronger overall strategy.",
      icon: <Activity className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-kaki-black text-white">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden flex items-center justify-center min-h-[75vh]">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-black via-purple-950/20 to-kaki-black z-0" />
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl z-0" />

        <div className="container-custom relative z-10 text-center max-w-4xl pt-10">
          <div className="fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.25em] px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 inline-block mb-6">
              Paid Search & Social
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                PPC Services in Nagaland
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-10 leading-relaxed">
              Drive real business results with performance-focused advertising on Google, Facebook, and Instagram.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-xl text-lg font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
                <Link to="/contact">
                  <span>Start Your Campaign</span>
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
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Paid Advertising</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Pay-Per-Click Advertising Services
              </h2>
            </div>
            <div className="lg:col-span-7 fade-in-on-scroll animation-delay-200">
              <p className="text-xl text-purple-300 font-medium mb-6 leading-relaxed">
                Stop guessing, start growing. Our data-driven PPC campaigns deliver qualified leads, increase conversions, and maximize your return on ad spend.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                We handle the strategy, the targeting, and the optimization so you can focus on running your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pillars */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Channels</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Paid Advertising Solutions</h2>
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

      {/* Why PPC Matters */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Value Proposition</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Why PPC Advertising Matters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-kaki-grey leading-relaxed group-hover:text-white/90 transition-colors">
                    {prop.description}
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
                Reach the Right Audience Faster
              </span>
            </h2>
            <p className="text-xl text-kaki-grey mb-12 leading-relaxed">
              Run targeted ad campaigns designed to generate traffic, leads, and measurable business growth.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-12 py-6 rounded-xl text-xl font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
              <Link to="/contact">Get Free Audit</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PaidAdvertising;
