import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Video,
  Play,
  Film,
  Tv,
  Sliders,
  Sparkles,
  Check,
  Eye,
  TrendingUp,
  Users,
  Award,
  Heart,
  Megaphone
} from 'lucide-react';

const VideoMarketing = () => {
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
      title: "Short-Form Video Content",
      description: "Create scroll-stopping content for Instagram Reels, TikTok, YouTube Shorts, and Facebook.",
      icon: <Film className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Reels Editing",
        "Short Ads",
        "Social Content",
        "Trend-Based Videos"
      ]
    },
    {
      title: "Brand Videos",
      description: "Professional branded videos designed to showcase your business, products, services, and story.",
      icon: <Award className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Brand Storytelling",
        "Promotional Videos",
        "Business Introductions",
        "Campaign Videos"
      ]
    },
    {
      title: "Social Media Video Marketing",
      description: "Video strategies tailored for social media growth, engagement, and audience retention.",
      icon: <Users className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Platform-Specific Content",
        "Video Campaigns",
        "Content Planning",
        "Audience Engagement"
      ]
    },
    {
      title: "Commercial Video Production",
      description: "High-quality commercial content created for advertising campaigns and digital promotions.",
      icon: <Video className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Product Commercials",
        "Service Promotions",
        "Launch Campaigns",
        "Creative Direction"
      ]
    },
    {
      title: "Event Coverage",
      description: "Capture live events, launches, concerts, business events, and brand activations professionally.",
      icon: <Tv className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Event Highlights",
        "Recap Videos",
        "Behind-the-Scenes Content",
        "Promotional Coverage"
      ]
    },
    {
      title: "Video Editing Services",
      description: "Professional editing focused on pacing, storytelling, engagement, and platform optimization.",
      icon: <Sliders className="w-6 h-6 text-purple-400" />,
      subItems: [
        "Motion Graphics",
        "Sound Design",
        "Color Correction",
        "Subtitle Integration"
      ]
    }
  ];

  const valueProps = [
    {
      title: "Capture Attention Faster",
      description: "Video content helps brands stand out in crowded social feeds and digital platforms.",
      icon: <Eye className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Increase Engagement",
      description: "People are more likely to interact with visual content than static posts alone.",
      icon: <Heart className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Build Stronger Brand Recall",
      description: "Consistent video content helps audiences remember your business and messaging.",
      icon: <Sparkles className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Improve Social Media Performance",
      description: "Short-form videos often generate higher reach, shares, and audience retention.",
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Showcase Your Brand Better",
      description: "Video allows businesses to communicate personality, quality, and experience more effectively.",
      icon: <Users className="w-6 h-6 text-purple-400" />
    },
    {
      title: "Support Paid Advertising Campaigns",
      description: "Strong video creatives improve the performance of social media and PPC advertising campaigns.",
      icon: <Megaphone className="w-6 h-6 text-purple-400" />
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Strategy & Planning",
      description: "We understand your goals, audience, platform, and content direction before production begins."
    },
    {
      step: "02",
      title: "Concept Development",
      description: "We develop creative ideas, content structures, and visual approaches aligned with your brand."
    },
    {
      step: "03",
      title: "Production",
      description: "Our team handles filming, creative execution, and content capture professionally."
    },
    {
      step: "04",
      title: "Editing & Optimization",
      description: "Videos are edited for pacing, engagement, platform formatting, and audience retention."
    },
    {
      step: "05",
      title: "Publishing & Performance",
      description: "We help optimize content for social media platforms and campaign performance."
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
              Vocal & Visual Media
            </span>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Video Marketing Services in Nagaland
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-10 leading-relaxed">
              Create video content that captures attention, builds brand visibility, and connects with your audience across digital platforms.
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
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Branded Media</span>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Professional Video Marketing Services
              </h2>
            </div>
            <div className="lg:col-span-7 fade-in-on-scroll animation-delay-200">
              <p className="text-lg text-purple-300 font-medium mb-6">
                Video content builds brand attention faster than any other medium.
              </p>
              <p className="text-kaki-grey text-lg leading-relaxed">
                We create trendy platform-optimized videos for Instagram Reels, brand campaigns, and event coverage. Our video editing services are designed to keep your business relevant, engaging, and visually memorable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Pillars */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Visual Formats</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Video Production Solutions</h2>
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

      {/* Why Video Matters */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-t border-b border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Value Proposition</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Why Video Marketing Matters</h2>
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

      {/* Video Process Section */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-4">Our Workflow</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white">Our Video Marketing Process</h2>
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
                Ready to Create Better Content?
              </span>
            </h2>
            <p className="text-xl text-kaki-grey mb-12 leading-relaxed">
              Build stronger visibility, engagement, and brand presence through professional video marketing.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-12 py-6 rounded-xl text-xl font-bold shadow-lg shadow-purple-500/20 hover:scale-105 transition-all duration-300">
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoMarketing;
