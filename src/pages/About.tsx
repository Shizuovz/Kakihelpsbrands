import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Award, Zap, Handshake, Globe, Sparkles, Gem, Cpu, Palette } from 'lucide-react';
import { resolveApiUrl } from '@/utils/resolveApiUrl';

const About = () => {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/about`);
        if (response.ok) {
          const result = await response.json();
          setContent(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    if (isLoading || !content) return;

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
  }, [isLoading, content]);

  const getIcon = (iconName: string) => {
    const iconProps = {
      size: 32,
      strokeWidth: 1.5,
      className: "text-white"
    };

    const normalizedName = iconName?.toLowerCase().trim();

    switch (normalizedName) {
      case 'trophy':
      case 'excellence':
      case '✨':
        return <Gem {...iconProps} />;
      case 'innovation':
      case '🚀':
        return <Cpu {...iconProps} />;
      case 'partnership':
      case 'collaboration':
      case '🤝':
        return <Handshake {...iconProps} />;
      case 'culture':
      case '🎨':
      case 'identity':
      case 'global':
        return <Globe {...iconProps} />;
      default:
        return <Sparkles {...iconProps} />;
    }
  };

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-kaki-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero / Who We Are Section */}
      <section className="pt-36 pb-24 bg-gradient-to-br from-kaki-black via-purple-950/20 to-kaki-black">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Image */}
            <div className="fade-in-on-scroll animation-delay-200 order-2 lg:order-1">
              <div className="relative">
                <img
                  src={resolveApiUrl(content.intro?.image)}
                  alt="Who We Are - KAKI"
                  className="w-full h-auto rounded-3xl shadow-2xl border border-white/5"
                />
                <div className="absolute -inset-4 bg-purple-500/5 rounded-[2.5rem] blur-2xl -z-10" />
              </div>
            </div>
            {/* Right Column: Content */}
            <div className="fade-in-on-scroll order-1 lg:order-2">
              <div className="text-purple-400 font-semibold tracking-widest text-sm mb-4 uppercase flex items-center gap-2">
                <span className="w-8 h-[2px] bg-purple-500"></span>
                About Us
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-8 text-white leading-tight">
                {content.intro?.title}
              </h1>
              <p className="text-kaki-grey text-xl mb-6 leading-relaxed">
                {content.intro?.description}
              </p>
              <p className="text-kaki-grey text-xl mb-8 leading-relaxed">
                {content.intro?.subDescription}
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 rounded-xl text-lg font-bold">
                <Link to="/contact">Work With Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {content.vision && (
              <div className="fade-in-on-scroll bg-gradient-to-br from-kaki-dark-grey to-kaki-black p-8 md:p-12 rounded-3xl border border-purple-500/10 hover:border-purple-500/25 transition-all duration-300">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{content.vision.title}</h2>
                <p className="text-kaki-grey text-xl mb-4 leading-relaxed">
                  {content.vision.description}
                </p>
                <p className="text-kaki-grey text-xl leading-relaxed">
                  {content.vision.subDescription}
                </p>
              </div>
            )}
            {content.mission && (
              <div className="fade-in-on-scroll bg-gradient-to-br from-kaki-dark-grey to-kaki-black p-8 md:p-12 rounded-3xl border border-pink-500/10 hover:border-pink-500/25 transition-all duration-300">
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{content.mission.title}</h2>
                <p className="text-kaki-grey text-xl mb-4 leading-relaxed">
                  {content.mission.description}
                </p>
                <p className="text-kaki-grey text-xl leading-relaxed">
                  {content.mission.subDescription}
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-16 fade-in-on-scroll">
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
              <Link to="/contact">Work With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">{content.journeyTitle || 'Our Journey'}</h2>
            <p className="text-xl text-kaki-grey max-w-3xl mx-auto">
              {content.journeySubtitle}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 hidden lg:block" />
            {content.timeline?.map((item: any, index: number) => (
              <div key={item.year} className={`flex items-center mb-16 fade-in-on-scroll animation-delay-${index * 100}`}>
                <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 lg:ml-auto'}`}>
                  <div className="bg-gradient-to-br from-kaki-dark-grey to-kaki-black p-8 rounded-3xl hover-lift border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl font-bold text-purple-400">{item.year}</div>
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
                        {item.highlight}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                    <p className="text-kaki-grey leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-kaki-black shadow-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">{content.teamTitle || 'Meet Our Team'}</h2>
            <p className="text-xl text-kaki-grey max-w-3xl mx-auto">
              {content.teamSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.team?.map((member: any, index: number) => (
              <div key={member.name} className={`text-center group fade-in-on-scroll animation-delay-${index * 200}`}>
                <div className="relative mb-6 overflow-hidden rounded-3xl">
                  <img
                    src={resolveApiUrl(member.image)}
                    alt={member.name}
                    className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm">{member.specialization}</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{member.name}</h3>
                <p className="text-purple-400 text-sm mb-3 font-medium">{member.role}</p>
                <p className="text-kaki-grey text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900">
        <div className="container-custom text-center">
          <div className="fade-in-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-white">{content.ctaTitle || 'Join Our Journey'}</h2>
            <p className="text-xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              {content.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8">
                <Link to="/contact">Work With Us</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-900 px-8">
                <a href="mailto:connect@kakihelpsbrands.com">Join Our Team</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
