import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Facebook, 
  Instagram, 
  Layers, 
  TrendingUp, 
  Users, 
  Check, 
  BarChart3, 
  Megaphone, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

const SocialMediaServices = () => {
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
      title: "Facebook Marketing",
      description: "Build stronger visibility and run targeted campaigns designed to reach the right audience.",
      icon: <Facebook className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Business Page Optimization",
        "Paid Campaigns",
        "Audience Targeting",
        "Community Management"
      ]
    },
    {
      title: "Instagram Marketing",
      description: "Create visually engaging content that helps your brand stand out and stay memorable.",
      icon: <Instagram className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Reels & Short-Form Content",
        "Feed Strategy",
        "Story Content",
        "Hashtag Strategy"
      ]
    },
    {
      title: "Social Media Strategy",
      description: "Custom strategies aligned with your brand goals, audience behavior, and content direction.",
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Content Planning",
        "Campaign Strategy",
        "Brand Positioning",
        "Platform Growth"
      ]
    },
    {
      title: "Paid Social Advertising",
      description: "Reach targeted audiences through performance-driven advertising campaigns.",
      icon: <Megaphone className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Facebook Ads",
        "Instagram Ads",
        "Retargeting Campaigns",
        "Lead Generation"
      ]
    },
    {
      title: "Analytics & Reporting",
      description: "Track growth, engagement, and campaign performance through actionable insights.",
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Performance Reports",
        "Audience Insights",
        "Reach & Engagement Tracking",
        "Campaign Analysis"
      ]
    },
    {
      title: "Influencer Marketing",
      description: "Collaborate with creators and local influencers to expand reach and build credibility.",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Influencer Partnerships",
        "Campaign Coordination",
        "Brand Collaborations",
        "Audience Expansion"
      ]
    }
  ];

  const valueProps = [
    {
      title: "Build Brand Awareness",
      description: "Stay visible and consistently present where your audience spends their time.",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Create Stronger Engagement",
      description: "Build trust through conversations, content, and community interaction.",
      icon: <MessageSquare className="w-6 h-6" />
    },
    {
      title: "Reach the Right Audience",
      description: "Target potential customers through strategic content and paid campaigns.",
      icon: <Users className="w-6 h-6" />
    },
    {
      title: "Understand Your Audience",
      description: "Use analytics and engagement data to improve performance and make smarter decisions.",
      icon: <TrendingUp className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-kaki-black text-white">
      {/* Hero Section */}
      <section className="section-padding relative overflow-hidden flex items-center justify-center min-h-[75vh]">
        {/* Background glow effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-kaki-black via-purple-950/20 to-kaki-black z-0" />
        <div className="absolute -top-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl z-0" />

        <div className="container-custom relative z-10 text-center max-w-4xl pt-10">
          <div className="fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.25em] px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 inline-block mb-6">
              Social Media Marketing
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Social Media Marketing in Nagaland
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-10 leading-relaxed">
              Creative content and marketing strategies designed to help brands grow through Instagram, Facebook, short-form video, and performance-driven campaigns.
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
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Engage & Grow</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Professional Social Media Marketing Services
              </h2>
            </div>
            <div className="lg:col-span-7 fade-in-on-scroll animation-delay-200">
              <p className="text-lg text-purple-300 font-medium mb-6">
                Social media is where people discover brands, build trust, and decide who to follow, buy from, or recommend.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                We help businesses create content, campaigns, and strategies that stay consistent, feel relevant, and connect with the right audience across platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pillars */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Core Capabilities</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Full-Suite Social Marketing</h2>
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

      {/* Why Social Media Marketing Matters */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Value & Impact</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Why Social Media Marketing Matters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => (
              <div 
                key={prop.title} 
                className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.03] hover:border-purple-500/30 flex flex-col justify-between fade-in-on-scroll"
                style={{ animationDelay: `${index * 150}ms` }}
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
                Ready to Grow Your Brand Online?
              </span>
            </h2>
            <p className="text-xl text-kaki-grey mb-12 leading-relaxed">
              We help businesses create content and campaigns that build attention, engagement, and long-term visibility.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-12 py-6 rounded-xl text-xl font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
              <Link to="/contact">Start Your Campaign</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialMediaServices;
