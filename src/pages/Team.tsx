import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Linkedin, Twitter, Instagram, Mail, Cpu, Handshake, Gem, Sparkles } from 'lucide-react';

const Team = () => {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/teamPage`);
        if (response.ok) {
          const result = await response.json();
          setContent(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch team content:', error);
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
      case 'excellence':
      case '⭐':
        return <Gem {...iconProps} />;
      case 'innovation': 
      case '🚀':
        return <Cpu {...iconProps} />;
      case 'partnership': 
      case 'collaboration':
      case '🤝':
        return <Handshake {...iconProps} />;
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
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-kaki-black via-purple-900/30 to-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {content.hero?.title || 'Our Team'}
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-4xl mx-auto leading-relaxed">
              {content.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12 fade-in-on-scroll">
            <Tabs defaultValue="leadership" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-kaki-dark-grey">
                  {Object.keys(content.departments || {}).map((dept) => (
                    <TabsTrigger key={dept} value={dept} className="capitalize">
                      {dept}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {Object.entries(content.departments || {}).map(([department, members]: [string, any]) => (
                <TabsContent key={department} value={department} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {members.map((member: any, index: number) => (
                      <div 
                        key={member.name} 
                        className="bg-kaki-dark-grey rounded-3xl overflow-hidden hover-lift fade-in-on-scroll group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="aspect-[4/5] overflow-hidden">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                          <p className="text-purple-300 mb-4">{member.role}</p>

                          <div className="flex gap-4">
                            {member.social?.linkedin && (
                              <a 
                                href={member.social.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-kaki-black/50 rounded-full hover:bg-purple-600/50 transition-colors"
                              >
                                <Linkedin className="w-5 h-5" />
                              </a>
                            )}
                            {member.social?.instagram && (
                              <a 
                                href={member.social.instagram} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-kaki-black/50 rounded-full hover:bg-blue-500/50 transition-colors"
                              >
                                <Instagram className="w-5 h-5" />
                              </a>
                            )}
                            {member.social?.email && (
                              <a 
                                href={`mailto:${member.social.email}`}
                                className="p-2 bg-kaki-black/50 rounded-full hover:bg-green-600/50 transition-colors"
                              >
                                <Mail className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-kaki-dark-grey">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Our Core Principles</h2>
            <p className="text-xl text-kaki-grey max-w-2xl mx-auto">
              The values that drive our team to excel in every project we undertake.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.values?.map((value: any, index: number) => (
              <div 
                key={index} 
                className={`group relative p-1 leading-relaxed rounded-[3rem] fade-in-on-scroll animation-delay-${index * 150}`}
              >
                {/* Background Glow on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-700`} />
                
                <div className="relative h-full bg-kaki-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.8rem] p-10 flex flex-col items-center text-center hover-lift transition-all duration-500 hover:border-white/20">
                  {/* Icon Container */}
                  <div className="relative mb-10">
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${value.color} p-[1px]`}>
                      <div className="w-full h-full bg-kaki-black rounded-2xl flex items-center justify-center">
                        {getIcon(value.icon)}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/60 transition-all duration-300">
                    {value.title}
                  </h3>
                  <p className="text-kaki-grey text-lg leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {value.description}
                  </p>

                  {/* Decorative element */}
                  <div className={`mt-8 w-12 h-1 rounded-full bg-gradient-to-r ${value.color} opacity-40 group-hover:w-24 group-hover:opacity-100 transition-all duration-500`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-purple-950/40">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.stats?.map((stat: any, index: number) => (
              <div 
                key={index} 
                className="text-center p-8 bg-kaki-dark-grey rounded-3xl fade-in-on-scroll hover-lift"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <p className="text-kaki-grey text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden fade-in-on-scroll">
            <div className="absolute inset-0 particles opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">{content.hiring?.title || 'Join Our Tech Family'}</h2>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                {content.hiring?.description}
              </p>
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-10 py-6 text-lg">
                {content.hiring?.buttonText || 'View Open Positions'}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
