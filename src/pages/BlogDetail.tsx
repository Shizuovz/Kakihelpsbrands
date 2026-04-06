import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL } from "@/config";
import { resolveApiUrl } from "@/utils/resolveApiUrl";
import { Calendar, User, ArrowLeft, Twitter, Linkedin, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/content/all`);
        const result = await response.json();
        const found = (result.data?.blogs || []).find((b: any) => (b.id || b._id).toString() === id);
        setBlog(found);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-kaki-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-kaki-black flex flex-col items-center justify-center text-center p-6 pt-32">
        <div className="w-16 h-1 w-12 bg-red-500 rounded-full mb-6"></div>
        <h2 className="text-4xl font-bold text-white mb-4">Article Not Found</h2>
        <p className="text-kaki-grey max-w-sm mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="bg-purple-600 rounded-full px-8">
          <Link to="/blogs">Explore More Stories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kaki-black text-white pt-24">
      {/* Article Hero */}
      <section className="pt-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
             <Button asChild variant="ghost" className="text-kaki-grey hover:text-white px-0 hover:bg-transparent">
              <Link to="/blogs" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> All Stories
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4 bg-white/10" />
            <Badge className="bg-purple-600/20 text-purple-400 border-none px-4 py-1">
              {blog.category}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-kaki-grey mb-16 px-4 py-3 bg-white/5 border border-white/10 rounded-full w-fit mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {blog.author.charAt(0)}
              </div>
              <span className="font-bold text-white/90">{blog.author}</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>{blog.date}</span>
            </div>
          </div>

          <div className="relative rounded-[3rem] overflow-hidden mb-20 bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-2xl shadow-purple-500/10 group">
            <img
              src={resolveApiUrl(blog.image)}
              alt={blog.title}
              className="w-full h-full object-cover aspect-video transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24 px-6 relative overflow-hidden">
        {/* Abstract shapes for visual flair */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-3xl">
          {/* Excerpt as a pull-quote */}
          <div className="mb-16 italic text-2xl md:text-3xl font-medium text-purple-200/80 leading-relaxed border-l-4 border-purple-500 pl-8 py-2 bg-purple-500/5 rounded-r-3xl pr-6">
            {blog.excerpt}
          </div>

          <div className="prose prose-invert prose-purple max-w-none 
                          prose-headings:text-white prose-headings:font-bold 
                          prose-p:text-gray-300 prose-p:text-xl prose-p:leading-relaxed 
                          prose-a:text-purple-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-white prose-strong:font-black
                          prose-blockquote:border-purple-500 prose-blockquote:bg-white/5 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-3xl
                          prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10
                          prose-code:text-purple-300 prose-code:bg-purple-950/40 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg
                          ">
            {/* Split content by double newline or use common formatting */}
            {blog.content.split('\n').map((line: string, idx: number) => {
              if (line.startsWith('![') && line.includes('](')) {
                const urlMatch = line.match(/\((.*?)\)/);
                if (urlMatch) {
                  return <img key={idx} src={resolveApiUrl(urlMatch[1])} alt="Blog content" className="w-full rounded-3xl border border-white/10 my-12 shadow-2xl" />;
                }
              }
              const parseInline = (text: string) => {
                // Very basic inline markdown parser for bold and italic
                let parts: any[] = [text];
                
                // Bold: **text**
                const boldRegex = /\*\*(.*?)\*\*/g;
                let newParts: any[] = [];
                parts.forEach(p => {
                    if (typeof p !== 'string') { newParts.push(p); return; }
                    let lastIdx = 0;
                    let match;
                    while ((match = boldRegex.exec(p)) !== null) {
                        newParts.push(p.substring(lastIdx, match.index));
                        newParts.push(<strong key={`bold-${match.index}`} className="text-white font-black">{match[1]}</strong>);
                        lastIdx = boldRegex.lastIndex;
                    }
                    newParts.push(p.substring(lastIdx));
                });
                parts = newParts.filter(p => p !== '');

                // Italic: *text*
                newParts = [];
                const italicRegex = /\*(.*?)\*/g;
                parts.forEach(p => {
                    if (typeof p !== 'string') { newParts.push(p); return; }
                    let lastIdx = 0;
                    let match;
                    while ((match = italicRegex.exec(p)) !== null) {
                        newParts.push(p.substring(lastIdx, match.index));
                        newParts.push(<em key={`italic-${match.index}`} className="text-purple-300 font-medium italic">{match[1]}</em>);
                        lastIdx = italicRegex.lastIndex;
                    }
                    newParts.push(p.substring(lastIdx));
                });
                parts = newParts.filter(p => p !== '');

                // Underline: <u>text</u>
                newParts = [];
                const underlineRegex = /<u>(.*?)<\/u>/g;
                parts.forEach(p => {
                    if (typeof p !== 'string') { newParts.push(p); return; }
                    let lastIdx = 0;
                    let match;
                    while ((match = underlineRegex.exec(p)) !== null) {
                        newParts.push(p.substring(lastIdx, match.index));
                        newParts.push(<u key={`underline-${match.index}`} className="decoration-purple-500/50">{match[1]}</u>);
                        lastIdx = underlineRegex.lastIndex;
                    }
                    newParts.push(p.substring(lastIdx));
                });
                parts = newParts.filter(p => p !== '');

                // Strikethrough: ~~text~~
                newParts = [];
                const strikeRegex = /~~(.*?)~~/g;
                parts.forEach(p => {
                    if (typeof p !== 'string') { newParts.push(p); return; }
                    let lastIdx = 0;
                    let match;
                    while ((match = strikeRegex.exec(p)) !== null) {
                        newParts.push(p.substring(lastIdx, match.index));
                        newParts.push(<del key={`strike-${match.index}`} className="opacity-50 line-through">{match[1]}</del>);
                        lastIdx = strikeRegex.lastIndex;
                    }
                    newParts.push(p.substring(lastIdx));
                });
                return newParts.filter(p => p !== '');
              };

              if (line.startsWith('## ')) return <h2 key={idx} className="mt-12 text-3xl font-bold">{parseInline(line.replace('## ', ''))}</h2>;
              if (line.startsWith('### ')) return <h3 key={idx} className="mt-10 text-2xl font-bold">{parseInline(line.replace('### ', ''))}</h3>;
              if (line.startsWith('> ')) return <blockquote key={idx} className="italic text-xl py-6 border-l-4 border-purple-500 pl-6 bg-white/5 my-8 rounded-r-2xl">{parseInline(line.replace('> ', ''))}</blockquote>;
              if (line.trim() === '') return <br key={idx} />;
              return <p key={idx}>{parseInline(line)}</p>;
            })}
          </div>

          {/* Social Share Bar */}
          <div className="mt-24 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-3xl shadow-xl">
             <div>
               <h4 className="text-xl font-bold text-white mb-2">Enjoyed the Read?</h4>
               <p className="text-kaki-grey">Share this article with your professional circle.</p>
             </div>
             <div className="flex items-center gap-4">
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                className="rounded-full border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Twitter className="w-5 h-5 text-sky-400" />
               </Button>
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="rounded-full border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Linkedin className="w-5 h-5 text-blue-500" />
               </Button>
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="rounded-full border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Facebook className="w-5 h-5 text-blue-600" />
               </Button>
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(window.location.href)}`}
                className="rounded-full border-white/10 hover:bg-white/10 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Mail className="w-5 h-5 text-purple-400" />
               </Button>
             </div>
          </div>

          {/* Back to Blog Button */}
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-12 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/20">
              <Link to="/blogs">Back To Blog Journal</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
