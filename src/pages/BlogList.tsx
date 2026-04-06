import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "@/config";
import { resolveApiUrl } from "@/utils/resolveApiUrl";
import { Calendar, User, ArrowRight, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const BlogList = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/all`);
        const result = await response.json();
        setBlogs(result.data?.blogs || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(result.message || "Subscription failed");
      }
    } catch (error) {
      toast.error("Connection error. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaki-black pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-20 text-center">
        <div className="container mx-auto">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-6 px-4 py-1">
            THE KAKI JOURNAL
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
            Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Creativity</span> & Insight
          </h1>
          <p className="text-xl text-kaki-grey max-w-2xl mx-auto leading-relaxed">
            Explorations into brand strategy, digital storytelling, and the future of creative technology.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6">
        <div className="container mx-auto max-w-7xl">
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <PenTool className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No articles found</h3>
              <p className="text-kaki-grey">Check back later for fresh insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} className="group">
                  <Card className="bg-white/5 border-white/10 overflow-hidden h-full transition-all duration-500 hover:border-purple-500/30 hover:translate-y-[-8px] rounded-[2rem]">
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={resolveApiUrl(blog.image)} 
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-purple-600 text-white border-none px-3 py-1">
                          {blog.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-8 space-y-4">
                      <div className="flex items-center gap-4 text-xs text-kaki-grey">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {blog.author}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <p className="text-kaki-grey line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                      <div className="pt-4 flex items-center text-purple-400 font-bold group-hover:translate-x-2 transition-transform">
                        Read Story <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32 px-6">
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-[3rem] p-12 text-center border border-purple-500/20 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
          
          <h2 className="text-4xl font-bold text-white mb-6">Want Weekly Creativty Boost?</h2>
          <p className="text-xl text-kaki-grey mb-10 max-w-2xl mx-auto">
            Subscribe to the KAKI Newsletter and get the latest insights delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full px-8 py-4 w-full max-w-sm text-white focus:outline-none focus:border-purple-500"
            />
            <Button 
              size="lg" 
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="bg-white text-black hover:bg-gray-200 rounded-full px-10 font-bold"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
