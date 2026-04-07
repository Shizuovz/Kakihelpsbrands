import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock, Instagram, Youtube, Facebook, ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Contact = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    companyName: '',
    email: '',
    phone: '',
    location: '',
    
    // Step 2
    industry: '',
    industryOther: '',
    businessBrief: '',
    onlinePresence: '',
    onlineLinks: '',
    
    // Step 3
    serviceType: '',
    serviceTypeOther: '',
    message: '', // Using common 'message' for project description
    mainGoal: '',
    
    // Step 4
    budget: '',
    timeline: '',
    
    // Step 5
    referralSource: '',
    referralOther: '',
    additionalNotes: ''
  });
  const { toast } = useToast();

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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check: Don't submit if we're not on the final step
    if (currentStep < 4) {
      nextStep();
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: `Project Inquiry: ${formData.serviceType || 'New Project'}`,
          type: 'detailed_contact_form'
        }),
      });

      if (response.ok) {
        toast({
          title: "Inquiry Sent! 🚀",
          description: "Thank you for reaching out. We will get back to you within 24-48 hours!",
        });
        // Reset form and go back to step 1
        setFormData({
          name: '', companyName: '', email: '', phone: '', location: '',
          industry: '', industryOther: '', businessBrief: '', onlinePresence: '', onlineLinks: '',
          serviceType: '', serviceTypeOther: '', message: '', mainGoal: '',
          budget: '', timeline: '',
          referralSource: '', referralOther: '', additionalNotes: ''
        });
        setCurrentStep(0);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Something went wrong. Please try again or email us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentStep < 4) {
        nextStep();
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    // Basic validation for current step
    if (currentStep === 0) {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({ title: "Required Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.industry) {
        toast({ title: "Required Field", description: "Please select an industry.", variant: "destructive" });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.serviceType || !formData.message || !formData.mainGoal) {
        toast({ title: "Required Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.budget || !formData.timeline) {
        toast({ title: "Required Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const departments = [
    { name: 'KAKI Studio', focus: 'Video, Photography, Post-Production', icon: '🎬', color: 'from-purple-500 to-blue-600' },
    { name: 'KAKI Marketing', focus: 'Digital Strategy, Media Buying, Influencer Campaigns', icon: '📱', color: 'from-green-500 to-teal-600' },
    { name: 'KAKI Design', focus: 'Brand Identity, UI/UX, Packaging Design', icon: '🎨', color: 'from-pink-500 to-red-600' },
    { name: 'KAKI Tech', focus: 'Web Development, App Development, Software Solutions, AR Development', icon: '💻', color: 'from-yellow-500 to-orange-600' }
  ];

  const contactInfo = [
    {
      title: 'General Inquiries',
      email: 'connect@kakihelpsbrands.com',
      description: 'For general questions and collaboration opportunities',
      icon: <Mail className="w-6 h-6" />,
      color: 'from-blue-500 to-purple-600',
      type: 'email'
    },
    {
      title: 'New Business',
      info: '88374 02472',
      description: 'Ready to start a project? Let\'s discuss your vision',
      icon: <Phone className="w-6 h-6" />,
      color: 'from-green-500 to-teal-600',
      type: 'phone'
    },
    {
      title: 'Careers',
      email: 'connect@kakihelpsbrands.com',
      description: 'Join our creative team and craft culture with us',
      icon: <MapPin className="w-6 h-6" />,
      color: 'from-pink-500 to-red-600',
      type: 'email'
    }
  ];

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, url: 'https://instagram.com/kaki_marketing', label: 'Instagram', followers: '5K+' },
    { icon: <Youtube className="w-5 h-5" />, url: 'https://youtube.com/@kaki9139', label: 'YouTube', followers: '22K+' },
    { icon: <Facebook className="w-5 h-5" />, url: 'https://facebook.com/KAKIMarketing', label: 'Facebook', followers: '590+' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, url: 'https://twitter.com/KAKImarketing', label: 'X (Twitter)', followers: '100+' },
    { icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, url: 'https://in.linkedin.com/company/kakimarketing', label: 'LinkedIn', followers: '200+' },
  ];

  const faqs = [
    {
      question: "What is KAKI Marketing?",
      answer: "Founded in 2021, KAKI is a full-stack creative agency from Nagaland that helps brands grow through strategy, storytelling, design, technology, and events turning bold ideas into real impact."
    },
    {
      question: "Where is your office located?",
      answer: "Our office is located at 132 B, 2½ Mile, Darogapather, Dimapur, Nagaland."
    },
    {
      question: "What services does KAKI Studio offer?",
      answer: "KAKI Studio provides end-to-end media production, including video production, photography, animation, and post-production."
    },
    {
      question: "What services does KAKI Marketing offer?",
      answer: "KAKI Marketing delivers digital strategy, media buying, and influencer marketing focused on ROI, brand awareness, and audience growth."
    },
    {
      question: "What services does KAKI Design offer?",
      answer: "KAKI Design offers brand identity, UI/UX design, and packaging solutions from logos to complete brand systems."
    },
    {
      question: "What services does KAKI Tech offer?",
      answer: "KAKI Tech provides web and app development, custom software, and AR experiences."
    },
    {
      question: "How do I start a project with KAKI?",
      answer: "Click “Contact” on the top-right of the website or select a project poster and click “Start Your Project.” You can also email us at connect@kakihelpsbrands.com or DM us."
    },
    {
      question: "Do I need to register to start a project with KAKI?",
      answer: "No, registration is not required. Simply click on the “Contact” option, fill in the required details, and submit your message. Our team will get in touch with you to get started."
    },
    {
      question: "What is the typical project budget?",
      answer: "We don’t follow fixed packages. Each project is customized based on your goals and needs, either through a tailored strategy after consultation or by working within your existing budget."
    },
    {
      question: "What is the typical project timeline?",
      answer: "Timelines vary based on scope, with flexible options: ASAP, 1–3 months, 3–6 months, or 6+ months."
    },
    {
      question: "What are your office hours?",
      answer: "Our office is open Monday to Saturday from 10:00 AM to 5:00 PM. We remain closed on Sundays."
    },
    {
      question: "Are you active on social media?",
      answer: "Yes, we maintain an active presence on Instagram, YouTube, Facebook, and LinkedIn. Follow our journey on these platforms."
    },
    {
      question: "Do you offer influencer marketing?",
      answer: "Yes. We help identify the right influencers, manage collaborations, track performance, and ensure authentic engagement."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide customer support via calls, WhatsApp, direct messages, and emails."
    }
  ];

  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-kaki-black via-purple-900/30 to-kaki-black">
        <div className="container-custom">
          <div className="text-center mb-16 fade-in-on-scroll">
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-xl lg:text-2xl text-kaki-grey max-w-4xl mx-auto leading-relaxed">
              Have a question or want to learn more about KAKI? Send us an inquiry and we'll be happy to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16">
            {/* Detailed Multi-step Contact Form */}
            <div className="xl:col-span-2 fade-in-on-scroll">
              <div className="bg-gradient-to-br from-kaki-dark-grey/80 to-kaki-black/90 p-8 lg:p-12 rounded-3xl border border-purple-500/20 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl group-hover:bg-pink-600/20 transition-all duration-700"></div>

                <div className="relative z-10">
                  <div className="mb-10">
                    <h2 className="text-3xl font-bold mb-2 text-white">Want to Start A Project with KAKI Marketing?</h2>
                    <p className="text-kaki-grey text-lg">Greetings from the KAKI Team. Please fill out this form so we can understand your business and project requirements better.</p>
                  </div>

                  {/* Progress Wrapper */}
                  <div className="mb-12">
                    <div className="flex justify-between mb-4">
                      {[1, 2, 3, 4, 5].map((step) => (
                        <div 
                          key={step} 
                          className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                            currentStep + 1 >= step ? 'opacity-100' : 'opacity-40'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ${
                            currentStep + 1 === step 
                              ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] scale-110' 
                              : currentStep + 1 > step 
                                ? 'bg-green-500 border-green-400 text-white' 
                                : 'bg-kaki-black/50 border-white/10 text-kaki-grey'
                          }`}>
                            {currentStep + 1 > step ? '✓' : step}
                          </div>
                          <span className="text-[10px] uppercase tracking-widest font-bold hidden md:block">
                            {['Contact', 'Business', 'Project', 'Timeline', 'Final'][step - 1]}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-700 ease-out"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-8 min-h-[400px] flex flex-col">
                    {/* Step 1: Contact Information */}
                    {currentStep === 0 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-sm">01</span>
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder-white/20"
                              onKeyDown={handleKeyDown}
                              placeholder="e.g. John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Company / Brand Name</label>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleChange}
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder-white/20"
                              onKeyDown={handleKeyDown}
                              placeholder="Your brand name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder-white/20"
                              onKeyDown={handleKeyDown}
                              placeholder="hello@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Phone Number (WhatsApp preferred) *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder-white/20"
                              onKeyDown={handleKeyDown}
                              placeholder="+91 XXXXX XXXXX"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Location (City/ Town)</label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleChange}
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder-white/20"
                              onKeyDown={handleKeyDown}
                              placeholder="Dimapur, Nagaland"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Business Details */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-sm">02</span>
                          Business Details
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-white/70 ml-1">Industry / Category *</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                'E-commerce', 'Food & Beverage', 'Fashion', 'Events & Entertainment', 
                                'Hospitality', 'Personal Brand', 'Government Organization', 
                                'Business Organization', 'Nonprofit (NGO)', 'Other'
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, industry: opt })}
                                  className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                                    formData.industry === opt 
                                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            {formData.industry === 'Other' && (
                              <input
                                type="text"
                                name="industryOther"
                                value={formData.industryOther}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Please specify industry"
                                className="w-full mt-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all text-white"
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Brief about your business</label>
                            <textarea
                              name="businessBrief"
                              value={formData.businessBrief}
                              onChange={handleChange}
                              rows={3}
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 transition-all text-white placeholder-white/20 resize-none"
                              onKeyDown={handleKeyDown}
                              placeholder="Tell us what you do..."
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium text-white/70 ml-1">Do you have an existing online presence?</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {['Yes (Website)', 'Yes (Social Media)', 'Both', 'No'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, onlinePresence: opt })}
                                  className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                                    formData.onlinePresence === opt 
                                      ? 'bg-pink-600/20 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.2)]' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            {formData.onlinePresence !== 'No' && formData.onlinePresence !== '' && (
                              <input
                                type="text"
                                name="onlineLinks"
                                value={formData.onlineLinks}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Share links (Website / Instagram / etc.)"
                                className="w-full mt-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-pink-500/50 transition-all text-white"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Project Requirements */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">03</span>
                          Project Requirements
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-white/70 ml-1">What type of service are you looking for? *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {[
                                'Digital Marketing', 'Influencer Marketing', 'Social Media Marketing', 
                                'Website Development', 'Software Development', 'App Development', 
                                'UI/ UX Design', 'Media Production', 'Packaging Design', 
                                'Branding & Identity', 'Consultation', 'Other'
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, serviceType: opt })}
                                  className={`px-4 py-2 rounded-xl border transition-all text-xs font-bold ${
                                    formData.serviceType === opt 
                                      ? 'bg-blue-600/20 border-blue-500 text-white' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            {formData.serviceType === 'Other' && (
                              <input
                                type="text"
                                name="serviceTypeOther"
                                value={formData.serviceTypeOther}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Please specify service"
                                className="w-full mt-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all text-white"
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Describe your project / requirement *</label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              rows={4}
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder-white/20 resize-none"
                              onKeyDown={handleKeyDown}
                              placeholder="Tell us what you want to achieve..."
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-sm font-medium text-white/70 ml-1">What is your main goal? *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {[
                                'Increase brand awareness', 'Generate leads', 'Increase sales', 
                                'Launch product/ service', 'Improve online presence', 'Other'
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, mainGoal: opt })}
                                  className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                                    formData.mainGoal === opt 
                                      ? 'bg-blue-600/20 border-blue-500 text-white' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Budget & Timeline */}
                    {currentStep === 3 && (
                      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-sm">04</span>
                          Budget & Timeline
                        </h3>
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-sm font-medium text-white/70 ml-1">Estimated Budget for this project *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {[
                                'Below ₹10,000', '₹10,000 – ₹25,000', '₹25,000 – ₹50,000', 
                                '₹50,000+', 'Prefer to discuss'
                              ].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, budget: opt })}
                                  className={`px-4 py-4 rounded-2xl border transition-all text-sm font-bold ${
                                    formData.budget === opt 
                                      ? 'bg-yellow-600/20 border-yellow-500 text-white shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-sm font-medium text-white/70 ml-1">Project Timeline *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                              {['ASAP', '1 – 3 months', '3 – 6 months', '6+ months'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, timeline: opt })}
                                  className={`px-4 py-4 rounded-2xl border transition-all text-sm font-bold ${
                                    formData.timeline === opt 
                                      ? 'bg-orange-600/20 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Final Details */}
                    {currentStep === 4 && (
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-sm">05</span>
                          Final Details
                        </h3>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-white/70 ml-1">How did you hear about us? *</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {['Instagram', 'YouTube', 'Facebook', 'LinkedIn', 'Website', 'Referral', 'Other'].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setFormData({ ...formData, referralSource: opt })}
                                  className={`px-4 py-3 rounded-xl border transition-all text-xs font-bold ${
                                    formData.referralSource === opt 
                                      ? 'bg-green-600/20 border-green-500 text-white' 
                                      : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                            {formData.referralSource === 'Other' && (
                              <input
                                type="text"
                                name="referralOther"
                                value={formData.referralOther}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Please specify"
                                className="w-full mt-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-green-500/50 transition-all text-white"
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 ml-1">Any additional notes or expectations?</label>
                            <textarea
                              name="additionalNotes"
                              value={formData.additionalNotes}
                              onChange={handleChange}
                              rows={4}
                              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-green-500/50 transition-all text-white placeholder-white/20 resize-none"
                              onKeyDown={handleKeyDown}
                              placeholder="Anything else we should know?"
                            />
                          </div>
                          
                          <div className="pt-4 p-6 bg-purple-500/5 rounded-2xl border border-purple-500/10 text-center">
                            <p className="text-sm text-kaki-grey italic">
                              Our team will review your details and get in touch with you within 24–48 hours.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-auto pt-10 flex gap-4">
                      {currentStep > 0 && (
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setCurrentStep(prev => prev - 1)}
                          className="flex-1 border-white/10 text-white hover:bg-white/10 py-7 rounded-2xl text-lg font-bold transition-all"
                        >
                          Back
                        </Button>
                      )}
                      
                      {currentStep < 4 ? (
                        <Button 
                          type="button" 
                          onClick={nextStep}
                          className="flex-[2] bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-purple-600/20 group"
                        >
                          Next Step
                          <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                        </Button>
                      ) : (
                        <Button 
                          type="button" 
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex-[2] bg-gradient-to-r from-green-600 to-teal-600 text-white hover:opacity-90 py-7 rounded-2xl text-lg font-bold shadow-xl shadow-green-600/20"
                        >
                          {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="fade-in-on-scroll animation-delay-200">
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8 text-white">Let's Connect</h2>
                
                {contactInfo.map((info) => (
                  <div key={info.title} className={`p-6 bg-gradient-to-r ${info.color} rounded-2xl hover-lift`}>
                    <div className="flex items-center mb-3">
                      <div className="mr-3 text-white">
                        {info.icon}
                      </div>
                      <h3 className="font-bold text-white">{info.title}</h3>
                    </div>
                    {info.type === 'email' ? (
                      <a 
                        href={`mailto:${info.email}`}
                        className="text-white hover:text-white/80 transition-colors block mb-2 font-medium"
                      >
                        {info.email}
                      </a>
                    ) : (
                      <a 
                        href={`tel:${info.info?.replace(/\s/g, '')}`}
                        className="text-white hover:text-white/80 transition-colors block mb-2 font-medium"
                      >
                        {info.info}
                      </a>
                    )}
                    <p className="text-white/80 text-sm">{info.description}</p>
                  </div>
                ))}

                {/* Office Hours */}
                <div className="p-6 bg-kaki-dark-grey rounded-2xl border border-purple-500/20">
                  <div className="flex items-center mb-3">
                    <Clock className="w-6 h-6 mr-3 text-purple-400" />
                    <h3 className="font-bold text-white">Office Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-kaki-grey">Mon - Sat</span>
                      <span className="text-white">10:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-kaki-grey">Sunday</span>
                      <span className="text-white">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="p-6 bg-kaki-dark-grey rounded-2xl border border-purple-500/20">
                  <h3 className="font-bold text-white mb-6">Follow Our Journey</h3>
                  <div className="space-y-4">
                    {socialLinks.map((social) => (
                      <a 
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-kaki-black/50 rounded-xl hover:bg-kaki-black/80 transition-colors group"
                      >
                        <div className="flex items-center">
                          <div className="mr-3 text-purple-400 group-hover:text-white transition-colors">
                            {social.icon}
                          </div>
                          <span className="text-white">{social.label}</span>
                        </div>
                        <span className="text-kaki-grey text-sm">{social.followers}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-kaki-dark-grey/30">
        <div className="container-custom">
          <div className="fade-in-on-scroll">
            <div className="bg-gradient-to-br from-kaki-dark-grey to-kaki-black rounded-3xl overflow-hidden border border-purple-500/20">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Live Map Embed */}
                <div className="h-[400px] lg:h-auto min-h-[400px]">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3589.4258511746766!2d93.75454789999999!3d25.8883677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3745e2884f84c2af%3A0x7fdf085888fbe84a!2sKAKI!5e0!3m2!1sen!2sin!4v1774951655321!5m2!1sen!2sin"
                    className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Office Details */}
                <div className="p-8 lg:p-12 flex flex-col justify-center text-center lg:text-left">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto lg:mx-0 shadow-lg shadow-purple-500/20">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">Visit Our Creative Space</h3>
                  <p className="text-xl text-kaki-grey mb-4">132 B, 2 ½ Mile, Darogapather<br />Dimapur, Nagaland</p>
                  <p className="text-kaki-grey mb-8 leading-relaxed max-w-md">
                    Come visit our creative headquarters where culture is crafted daily. 
                    Explore our studios, meet the visionary team, and experience the future of branding.
                  </p>
                  <div>
                    <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-10 shadow-lg shadow-purple-600/30">
                      <a href="https://maps.app.goo.gl/Rgc2vsCGmdVHW3GF7" target="_blank" rel="noopener noreferrer">
                        Schedule a Visit
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-kaki-black">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3 fade-in-on-scroll">
              <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-2xl mb-6">
                <HelpCircle className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
              <p className="text-kaki-grey text-lg leading-relaxed mb-8">
                Find quick answers to common questions about our services, process, and how we can help your brand grow.
              </p>
              <div className="p-6 bg-kaki-dark-grey/50 rounded-3xl border border-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4 text-white">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  <span className="font-bold lowercase">Still have questions?</span>
                </div>
                <p className="text-sm text-kaki-grey mb-6 leading-relaxed">
                  Can't find what you're looking for? Reach out through the form and our team will be in touch within 24 hours.
                </p>
              </div>
            </div>

            <div className="lg:w-2/3 fade-in-on-scroll animation-delay-200">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border-none bg-kaki-dark-grey/30 hover:bg-kaki-dark-grey/50 rounded-3xl overflow-hidden px-8 transition-all duration-300 border border-white/5"
                  >
                    <AccordionTrigger className="text-white hover:text-purple-400 text-lg font-bold py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-kaki-grey text-base leading-relaxed pb-8">
                      {faq.answer && <p>{faq.answer}</p>}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
