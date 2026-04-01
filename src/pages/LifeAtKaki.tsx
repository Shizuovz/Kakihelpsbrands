import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Youtube, Facebook, Linkedin, Play, Loader2, AlertCircle } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { YouTubeIntegration } from '@/components/YouTubeIntegration';
import { useYouTube } from '@/hooks/useYouTube';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LifeAtKaki = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  // Hardcoded YouTube credentials
  const [youtubeApiKey, setYoutubeApiKey] = useState('AIzaSyCBPA_VvusazHVm5tKUaBYv00PcdfQirmg');
  const [youtubeChannelId, setYoutubeChannelId] = useState('@kaki9139');
  const [youtubePlaylistId, setYoutubePlaylistId] = useState('PLB62csA14WQoYAEavYpLrG66xScEI1dte');

  // YouTube integration
  const { videos: youtubeVideos, loading: youtubeLoading, error: youtubeError } = useYouTube({
    apiKey: youtubeApiKey,
    channelId: youtubeChannelId,
    playlistId: youtubePlaylistId,
    maxResults: 20
  });

  useEffect(() => {
    // Load saved YouTube credentials from localStorage, but use hardcoded as fallback
    const savedApiKey = localStorage.getItem('youtube-api-key') || 'AIzaSyCBPA_VvusazHVm5tKUaBYv00PcdfQirmg';
    const savedChannelId = localStorage.getItem('youtube-channel-id') || '@kaki9139';
    const savedPlaylistId = localStorage.getItem('youtube-playlist-id') || 'PLB62csA14WQoYAEavYpLrG66xScEI1dte';
    
    setYoutubeApiKey(savedApiKey);
    setYoutubeChannelId(savedChannelId);
    setYoutubePlaylistId(savedPlaylistId);
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
  }, []);

  const handleApiKeySet = (apiKey: string, channelId: string, playlistId?: string) => {
    setYoutubeApiKey(apiKey);
    setYoutubeChannelId(channelId);
    setYoutubePlaylistId(playlistId || '');
    
    // Save to localStorage
    localStorage.setItem('youtube-api-key', apiKey);
    localStorage.setItem('youtube-channel-id', channelId);
    if (playlistId) {
      localStorage.setItem('youtube-playlist-id', playlistId);
    } else {
      localStorage.removeItem('youtube-playlist-id');
    }
  };

  const playVideo = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Fallback content data (keeping original structure)
  const fallbackActivities = {
    events: [
      {
        title: 'KAKI Annual Music Festival',
        description: 'Our annual in-house music competition where team members showcase their musical talents.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=900',
        date: 'July 2023',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Gaming Tournament',
        description: 'Quarterly gaming competitions with prizes and bragging rights at stake.',
        image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?q=80&w=900',
        date: 'October 2023',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        title: 'Hackathon Weekend',
        description: '48-hour creative sprint where cross-departmental teams build innovative prototypes.',
        image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=900',
        date: 'March 2023',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ],
  };

  // Convert ALL YouTube videos to activities format for events tab (removed slice limit)
  const youtubeActivities = youtubeVideos.map(video => ({
    title: video.title.length > 50 ? video.title.substring(0, 50) + '...' : video.title,
    description: video.description.length > 100 ? video.description.substring(0, 100) + '...' : video.description,
    image: video.thumbnail,
    date: formatDate(video.publishedAt),
    videoUrl: video.embedUrl
  }));

  // Use YouTube videos for events if available, otherwise use fallback
  const activities = {
    ...fallbackActivities,
    events: youtubeVideos.length > 0 ? youtubeActivities : fallbackActivities.events
  };

  const testimonials = [
    {
      quote: "KAKI isn't just where I work—it's where I thrive. The balance between challenging creative work and genuine fun makes every day exciting.",
      name: "Alex J.",
      role: "Senior Designer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
    },
    {
      quote: "I've never been part of a company that values my whole self—not just my work output. The culture here truly nurtures both professional and personal growth.",
      name: "Sam T.",
      role: "Video Producer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400"
    },
    {
      quote: "The collaborative environment and work-life balance at KAKI has allowed me to do the best work of my career while still having time for what matters outside of work.",
      name: "Jordan M.",
      role: "Tech Developer",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400"
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeVideo}
            className="absolute top-8 right-8 text-white text-3xl hover:text-gray-300"
          >
            ×
          </button>
          <div className="w-full max-w-5xl aspect-video">
            <iframe 
              src={currentVideo} 
              className="w-full h-full" 
              title="Video Player" 
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-kaki-black via-purple-900/30 to-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Life at KAKI
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-4xl mx-auto leading-relaxed">
              We believe in balancing hard work with play. Discover how we foster creativity, wellbeing, and community among our team.
            </p>
          </div>
        </div>
      </section>

      {/* YouTube Integration Section */}
      {!youtubeApiKey && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-8 fade-in-on-scroll">
              <h2 className="text-3xl font-bold mb-4">Connect Your YouTube Channel</h2>
              <p className="text-kaki-grey max-w-2xl mx-auto">
                Display your actual YouTube videos instead of placeholder content by connecting your YouTube channel.
              </p>
            </div>
            <YouTubeIntegration 
              onApiKeySet={handleApiKeySet}
              hasApiKey={!!youtubeApiKey}
            />
          </div>
        </section>
      )}

      {/* Video Intro Section */}
      <section className="section-padding hidden md:block">
        <div className="container-custom">
          {youtubeLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-kaki-grey">Loading YouTube videos...</p>
            </div>
          )}

          {youtubeError && (
            <Alert className="mb-8 border-red-500/20 bg-red-500/10">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                Failed to load YouTube videos: {youtubeError}
                <br />
                <span className="text-sm">Falling back to placeholder content.</span>
              </AlertDescription>
            </Alert>
          )}

          <div className="relative rounded-3xl overflow-hidden aspect-video fade-in-on-scroll cursor-pointer group" onClick={() => playVideo(youtubeVideos[0]?.embedUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ')}>
            <img 
              src={youtubeVideos[0]?.thumbnail || "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1600"} 
              alt="Life at KAKI" 
              className="w-full h-full object-cover brightness-75 group-hover:brightness-50 transition-all duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-10 h-10 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="text-3xl font-bold text-white">
                {youtubeVideos[0]?.title || "A Day in the Life at KAKI"}
              </h2>
              <p className="text-white/80">
                {youtubeVideos[0]?.description?.substring(0, 100) || "Experience our creative culture, workspaces, and team dynamics"}
              </p>
            </div>
          </div>

          {youtubeApiKey && (
            <div className="mt-4 text-center hidden">
              <YouTubeIntegration 
                onApiKeySet={handleApiKeySet}
                hasApiKey={!!youtubeApiKey}
              />
            </div>
          )}
        </div>
      </section>

      {/* Activities Tabs Section */}
      <section className="mt-12 md:mt-0">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Work Hard, Play Harder</h2>
            <p className="text-kaki-grey max-w-3xl mx-auto text-lg">
              At KAKI, we believe that creativity flourishes when people feel balanced, connected, and inspired.
              Explore the activities and initiatives that make our workplace culture special.
            </p>
          </div>

          <div className="mb-12 fade-in-on-scroll">
            <Tabs defaultValue="events" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-kaki-dark-grey">
                  <TabsTrigger value="events">
                    Daily Vlogs {youtubeVideos.length > 0 && <Youtube className="w-4 h-4 ml-1 text-red-500" />}
                  </TabsTrigger>
                </TabsList>
              </div>

              {Object.entries(activities).map(([category, items]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {items.map((item, index) => (
                      <div 
                        key={item.title} 
                        className="bg-kaki-dark-grey rounded-3xl overflow-hidden hover-lift fade-in-on-scroll group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="aspect-video overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {item.videoUrl && (
                            <div 
                              className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                playVideo(item.videoUrl);
                              }}
                            >
                              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                <Play className="w-7 h-7 text-white fill-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="text-sm text-purple-300 mb-2">{item.date}</div>
                          <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                          <p className="text-kaki-grey">{item.description}</p>
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

      {/* Instagram Feed Section */}
      <section className="section-padding bg-gradient-to-b from-kaki-black to-purple-950/40">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Follow Our Journey</h2>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
              <a href="https://instagram.com/kaki_marketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-kaki-grey hover:text-white transition-colors">
                <Instagram className="w-5 h-5" /> Instagram
              </a>
              <a href="https://youtube.com/@kaki9139" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-kaki-grey hover:text-white transition-colors">
                <Youtube className="w-5 h-5" /> Youtube
              </a>
              <a href="https://facebook.com/KAKIMarketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-kaki-grey hover:text-white transition-colors">
                <Facebook className="w-5 h-5" /> Facebook
              </a>
              <a href="https://twitter.com/KAKImarketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-kaki-grey hover:text-white transition-colors">
                <FaXTwitter className="w-5 h-5" /> Twitter
              </a>
              <a href="https://in.linkedin.com/company/kakimarketing" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-kaki-grey hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" /> LinkedIn
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div 
                key={index}
                className="aspect-square rounded-xl overflow-hidden fade-in-on-scroll hover-scale-110 cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img 
                  src={`https://source.unsplash.com/random/300x300?creative,office,fun&sig=${index}`}
                  alt="KAKI Instagram"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Team Voices</h2>
            <p className="text-kaki-grey max-w-3xl mx-auto text-lg">
              Hear directly from our team members about what makes KAKI a special place to work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-purple-900/50 to-kaki-dark-grey p-8 rounded-3xl fade-in-on-scroll hover-lift"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{testimonial.name}</h3>
                    <p className="text-purple-300 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-kaki-grey italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Join Us CTA */}
      <section className="section-padding bg-kaki-dark-grey">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden fade-in-on-scroll">
            <div className="absolute inset-0 particles opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Want to Join the Fun?</h2>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                We're always looking for passionate, creative individuals to join our team.
                Check out our open positions and become part of the KAKI family.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8">
                  View Open Positions
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                  Learn About Benefits
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LifeAtKaki;