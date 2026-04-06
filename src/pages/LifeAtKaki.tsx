import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Instagram, Youtube, Facebook, Linkedin, Play, Loader2, AlertCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaXTwitter } from 'react-icons/fa6';
import { YouTubeIntegration } from '@/components/YouTubeIntegration';
import { useYouTube } from '@/hooks/useYouTube';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { API_BASE_URL } from '@/config';
import { resolveApiUrl } from '@/utils/resolveApiUrl';

const LifeAtKaki = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  // Default YouTube credentials for KAKI - Connected Automatically
  const DEFAULT_YOUTUBE = {
    apiKey: 'AIzaSyCBPA_VvusazHVm5tKUaBYv00PcdfQirmg',
    channelId: '@kaki9139',
    playlistId: 'PLB62csA14WQoYAEavYpLrG66xScEI1dte'
  };

  // Initialize state directly with defaults or localStorage
  const [youtubeApiKey, setYoutubeApiKey] = useState(localStorage.getItem('youtube-api-key') || DEFAULT_YOUTUBE.apiKey);
  const [youtubeChannelId, setYoutubeChannelId] = useState(localStorage.getItem('youtube-channel-id') || DEFAULT_YOUTUBE.channelId);
  const [youtubePlaylistId, setYoutubePlaylistId] = useState(localStorage.getItem('youtube-playlist-id') || DEFAULT_YOUTUBE.playlistId);

  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // YouTube integration hook - will trigger automatically with the states above
  const { videos: youtubeVideos, loading: youtubeLoading, error: youtubeError } = useYouTube({
    apiKey: youtubeApiKey,
    channelId: youtubeChannelId,
    playlistId: youtubePlaylistId,
    maxResults: 20
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/all`);
        if (response.ok) {
          const result = await response.json();
          const lifeData = result.data?.lifeAtKaki;
          if (lifeData) {
            setContent(lifeData);

            // Sync with backend data if available, otherwise fallback to our defaults
            const newKey = lifeData.youtube?.apiKey || DEFAULT_YOUTUBE.apiKey;
            const newChannel = lifeData.youtube?.channelId || DEFAULT_YOUTUBE.channelId;
            const newPlaylist = lifeData.youtube?.playlistId || DEFAULT_YOUTUBE.playlistId;

            setYoutubeApiKey(newKey);
            setYoutubeChannelId(newChannel);
            setYoutubePlaylistId(newPlaylist);

            localStorage.setItem('youtube-api-key', newKey);
            localStorage.setItem('youtube-channel-id', newChannel);
            localStorage.setItem('youtube-playlist-id', newPlaylist);
          }
        }
      } catch (error) {
        console.error('Failed to fetch Life at Kaki content:', error);
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
  }, []);

  const handleApiKeySet = (apiKey: string, channelId: string, playlistId?: string) => {
    setYoutubeApiKey(apiKey);
    setYoutubeChannelId(channelId);
    setYoutubePlaylistId(playlistId || '');

    localStorage.setItem('youtube-api-key', apiKey);
    localStorage.setItem('youtube-channel-id', channelId);
    if (playlistId) {
      localStorage.setItem('youtube-playlist-id', playlistId);
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

  const fallbackActivities = {
    events: (content?.highlights || []).map((h: any) => ({
      ...h,
      image: resolveApiUrl(h.image),
      videoUrl: resolveApiUrl(h.videoUrl)
    }))
  };

  // Process YouTube videos into the display format
  const youtubeActivities = youtubeVideos.map(video => ({
    title: video.title.length > 50 ? video.title.substring(0, 50) + '...' : video.title,
    description: video.description.length > 100 ? video.description.substring(0, 100) + '...' : video.description,
    image: video.thumbnail,
    date: formatDate(video.publishedAt),
    videoUrl: video.embedUrl
  }));

  const activities = {
    ...fallbackActivities,
    events: youtubeVideos.length > 0 ? youtubeActivities : fallbackActivities.events
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

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

      {/* Video Intro Section */}
      <section className="section-padding hidden md:block">
        <div className="container-custom">
          {youtubeLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-kaki-grey">Connecting to YouTube...</p>
            </div>
          )}

          {youtubeError && (
            <Alert className="mb-8 border-red-500/20 bg-red-500/10">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                YouTube sync failed: {youtubeError}. Showing backup highlights.
              </AlertDescription>
            </Alert>
          )}

          {!youtubeLoading && (
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
          )}
        </div>
      </section>

      {/* Activities Tabs Section */}
      <section className="mt-12 md:mt-0">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h2 className="text-4xl font-bold mb-6">Work Hard, Play Harder</h2>
            <p className="text-kaki-grey max-w-3xl mx-auto text-lg">
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
                        key={item.title + index}
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

      {/* Social Links */}
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
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="section-padding bg-kaki-dark-grey">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden fade-in-on-scroll">
            <div className="absolute inset-0 particles opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">Want to Join the Fun?</h2>
              <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
                We're always looking for passionate, creative individuals to join our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8">
                  <Link to="/contact">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden Management Tool - Accessible if needed via dev console or specific URL params */}
      {window.location.search.includes('manage=true') && (
        <section className="py-12 bg-black/50">
          <div className="container-custom">
            <YouTubeIntegration onApiKeySet={handleApiKeySet} hasApiKey={!!youtubeApiKey} />
          </div>
        </section>
      )}
    </div>
  );
};

export default LifeAtKaki;