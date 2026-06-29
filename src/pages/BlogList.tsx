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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      {/* Hero Section */}
      <section className="px-6 mb-20 text-center">
        <div className="container mx-auto">
          <Badge className="bg-purple-100 text-purple-600 border-purple-200 mb-6 px-4 py-1">
            THE KAKI JOURNAL
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
            Stories of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Creativity</span> & Insight
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explorations into brand strategy, digital storytelling, and the future of creative technology.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6">
        <div className="container mx-auto max-w-7xl">
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <PenTool className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No articles found</h3>
              <p className="text-gray-600">Check back later for fresh insights.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog.id} to={`/blogs/${blog.id}`} className="group">
                  <Card className={`bg-white border-gray-200 overflow-hidden h-full transition-all duration-500 hover:border-purple-300 hover:shadow-xl hover:translate-y-[-8px] rounded-[2rem] flex flex-col ${!blog.image ? 'justify-center bg-gradient-to-br from-purple-50/30 to-white border-purple-100/50' : ''}`}>
                    {blog.image && (
                      <div className="aspect-video relative overflow-hidden shrink-0">
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
                    )}
                    <CardContent className={`p-8 space-y-4 flex-grow flex flex-col ${!blog.image ? 'pt-10' : ''}`}>
                      {!blog.image && blog.category && (
                        <div className="mb-2">
                          <Badge className="bg-purple-100 text-purple-700 border-none px-3 py-1">
                            {blog.category}
                          </Badge>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {blog.author}
                        </div>
                      </div>
                      <h3 className={`font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-tight ${!blog.image ? 'text-3xl' : 'text-2xl'}`}>
                        {blog.title || (blog.blocks?.find((b: any) => b.type === 'title')?.content) || 'Untitled'}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 leading-relaxed flex-grow">
                        {blog.excerpt || (blog.blocks?.find((b: any) => b.type === 'excerpt')?.content) || (blog.blocks?.find((b: any) => b.type === 'paragraph')?.content) || ''}
                      </p>
                      <div className="pt-4 flex items-center text-purple-600 font-bold group-hover:translate-x-2 transition-transform mt-auto">
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
        <div className="container mx-auto max-w-5xl bg-gradient-to-br from-purple-50 to-blue-50 rounded-[3rem] p-12 text-center border border-purple-100 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 blur-[100px] pointer-events-none opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 blur-[100px] pointer-events-none opacity-50" />
          
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Want Weekly Creativity Boost?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Subscribe to the KAKI Newsletter and get the latest insights delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-8 py-4 w-full max-w-sm text-gray-900 focus:outline-none focus:border-purple-500 shadow-sm"
            />
            <Button 
              size="lg" 
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-10 font-bold shadow-md"
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
