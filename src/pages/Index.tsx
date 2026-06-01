import { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/config';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowDown, Play, Pause, Instagram, Youtube, Facebook, Video, Code, Search, Share2, Target, Palette } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { resolveApiUrl } from '@/utils/resolveApiUrl';

import logo from '../assets/logos/logo-no-bg.png';
import ahibiLogo from '../assets/lovable-uploads/ahibi.png';
import ahibiImg from '../assets/img/ahibi.png';

const Index = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const services = [
    {
      title: "SEO & GEO Services",
      description: "Improve your visibility across Google, Maps, and AI-powered search platforms to help more customers discover your business.",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: "Social Media Marketing",
      description: "Build attention, trust, and engagement through content people actually want to follow.",
      icon: <Share2 className="w-8 h-8" />
    },
    {
      title: "PPC Advertising",
      description: "Run targeted ad campaigns that generate leads, sales, and measurable results.",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Video Marketing",
      description: "Short-form videos and branded content designed to stop scrolling and drive engagement.",
      icon: <Video className="w-8 h-8" />
    },
    {
      title: "Web Development",
      description: "Professional websites designed to build credibility, improve user experience, and support business growth.",
      icon: <Code className="w-8 h-8" />
    },
    {
      title: "Graphic Design",
      description: "Build a brand identity that looks professional, feels consistent, and connects with your audience.",
      icon: <Palette className="w-8 h-8" />
    }
  ];

  const getServicePath = (title: string) => {
    switch (title) {
      case 'SEO & GEO Services':
        return '/services/seo-geo';
      case 'Social Media Marketing':
        return '/services/social-media-marketing';
      case 'PPC Advertising':
        return '/services/paid-advertising';
      case 'Video Marketing':
        return '/services/video-marketing';
      case 'Web Development':
        return '/services/web-development';
      case 'Graphic Design':
        return '/services/graphic-design';
      default:
        return '/';
    }
  };
  const reasons = [
    {
      num: "01",
      title: "Local Understanding",
      description: "We understand the market, audience, and culture across Nagaland."
    },
    {
      num: "02",
      title: "Results That Matter",
      description: "Campaigns focused on visibility, engagement, leads, and long-term growth."
    },
    {
      num: "03",
      title: "Creative That Connects",
      description: "Content and branding designed to stand out and stay memorable."
    },
    {
      num: "04",
      title: "Built to Scale",
      description: "Flexible marketing support for startups, local businesses, and growing brands."
    }
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/all`);
        if (response.ok) {
          const result = await response.json();
          setContent(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch index content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

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
  }, [content]);

  const handleVideoPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error('Video play error:', error);
          }
        });
      }
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video': return <Video className="w-8 h-8" />;
      case 'Instagram': return <Instagram className="w-8 h-8" />;
      case 'Code': return <Code className="w-8 h-8" />;
      case 'Youtube': return <Youtube className="w-6 h-6" />;
      case 'Facebook': return <Facebook className="w-6 h-6" />;
      case 'Twitter': return <FaXTwitter className="w-6 h-6" />;
      case 'Linkedin': return <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
      default: return <span>{iconName}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Fallback to default if content fetch failed
  const hero = content?.hero || {
    title: "We Build Brands",
    subtitle: "KAKI delivers full-service digital marketing — strategy, content, and campaigns that engage, convert, and scale.",
    videoUrl: "/video/kaki.mp4",
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1920&q=80"
  };
  const departments = content?.departments || [];
  const stats = content?.stats || [];
  const socialLinks = content?.socialLinks || [];
  const recentWorks = content?.recentWorks || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Static Hero Image (shown when not playing) */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${isPlaying ? 'opacity-0' : 'opacity-30'}`}
          >
            <img
              src={resolveApiUrl(hero.posterUrl)}
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Video (shown when playing) */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-700 ${isPlaying ? 'opacity-30' : 'opacity-0'}`}
            loop
            muted
            playsInline
            key={hero.videoUrl}
          >
            <source src={resolveApiUrl(hero.videoUrl)} type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 text-center container-custom pt-32 pb-20">
          <div className="animate-fade-in-up">
            <img
              src={logo}
              alt="KAKI Logo"
              className="h-24 lg:h-48 w-auto mx-auto mb-8 animate-logo-float drop-shadow-2xl"
            />
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in-up animation-delay-200">
            <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {hero.title}
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-kaki-grey max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-400">
            {hero.subtitle}
          </p>

          <div className="mb-12 animate-fade-in-up animation-delay-500">
            <button
              onClick={handleVideoPlay}
              className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors" />
              ) : (
                <Play className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors" />
              )}
            </button>
            <p className="text-sm text-kaki-grey mt-4">Watch Our Story</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up animation-delay-600">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-6 text-lg">
              <Link to="/contact">Let’s Get On Call</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white hover:text-black backdrop-blur-sm px-8 py-6 text-lg">
              <Link to="/works">View Our Works</Link>
            </Button>
          </div>

          <div className="flex justify-center gap-6 mt-12 animate-fade-in-up animation-delay-800">
            {socialLinks.map((social: any) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
                aria-label={social.label}
              >
                {getIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <ArrowDown className="w-6 h-6 text-kaki-grey" />
        </div>
      </section>

      {/* Digital Marketing Services Section */}
      <section className="section-padding bg-kaki-black border-b border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Digital Marketing Services
            </h2>
            <p className="text-xl text-kaki-grey max-w-3xl mx-auto leading-relaxed">
              Helping businesses grow through strategy, content, performance marketing, and brand positioning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const path = getServicePath(service.title);
              return (
                <Link
                  key={service.title}
                  to={path}
                  className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.03] hover:border-purple-500/30 flex flex-col justify-between fade-in-on-scroll"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="mb-6 p-4 inline-block bg-purple-500/10 text-purple-400 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-kaki-grey leading-relaxed group-hover:text-white/90 transition-colors">
                      {service.description}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center text-sm font-semibold text-purple-400 group-hover:text-purple-300">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose KAKI Section */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-kaki-dark-grey border-b border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-4 fade-in-on-scroll">
              <span className="text-sm font-bold text-purple-400 uppercase tracking-widest block mb-4">Why KAKI</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                Why Businesses Choose KAKI
              </h2>
              <p className="text-xl text-kaki-grey leading-relaxed">
                We help local brands grow with strategy, content, and marketing that actually fits the way people discover businesses today.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {reasons.map((reason, index) => (
                <div
                  key={reason.title}
                  className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-500 hover:scale-[1.03] hover:border-purple-500/30 flex flex-col justify-between fade-in-on-scroll"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div>
                    <div className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {reason.num}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-kaki-grey leading-relaxed group-hover:text-white/90 transition-colors">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="section-padding bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">Our Impact</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Real work. Real collaborations. Real growth.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat: any, index: number) => (
              <div key={stat.label} className={`text-center fade-in-on-scroll animation-delay-${index * 200} group`}>
                <div className={`text-4xl lg:text-6xl font-bold ${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-white/80 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Works Preview */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">Recent Works</h2>
            <p className="text-xl text-kaki-grey max-w-2xl mx-auto">
              A glimpse into our latest creative achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {recentWorks.map((work: any, index: number) => (
              <div key={work.title} className={`group relative overflow-hidden rounded-2xl fade-in-on-scroll animation-delay-${index * 200} hover-lift`}>
                <div className="aspect-square bg-gradient-to-br from-kaki-dark-grey to-kaki-black">
                  <img
                    src={resolveApiUrl(work.image)}
                    alt={work.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="text-sm text-kaki-grey mb-2">{work.category}</div>
                    <h3 className="text-xl font-bold text-white">{work.title}</h3>
                    <p className="text-sm text-white">{work.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center fade-in-on-scroll">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8">
              <Link to="/works">View All Works</Link>
            </Button>
          </div>
        </div>
      </section>



      {/* Departments Section */}
      {/* <section className="section-padding bg-gradient-to-b from-kaki-black via-kaki-dark-grey to-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-20 fade-in-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Departments
            </h2>
            <p className="text-xl text-kaki-grey max-w-4xl mx-auto leading-relaxed">
              Four specialized departments that Drive Results & Real Connections through innovative video, design, and digital experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {departments.map((dept: any, index: number) => (
              <Link
                key={dept.name}
                to={dept.path}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${dept.gradient} p-8 lg:p-12 hover-lift fade-in-on-scroll transform transition-all duration-500 hover:scale-105`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="mr-4 p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      {getIcon(dept.icon)}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-white/80">{dept.stats}</div>
                    </div>
                  </div>

                  <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-white group-hover:text-white/90 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-white/80 text-lg group-hover:text-white transition-colors leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="mt-8 flex items-center text-white font-medium group-hover:translate-x-2 transition-transform">
                    Explore Department
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 right-4 w-3 h-3 bg-white/50 rounded-full opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Ahibi Showcase Section */}
      <section className="section-padding bg-gradient-to-r from-red-900 via-red-700 to-orange-800">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-white">Our Platform</h2>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Introducing Ahibi - Our revolutionary online ticket booking platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-on-scroll">
              <div className="bg-white p-8 rounded-3xl text-center mb-8">
                <img
                  src={ahibiLogo}
                  alt="Ahibi Logo"
                  className="h-16 mx-auto"
                />
              </div>
              <h3 className="text-3xl font-bold text-white mb-6">Ahibi.in</h3>
              <p className="text-red-100 text-lg mb-8 leading-relaxed">
                A cutting-edge online ticket booking platform developed by KAKI Tech. Experience seamless event booking with our innovative digital solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-white text-red-900 hover:bg-red-50">
                  <a href="https://ahibi.in" target="_blank" rel="noopener noreferrer">
                    Visit Ahibi.in
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-red-900">
                  <Link to="/departments/tech">Learn More</Link>
                </Button>
              </div>
            </div>

            <div className="fade-in-on-scroll animation-delay-200">
              <div className="relative">
                <img
                  src={ahibiImg}
                  alt="Ahibi Platform Preview"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-kaki-black via-purple-900/50 to-kaki-black">
        <div className="container-custom text-center">
          <div className="fade-in-on-scroll">
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Ready to grow your Brand?
            </h2>
            <p className="text-xl text-kaki-grey mb-12 max-w-3xl mx-auto leading-relaxed">
              Let’s turn your ideas into campaigns, content, and stories that move people, grow influence, and leave a mark.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-12 py-6 text-xl">
              <Link to="/contact">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
