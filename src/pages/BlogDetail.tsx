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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center p-6 pt-32">
        <div className="w-16 h-1 w-12 bg-red-500 rounded-full mb-6"></div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h2>
        <p className="text-gray-600 max-w-sm mb-8">
          The blog post you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="bg-purple-600 rounded-full px-8">
          <Link to="/blogs">Explore More Stories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white text-gray-900 pt-24 ${blog.fontFamily === 'serif' ? 'font-serif' : blog.fontFamily === 'mono' ? 'font-mono' : 'font-sans'}`}>
      {/* Article Hero (Legacy or Image/Meta only if blocks) */}
      <section className="pt-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-8 flex items-center justify-center gap-4">
             <Button asChild variant="ghost" className="text-gray-500 hover:text-gray-900 px-0 hover:bg-transparent">
              <Link to="/blogs" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" /> All Stories
              </Link>
            </Button>
            {(!blog.blocks || blog.blocks.length === 0) && (
              <>
                <Separator orientation="vertical" className="h-4 bg-gray-300" />
                <Badge className="bg-purple-100 text-purple-600 border-none px-4 py-1">
                  {blog.category}
                </Badge>
              </>
            )}
          </div>
          
          {(!blog.blocks || blog.blocks.length === 0) && (
            <h1 className="text-4xl md:text-6xl font-black mb-10 tracking-tight leading-tight text-gray-900">
              {blog.title}
            </h1>
          )}

          <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-gray-600 mb-16 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full w-fit mx-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {blog.author.charAt(0)}
              </div>
              <span className="font-bold text-gray-800">{blog.author}</span>
            </div>
            <Separator orientation="vertical" className="h-4 bg-gray-300 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{blog.date}</span>
            </div>
          </div>

          {blog.image && (
            <div className="relative rounded-[3rem] overflow-hidden mb-20 bg-gray-100 border border-gray-200 shadow-2xl shadow-purple-500/5 group">
              <img
                src={resolveApiUrl(blog.image)}
                alt={blog.title || "Blog cover"}
                className="w-full h-full object-cover aspect-video transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-24 px-6 relative overflow-hidden">

        <div className="container mx-auto max-w-3xl">
          {/* Legacy Excerpt as a pull-quote */}
          {(!blog.blocks || blog.blocks.length === 0) && blog.excerpt && (
            <div className="mb-16 italic text-2xl md:text-3xl font-medium text-purple-800 leading-relaxed border-l-4 border-purple-500 pl-8 py-2 bg-purple-50 rounded-r-3xl pr-6">
              {blog.excerpt}
            </div>
          )}

          <div className="prose prose-purple max-w-none 
                          prose-headings:text-gray-900 prose-headings:font-bold 
                          prose-p:text-gray-700 prose-p:text-xl prose-p:leading-relaxed 
                          prose-a:text-purple-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-gray-900 prose-strong:font-black
                          prose-blockquote:border-purple-500 prose-blockquote:bg-gray-50 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-3xl
                          prose-img:rounded-[2rem] prose-img:border prose-img:border-gray-200
                          prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg
                          ">
            {blog.blocks && blog.blocks.length > 0 ? (
              <div className="">
                {blog.blocks.map((block: any, idx: number) => {
                  const getSizeClass = (defaultSize: string) => (block.fontSize && block.fontSize !== 'default') ? block.fontSize : defaultSize;
                  const getColorStyle = () => block.textColor ? { color: block.textColor } : undefined;
                  
                  const renderRichText = (text: string) => {
                    return text.split('\n').map((line, i) => {
                      let content = line;
                      let isBullet = false;
                      if (content.trim().startsWith('- ') || content.trim().startsWith('• ')) {
                        isBullet = true;
                        content = content.trim().substring(2);
                      }
                      
                      let parts: any[] = [content];
                      
                      let newParts: any[] = [];
                      parts.forEach(p => {
                        if (typeof p !== 'string') { newParts.push(p); return; }
                        const arr = p.split(/(\*\*.*?\*\*)/g);
                        arr.forEach((part, idx) => {
                          if (part.startsWith('**') && part.endsWith('**')) newParts.push(<strong key={`b-${idx}`} className="font-bold">{part.slice(2, -2)}</strong>);
                          else if (part) newParts.push(part);
                        });
                      });
                      parts = newParts;

                      newParts = [];
                      parts.forEach(p => {
                        if (typeof p !== 'string') { newParts.push(p); return; }
                        const arr = p.split(/(\*.*?\*)/g);
                        arr.forEach((part, idx) => {
                          if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) newParts.push(<em key={`i-${idx}`} className="italic">{part.slice(1, -1)}</em>);
                          else if (part) newParts.push(part);
                        });
                      });
                      parts = newParts;

                      newParts = [];
                      parts.forEach(p => {
                        if (typeof p !== 'string') { newParts.push(p); return; }
                        const arr = p.split(/(<u>.*?<\/u>)/g);
                        arr.forEach((part, idx) => {
                          if (part.startsWith('<u>') && part.endsWith('</u>')) newParts.push(<u key={`u-${idx}`} className="underline underline-offset-2">{part.slice(3, -4)}</u>);
                          else if (part) newParts.push(part);
                        });
                      });
                      parts = newParts;

                      newParts = [];
                      parts.forEach(p => {
                        if (typeof p !== 'string') { newParts.push(p); return; }
                        const arr = p.split(/(~~.*?~~)/g);
                        arr.forEach((part, idx) => {
                          if (part.startsWith('~~') && part.endsWith('~~')) newParts.push(<del key={`s-${idx}`} className="line-through opacity-70">{part.slice(2, -2)}</del>);
                          else if (part) newParts.push(part);
                        });
                      });
                      parts = newParts;

                      if (isBullet) {
                        return <li key={i} className="ml-6 list-disc mb-2">{parts}</li>;
                      }
                      return <p key={i} className="mb-2 last:mb-0">{parts}</p>;
                    });
                  };

                  if (block.type === 'kicker') return <p key={idx} className={`${getSizeClass('text-sm')} font-bold uppercase tracking-widest text-purple-600 mb-2`} style={getColorStyle()}>{block.content}</p>;
                  if (block.type === 'title') return <h1 key={idx} className={`${getSizeClass('text-4xl md:text-6xl')} font-black mb-6 tracking-tight leading-tight text-gray-900`} style={getColorStyle()}>{block.content}</h1>;
                  if (block.type === 'subtitle') return <h2 key={idx} className={`${getSizeClass('text-2xl')} text-gray-600 mb-8`} style={getColorStyle()}>{block.content}</h2>;
                  if (block.type === 'excerpt') return <blockquote key={idx} className={`italic ${getSizeClass('text-2xl md:text-3xl')} font-medium text-purple-800 leading-relaxed border-l-4 border-purple-500 pl-8 py-4 bg-purple-50 my-8 rounded-r-3xl pr-6`} style={getColorStyle()}>{block.content && renderRichText(block.content)}</blockquote>;
                  if (block.type === 'divider') return <hr key={idx} style={{ borderTopWidth: `${block.size || 1}px`, borderColor: block.color || 'rgba(229,231,235,1)' }} className="my-10" />;
                  if (block.type === 'heading') return <h2 key={idx} className={`mt-12 mb-6 ${getSizeClass('text-3xl')} font-bold`} style={getColorStyle()}>{block.content}</h2>;
                  if (block.type === 'paragraph') {
                    const spacingClass = block.spacing === 'none' ? 'mb-0' : 
                                         block.spacing === 'small' ? 'mb-4' : 
                                         block.spacing === 'medium' ? 'mb-8' : 
                                         block.spacing === 'large' ? 'mb-12' : 'mb-8';
                    return <div key={idx} className={`${block.fontSize && block.fontSize !== 'default' ? block.fontSize : ''} ${spacingClass}`} style={getColorStyle()}>{block.content && renderRichText(block.content)}</div>;
                  }
                  if (block.type === 'callout') {
                    const borderColor = block.calloutBorderColor || '#10b981';
                    const bgColor = block.calloutBgColor || '#ecfdf5';
                    const titleColor = block.calloutTitleColor || '#047857';

                    return (
                      <div key={idx} className="my-8 p-6 rounded-r-xl border-l-[6px] shadow-sm" style={{ borderLeftColor: borderColor, backgroundColor: bgColor }}>
                        {block.calloutTitle && (
                          <h4 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: titleColor }}>
                            {block.calloutTitle}
                          </h4>
                        )}
                        <div className="text-gray-800 text-lg leading-relaxed">
                          {block.content && renderRichText(block.content)}
                        </div>
                      </div>
                    );
                  }
                  if (block.type === 'table') {
                    let tableData: string[][] = [];
                    try { tableData = JSON.parse(block.content || '[]'); } catch (e) { tableData = []; }
                    if (tableData.length === 0) return null;
                    
                    const borderSize = block.tableBorderSize !== undefined ? `${block.tableBorderSize}px` : '1px';
                    const borderColor = block.tableBorderColor || '#e5e7eb';
                    const headerBg = block.tableHeaderBg || '#f9fafb';
                    const headerColor = block.tableHeaderColor || '#111827';
                    
                    const tableStyle = { borderCollapse: 'collapse' as const };
                    const thStyle = { border: `${borderSize} solid ${borderColor}`, backgroundColor: headerBg, color: headerColor };
                    const tdStyle = { border: `${borderSize} solid ${borderColor}` };

                    return (
                      <div key={idx} className="overflow-x-auto my-12 rounded-2xl shadow-xl bg-white">
                        <table className="w-full text-left" style={tableStyle}>
                          <thead>
                            <tr>
                              {tableData[0]?.map((head: string, i: number) => (
                                <th key={i} style={thStyle} className="px-6 py-4 text-sm font-bold text-gray-900 uppercase tracking-wider">{head}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.slice(1).map((row: string[], rI: number) => (
                              <tr key={rI} className="hover:bg-gray-50/50 transition-colors">
                                {row.map((cell: string, cI: number) => (
                                  <td key={cI} style={tdStyle} className="px-6 py-4 text-gray-700 whitespace-pre-wrap">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  if (block.type === 'image') {
                    const sizeClass = block.imageSize === 'small' ? 'w-full md:w-1/3' : 
                                      block.imageSize === 'medium' ? 'w-full md:w-1/2' : 
                                      block.imageSize === 'large' ? 'w-full md:w-3/4' : 'w-full';
                    const alignClass = block.imageAlignment === 'left' ? 'justify-start' : 
                                       block.imageAlignment === 'right' ? 'justify-end' : 'justify-center';
                    const radiusClass = block.imageRadius === 'none' ? 'rounded-none' : 
                                        block.imageRadius === 'small' ? 'rounded-md' : 
                                        block.imageRadius === 'medium' ? 'rounded-xl' : 
                                        block.imageRadius === 'full' ? 'rounded-full' : 'rounded-3xl';
                    return (
                      <div key={idx} className={`flex ${alignClass} my-12`}>
                        <img src={resolveApiUrl(block.content)} alt="Blog content block" className={`${sizeClass} ${radiusClass} border border-gray-200 shadow-2xl`} />
                      </div>
                    );
                  }
                  if (block.type === 'quote') return <blockquote key={idx} className={`italic ${getSizeClass('text-xl')} py-6 border-l-4 border-purple-500 pl-6 bg-gray-50 my-8 rounded-r-2xl text-purple-800`}>{block.content && renderRichText(block.content)}</blockquote>;
                  if (block.type === 'video') return <div key={idx} className="my-12 aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-200"><video src={resolveApiUrl(block.content)} controls className="w-full h-full object-cover" /></div>;
                  return null;
                })}
              </div>
            ) : (
              <div className="legacy-content-renderer">
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
                            newParts.push(<strong key={`bold-${match.index}`} className="text-gray-900 font-black">{match[1]}</strong>);
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
                            newParts.push(<em key={`italic-${match.index}`} className="text-purple-800 font-medium italic">{match[1]}</em>);
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
                  if (line.startsWith('> ')) return <blockquote key={idx} className="italic text-xl py-6 border-l-4 border-purple-500 pl-6 bg-gray-50 my-8 rounded-r-2xl">{parseInline(line.replace('> ', ''))}</blockquote>;
                  if (line.trim() === '') return <br key={idx} />;
                  return <p key={idx}>{parseInline(line)}</p>;
                })}
              </div>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="mt-24 p-8 bg-gray-50 border border-gray-200 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
             <div>
               <h4 className="text-xl font-bold text-gray-900 mb-2">Enjoyed the Read?</h4>
               <p className="text-gray-600">Share this article with your professional circle.</p>
             </div>
             <div className="flex items-center gap-4">
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog.title)}`, '_blank')}
                className="rounded-full border-gray-200 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Twitter className="w-5 h-5 text-sky-500" />
               </Button>
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="rounded-full border-gray-200 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Linkedin className="w-5 h-5 text-blue-600" />
               </Button>
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="rounded-full border-gray-200 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Facebook className="w-5 h-5 text-blue-700" />
               </Button>
               <Button 
                size="icon" 
                variant="outline" 
                onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(blog.title)}&body=${encodeURIComponent(window.location.href)}`}
                className="rounded-full border-gray-200 hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all h-12 w-12"
               >
                 <Mail className="w-5 h-5 text-purple-600" />
               </Button>
             </div>
          </div>

          {/* Back to Blog Button */}
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-12 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/10">
              <Link to="/blogs">Back To Blog Journal</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;
