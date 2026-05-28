import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Info, Mail, Phone, MapPin, ArrowRight, ChevronRight, Check, ShieldAlert, Key } from 'lucide-react';

const Disclaimer = () => {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'cookie' | 'ip'>('disclaimer');
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.disclaimer-section');
      let currentSection = '';
      
      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        if (top < 150) {
          currentSection = heading.id;
        }
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const disclaimerOutline = [
    { id: 'd1', title: '1. General Disclaimer' },
    { id: 'd2', title: '2. No Professional Advice' },
    { id: 'd3', title: '3. Marketing & Campaign Results' },
    { id: 'd4', title: '4. SEO & Search Rankings' },
    { id: 'd5', title: '5. Platform Policies' },
    { id: 'd6', title: '6. Website Downtime' },
    { id: 'd7', title: '7. External Links' },
    { id: 'd8', title: '8. Intellectual Property' },
    { id: 'd9', title: '9. Accuracy of Information' },
    { id: 'd10', title: '10. Limitation of Liability' },
    { id: 'd11', title: '11. Jurisdiction' }
  ];

  const cookieOutline = [
    { id: 'c1', title: '1. What Are Cookies?' },
    { id: 'c2', title: '2. Why We Use Cookies' },
    { id: 'c3', title: '3. Types of Cookies We Use' },
    { id: 'c4', title: '4. Cookie Duration' },
    { id: 'c5', title: '5. How to Manage Cookies' },
    { id: 'c6', title: '6. Advertising Opt-Outs' },
    { id: 'c7', title: '7. Consent' },
    { id: 'c8', title: '8. Policy Updates' },
    { id: 'c9', title: '9. Contact' }
  ];

  const ipOutline = [
    { id: 'i1', title: '1. Ownership of Creative Work' },
    { id: 'i2', title: '2. KAKI\'s Own IP' },
    { id: 'i3', title: '3. Client-Commissioned Work' },
    { id: 'i4', title: '4. Specific Asset Types' },
    { id: 'i5', title: '5. Client-Provided Content' },
    { id: 'i6', title: '6. Third-Party Licensed Assets' },
    { id: 'i7', title: '7. Portfolio & Case Study Rights' },
    { id: 'i8', title: '8. Unauthorised Use' },
    { id: 'i9', title: '9. Moral Rights' },
    { id: 'i10', title: '10. Licencing Enquiries' },
    { id: 'i11', title: '11. Contact' }
  ];

  return (
    <div className="min-h-screen pt-24 bg-kaki-black text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-kaki-black via-purple-950/15 to-kaki-black z-0 pointer-events-none" />
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 relative z-10">
        <div className="container-custom text-center max-w-4xl">
          <div className="inline-flex p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 mb-6 animate-pulse">
            <Info className="w-6 h-6" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Disclaimers & Policies
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-kaki-grey max-w-2xl mx-auto mb-10 leading-relaxed">
            Please select a section below to review KAKI's general disclaimers, cookie tracking policy, or creative intellectual property conditions.
          </p>

          {/* Premium Tab Swapper */}
          <div className="flex flex-col sm:flex-row justify-center p-1.5 bg-white/5 border border-white/10 rounded-2xl max-w-2xl mx-auto backdrop-blur-md gap-1">
            <button
              onClick={() => setActiveTab('disclaimer')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'disclaimer'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-kaki-grey hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              General Disclaimer
            </button>
            <button
              onClick={() => setActiveTab('cookie')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'cookie'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-kaki-grey hover:text-white hover:bg-white/5'
              }`}
            >
              <Info className="w-4 h-4" />
              Cookie Policy
            </button>
            <button
              onClick={() => setActiveTab('ip')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'ip'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-kaki-grey hover:text-white hover:bg-white/5'
              }`}
            >
              <Key className="w-4 h-4" />
              Intellectual Property
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="pb-24 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sidebar Sticky Navigation (Visible on Desktop) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-32 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 px-2">
                Section Outline
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'disclaimer' &&
                  disclaimerOutline.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                        activeSection === sec.id
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-kaki-grey hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                        activeSection === sec.id ? 'opacity-100 text-purple-300' : ''
                      }`} />
                    </button>
                  ))}
                {activeTab === 'cookie' &&
                  cookieOutline.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                        activeSection === sec.id
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-kaki-grey hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                        activeSection === sec.id ? 'opacity-100 text-purple-300' : ''
                      }`} />
                    </button>
                  ))}
                {activeTab === 'ip' &&
                  ipOutline.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                        activeSection === sec.id
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-kaki-grey hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                        activeSection === sec.id ? 'opacity-100 text-purple-300' : ''
                      }`} />
                    </button>
                  ))}
              </nav>
            </div>

            {/* Document Contents */}
            <div className="lg:col-span-8 bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md">
              {activeTab === 'disclaimer' && (
                // --- GENERAL DISCLAIMER ---
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Disclaimer</h2>
                    <div className="text-sm text-kaki-grey mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-6">
                      <span><strong>Effective Date:</strong> May 28, 2026</span>
                    </div>
                  </div>

                  {/* Section d1 */}
                  <div id="d1" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">1. General Disclaimer</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        The information published on the KAKI website is provided for general informational purposes only. While we strive to keep content accurate, up to date, and useful, we make no warranties — express or implied — about the completeness, accuracy, or reliability of any content on this site.
                      </p>
                      <p>
                        Use of this website and reliance on any information published here is entirely at your own risk.
                      </p>
                    </div>
                  </div>

                  {/* Section d2 */}
                  <div id="d2" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">2. No Professional Advice</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Nothing on this website constitutes legal, financial, tax, technical, or professional advice of any kind. Content published on our blog, portfolio, case studies, or elsewhere on the site is informational and should not be treated as a substitute for expert consultation.
                      </p>
                      <p>
                        If you require specific professional advice, we strongly recommend consulting a qualified professional in the relevant field.
                      </p>
                    </div>
                  </div>

                  {/* Section d3 */}
                  <div id="d3" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">3. Marketing and Campaign Results</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Case studies, portfolio examples, testimonials, and performance data shared on our website reflect the results of specific past projects. These outcomes are presented honestly but should not be interpreted as guarantees or benchmarks for future results.
                      </p>
                      <p>
                        Every business is different. Marketing outcomes depend on a wide range of variables — including industry, competition, budget, market timing, and audience — that are unique to each situation. Past performance is not a reliable indicator of future results.
                      </p>
                    </div>
                  </div>

                  {/* Section d4 */}
                  <div id="d4" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">4. SEO and Search Engine Rankings</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Any mention of SEO improvements, search rankings, or organic traffic growth on this website refers to general service capabilities, not guaranteed outcomes. Search engine algorithms are managed by third parties (such as Google) and change frequently. KAKI cannot guarantee that any website will achieve or maintain specific rankings.
                      </p>
                    </div>
                  </div>

                  {/* Section d5 */}
                  <div id="d5" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">5. Advertising Platform Policies</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Digital advertising services (Google Ads, Meta Ads, and others) are subject to the policies of those platforms. These policies change without notice and may affect the performance, reach, or availability of campaigns. KAKI is not responsible for decisions made by advertising platforms, including ad disapprovals, account suspensions, or policy enforcement actions.
                      </p>
                    </div>
                  </div>

                  {/* Section d6 */}
                  <div id="d6" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">6. Website Availability and Downtime</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        We aim to keep our website running smoothly and reliably, but we cannot guarantee uninterrupted access. Our website may be temporarily unavailable due to scheduled maintenance, technical issues, hosting outages, or circumstances beyond our control.
                      </p>
                      <p>
                        KAKI is not liable for any inconvenience, loss, or damage resulting from website downtime or unavailability.
                      </p>
                    </div>
                  </div>

                  {/* Section d7 */}
                  <div id="d7" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">7. External Links</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Our website may include links to third-party websites, resources, or platforms for your convenience. These links do not constitute an endorsement of those websites or their content. KAKI has no control over third-party sites and is not responsible for their content, accuracy, or privacy practices.
                      </p>
                    </div>
                  </div>

                  {/* Section d8 */}
                  <div id="d8" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">8. Intellectual Property</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        All content on this website — including text, images, graphics, logos, video, and design — is the intellectual property of KAKI unless otherwise noted. Unauthorised use, reproduction, or distribution of our content without written permission is prohibited.
                      </p>
                      <p>
                        Please refer to our Intellectual Property Notice tab for full details.
                      </p>
                    </div>
                  </div>

                  {/* Section d9 */}
                  <div id="d9" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">9. Accuracy of Information</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        We make every effort to ensure that the information on our website is accurate and current. However, we do not accept responsibility for errors or omissions, and we reserve the right to make changes at any time without notice.
                      </p>
                    </div>
                  </div>

                  {/* Section d10 */}
                  <div id="d10" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">10. Limitation of Liability</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        To the extent permitted by applicable law, KAKI shall not be liable for any direct, indirect, incidental, or consequential losses or damages arising from your use of or inability to use this website, its content, or any linked third-party websites.
                      </p>
                    </div>
                  </div>

                  {/* Section d11 */}
                  <div id="d11" className="disclaimer-section scroll-mt-28 border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">11. Jurisdiction</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        This disclaimer is governed by the laws of India. Any disputes arising from use of this website shall be subject to the jurisdiction of the appropriate courts in Nagaland, India.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cookie' && (
                // --- COOKIE POLICY ---
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Cookie Policy</h2>
                    <div className="text-sm text-kaki-grey mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-6">
                      <span><strong>Effective Date:</strong> May 28, 2025</span>
                    </div>
                  </div>

                  {/* Section c1 */}
                  <div id="c1" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">1. What Are Cookies?</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Cookies are small text files that are placed on your device — computer, phone, or tablet — when you visit a website. They serve a variety of functions: some are essential for the website to work properly, while others help us understand how visitors interact with our content.
                      </p>
                      <p>
                        Cookies are widely used across the internet. They are not viruses or harmful programs.
                      </p>
                    </div>
                  </div>

                  {/* Section c2 */}
                  <div id="c2" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">2. Why We Use Cookies</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>We use cookies on the KAKI website to:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Ensure the website functions correctly and consistently.</li>
                        <li>Understand how visitors navigate and engage with our content.</li>
                        <li>Measure website performance and identify areas for improvement.</li>
                        <li>Support marketing and retargeting efforts through advertising platforms.</li>
                        <li>Remember your preferences across visits.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section c3 */}
                  <div id="c3" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">3. Types of Cookies We Use</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-6 text-base">
                      <div>
                        <h4 className="text-white font-semibold mb-3">3.1 Strictly Necessary Cookies</h4>
                        <p className="mb-4">
                          These cookies are essential for the website to operate. Without them, certain features — such as form submissions or page navigation — would not function properly. These cannot be disabled.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 mb-6">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white">
                                <th className="p-4 font-bold">Cookie Name</th>
                                <th className="p-4 font-bold">Purpose</th>
                                <th className="p-4 font-bold">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                              <tr>
                                <td className="p-4 font-semibold text-white">Session cookies</td>
                                <td className="p-4">Maintain website functionality</td>
                                <td className="p-4">Session</td>
                              </tr>
                              <tr>
                                <td className="p-4 font-semibold text-white">Security cookies</td>
                                <td className="p-4">Protect against fraud and abuse</td>
                                <td className="p-4">Session</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">3.2 Analytics Cookies</h4>
                        <p className="mb-4">
                          These cookies help us understand visitor behaviour — such as which pages are visited most and how users move through the site. All data collected is aggregated and anonymised.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 mb-6">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white">
                                <th className="p-4 font-bold">Provider</th>
                                <th className="p-4 font-bold">Cookie Purpose</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                              <tr>
                                <td className="p-4 font-semibold text-white">Google Analytics (GA4)</td>
                                <td className="p-4">Traffic analysis, page performance, user behaviour</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">3.3 Marketing and Advertising Cookies</h4>
                        <p className="mb-4">
                          These cookies are used to deliver relevant advertising and measure the effectiveness of campaigns. They may be placed by advertising partners including Google and Meta.
                        </p>
                        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 mb-6">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white">
                                <th className="p-4 font-bold">Provider</th>
                                <th className="p-4 font-bold">Cookie Purpose</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                              <tr>
                                <td className="p-4 font-semibold text-white">Google Ads</td>
                                <td className="p-4">Conversion tracking, remarketing</td>
                              </tr>
                              <tr>
                                <td className="p-4 font-semibold text-white">Meta Pixel</td>
                                <td className="p-4">Facebook/Instagram ad performance, retargeting</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">3.4 Functional Cookies</h4>
                        <p>
                          These cookies remember choices you make (such as language or display preferences) to provide a more personalised experience.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">3.5 Third-Party Cookies</h4>
                        <p>
                          Some pages on our website may include embedded content or plugins (such as social media share buttons or YouTube videos) that set their own cookies. KAKI does not control these cookies. Please refer to those platforms' cookie policies for details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section c4 */}
                  <div id="c4" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">4. Cookie Duration</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>Cookies may be:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li><strong>Session cookies</strong> — deleted when you close your browser.</li>
                        <li><strong>Persistent cookies</strong> — stored on your device for a defined period, ranging from a few days to up to 24 months, depending on their purpose.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section c5 */}
                  <div id="c5" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">5. How to Manage Cookies</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        You can control how cookies are stored and used through your browser settings. Most browsers allow you to:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>View and delete existing cookies.</li>
                        <li>Block all cookies or specific types.</li>
                        <li>Set alerts when websites attempt to place cookies.</li>
                      </ul>
                      <p className="mt-4 font-semibold text-white">Browser cookie management references:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <strong className="text-white">Google Chrome:</strong> <code className="text-pink-300 text-xs">chrome://settings/cookies</code>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <strong className="text-white">Mozilla Firefox:</strong> <span className="text-xs">Preferences → Privacy & Security</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <strong className="text-white">Safari:</strong> <span className="text-xs">Preferences → Privacy</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <strong className="text-white">Microsoft Edge:</strong> <span className="text-xs">Settings → Cookies and permissions</span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs italic">
                        Please be aware that disabling certain cookies may affect how our website functions or limit your experience.
                      </p>
                    </div>
                  </div>

                  {/* Section c6 */}
                  <div id="c6" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">6. Our Advertising Opt-Outs</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        If you wish to opt out of interest-based advertising, you can adjust settings directly with the providers:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>
                          <strong>Google Ads:</strong> visit{' '}
                          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline transition-colors">
                            Google Ad Settings
                          </a>
                        </li>
                        <li>
                          <strong>Meta/Facebook Ads:</strong> visit{' '}
                          <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 underline transition-colors">
                            Meta Ad Preferences
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Section c7 */}
                  <div id="c7" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">7. Consent</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        When you visit our website for the first time, we will ask for your consent to place non-essential cookies. You can accept, decline, or customise your preferences through our cookie consent banner.
                      </p>
                      <p>
                        You may withdraw your consent at any time by clearing your browser cookies and revisiting the site.
                      </p>
                    </div>
                  </div>

                  {/* Section c8 */}
                  <div id="c8" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">8. Policy Updates</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        We may update this Cookie Policy as our practices or applicable regulations change. We will always display the latest version on our website with a clear revision date.
                      </p>
                    </div>
                  </div>

                  {/* Section c9 */}
                  <div id="c9" className="disclaimer-section scroll-mt-28 border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">9. Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-kaki-grey">
                      <div className="flex items-start gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-pink-500/20 transition-all duration-300">
                        <Mail className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Email Us</h4>
                          <a href="mailto:connect@kakihelpsbrands.com" className="text-xs hover:text-pink-400 transition-colors break-all">
                            connect@kakihelpsbrands.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-pink-500/20 transition-all duration-300">
                        <Phone className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Call Us</h4>
                          <a href="tel:8837402472" className="text-xs hover:text-pink-400 transition-colors">
                            883 740 2472
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-pink-500/20 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Address</h4>
                          <p className="text-xs leading-relaxed">
                            132 B, 2 ½ Mile, Darogapathar, Dimapur, Nagaland 797116
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ip' && (
                // --- INTELLECTUAL PROPERTY NOTICE ---
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Intellectual Property Notice</h2>
                    <div className="text-sm text-kaki-grey mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-6">
                      <span><strong>Effective Date:</strong> May 28, 2025</span>
                    </div>
                  </div>

                  {/* Section i1 */}
                  <div id="i1" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">1. Ownership of Creative Work</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI pours significant creative expertise, time, and resources into every project. Understanding who owns what — and when — is important for both parties. This notice explains KAKI's intellectual property (IP) position clearly and fairly.
                      </p>
                    </div>
                  </div>

                  {/* Section i2 */}
                  <div id="i2" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">2. KAKI's Own Intellectual Property</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        All creative work, content, visual assets, methodologies, templates, tools, and processes developed by KAKI — including those created prior to or independently of any client engagement — remain the exclusive property of KAKI.
                      </p>
                      <p>This includes, but is not limited to:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Our brand identity, logo, name, and trade dress.</li>
                        <li>Website design, layout, copy, and imagery.</li>
                        <li>Internal templates, processes, and frameworks we use to deliver services.</li>
                        <li>Proprietary tools, code bases, or systems we have developed.</li>
                      </ul>
                      <p>
                        No client or website visitor is granted any ownership or licence over KAKI's own intellectual property through use of our website or services, unless explicitly agreed in writing.
                      </p>
                    </div>
                  </div>

                  {/* Section i3 */}
                  <div id="i3" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">3. Client-Commissioned Work — IP Ownership</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">3.1 Default Position</h4>
                      <p>
                        Unless a written agreement explicitly states otherwise, intellectual property in work commissioned by a client — such as designs, videos, written content, websites, or campaign assets — is owned by KAKI until full payment has been received.
                      </p>
                      <p>
                        Upon receipt of full payment, KAKI assigns the agreed deliverables to the client for their intended use.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">3.2 Transfer of Ownership</h4>
                      <p>
                        If a client requires full and exclusive ownership (including source files, raw footage, design source files, and all associated rights), this must be specified in the project agreement before work begins. Such requests may be subject to an additional fee.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">3.3 What Is Not Transferred (Unless Agreed)</h4>
                      <p>The following are typically not included in a standard deliverable transfer, unless explicitly negotiated:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Source files (editable design files, raw video footage, code repositories)</li>
                        <li>Proprietary KAKI templates, plug-ins, or frameworks used in delivery</li>
                        <li>Any pre-existing creative assets owned by KAKI incorporated into the project</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section i4 */}
                  <div id="i4" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">4. Specific Asset Types</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-6 text-base">
                      <div>
                        <h4 className="text-white font-semibold mb-2">4.1 Graphic Design and Branding Assets</h4>
                        <p>
                          Final files (such as exported logos, brand guidelines in PDF format, and image files) are delivered to the client upon full payment. Editable source files (Adobe Illustrator, Photoshop, Figma, etc.) are retained by KAKI unless specifically agreed upon and priced accordingly.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">4.2 Website Development</h4>
                        <p>
                          Upon full payment, clients receive ownership of the website as delivered. Source code ownership is subject to the terms of the specific development agreement. Third-party themes, plugins, or licenced assets used during development are subject to their own licencing terms and cannot be "owned" outright by either party.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">4.3 Video and Creative Production</h4>
                        <p>
                          Raw footage, audio recordings, unedited project files, and after-effects compositions remain with KAKI unless explicitly purchased as part of the project scope. Delivered video files in agreed formats are licensed to the client for their intended use upon full payment.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">4.4 Written Content and Copy</h4>
                        <p>
                          Content written by KAKI for a client's use — blogs, ad copy, website copy, social captions — is owned by the client upon full payment. However, KAKI retains the right to reference this work in our portfolio or case studies unless the client requests otherwise in writing.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-2">4.5 Branding and Identity Systems</h4>
                        <p>
                          Complete brand identity systems (logos, typography, colour palettes, brand guidelines) are delivered to the client upon full payment. KAKI retains the right to display this work in our portfolio.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Section i5 */}
                  <div id="i5" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">5. Client-Provided Content</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>When a client provides content — photographs, logos, copy, videos, or other materials — to KAKI for use in a project, the client confirms that:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>They own or have the right to use that content.</li>
                        <li>They grant KAKI a limited licence to use that content solely for the purpose of delivering the agreed services.</li>
                      </ul>
                      <p className="mt-2 text-purple-300/90 italic bg-purple-950/20 p-4 rounded-xl border border-purple-500/10">
                        KAKI is not responsible for any claims, disputes, or legal issues arising from client-supplied content.
                      </p>
                    </div>
                  </div>

                  {/* Section i6 */}
                  <div id="i6" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">6. Third-Party Licensed Assets</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI may use licenced assets from third-party providers — including stock photography, stock video, typefaces, icon libraries, or music — when creating deliverables. These assets are governed by their respective licences.
                      </p>
                      <p>
                        KAKI will always work within the appropriate licence terms. However, clients should note that licenced assets may:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Carry restrictions on use (commercial vs. editorial, regional restrictions, etc.)</li>
                        <li>Require their own licence purchase by the client for extended or specific uses.</li>
                      </ul>
                      <p className="mt-2 text-xs italic">
                        We will always make clients aware of any third-party asset licencing requirements that may affect their intended use of deliverables.
                      </p>
                    </div>
                  </div>

                  {/* Section i7 */}
                  <div id="i7" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">7. Portfolio and Case Study Rights</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI reserves the right to display completed client work in our portfolio, on our website, in presentations, and in marketing materials — unless the client has signed a non-disclosure agreement that explicitly prohibits this.
                      </p>
                      <p>
                        If you prefer that your project not be displayed publicly, please notify us in writing before or during the project. We will respect this request.
                      </p>
                    </div>
                  </div>

                  {/* Section i8 */}
                  <div id="i8" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">8. Unauthorised Use of KAKI's Work</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Any use, reproduction, distribution, or adaptation of KAKI's content, design, code, or creative assets without prior written permission is strictly prohibited and may constitute an infringement of intellectual property rights under the Indian Copyright Act, 1957, and other applicable laws.
                      </p>
                      <p>
                        If you believe any content on our website infringes your intellectual property rights, please contact us immediately and we will investigate the matter seriously.
                      </p>
                    </div>
                  </div>

                  {/* Section i9 */}
                  <div id="i9" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">9. Moral Rights</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI's creative team retains moral rights over original works as provided under applicable Indian law, regardless of the transfer of economic rights. We will not assert these rights unreasonably in the context of normal commercial deliverables.
                      </p>
                    </div>
                  </div>

                  {/* Section i10 */}
                  <div id="i10" className="disclaimer-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">10. Licencing Enquiries</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        If you wish to licence, reproduce, or use any content from KAKI's website or portfolio for purposes beyond what is permitted here, please contact us to discuss terms.
                      </p>
                    </div>
                  </div>

                  {/* Section i11 */}
                  <div id="i11" className="disclaimer-section scroll-mt-28 border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">11. Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-kaki-grey">
                      <div className="flex items-start gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-purple-500/20 transition-all duration-300">
                        <Mail className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Email Us</h4>
                          <a href="mailto:connect@kakihelpsbrands.com" className="text-xs hover:text-purple-400 transition-colors break-all">
                            connect@kakihelpsbrands.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-purple-500/20 transition-all duration-300">
                        <Phone className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Call Us</h4>
                          <a href="tel:8837402472" className="text-xs hover:text-purple-400 transition-colors">
                            883 740 2472
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-purple-500/20 transition-all duration-300">
                        <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-white text-sm mb-1">Address</h4>
                          <p className="text-xs leading-relaxed">
                            132 B, 2 ½ Mile, Darogapathar, Dimapur, Nagaland 797116
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Action Footer Page */}
      <section className="section-padding bg-gradient-to-r from-kaki-black via-purple-950/20 to-kaki-black border-t border-white/5 relative z-10">
        <div className="container-custom text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Have questions about our Policies?</h2>
          <p className="text-kaki-grey max-w-xl mx-auto mb-8 text-base">
            For any enquiries, permissions, or concerns about our general disclaimers, cookie tracking, or copyright rules, feel free to contact us.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-5 rounded-xl font-bold shadow-lg shadow-purple-500/10">
            <Link to="/contact" className="flex items-center gap-2">
              <span>Get In Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Disclaimer;
