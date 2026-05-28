import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Mail, Phone, MapPin, ArrowRight, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.privacy-section');
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
  }, []);

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

  const sections = [
    { id: 'p1', title: '1. Commitment to Privacy' },
    { id: 'p2', title: '2. Information We Collect' },
    { id: 'p3', title: '3. How We Use Information' },
    { id: 'p4', title: '4. Third-Party Services' },
    { id: 'p5', title: '5. Cookies' },
    { id: 'p6', title: '6. Storage & Security' },
    { id: 'p7', title: '7. Data Retention' },
    { id: 'p8', title: '8. Your Rights' },
    { id: 'p9', title: '9. Children\'s Privacy' },
    { id: 'p10', title: '10. External Links' },
    { id: 'p11', title: '11. Policy Changes' },
    { id: 'p12', title: '12. Contact Us' }
  ];

  return (
    <div className="min-h-screen pt-24 bg-kaki-black text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-kaki-black via-purple-950/15 to-kaki-black z-0 pointer-events-none" />
      <div className="absolute -top-40 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 relative z-10">
        <div className="container-custom text-center max-w-4xl">
          <div className="inline-flex p-3 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20 mb-6 animate-pulse">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Privacy Policy
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-kaki-grey max-w-2xl mx-auto mb-10 leading-relaxed">
            We are committed to transparency. This Privacy Policy details how we handle, store, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-24 relative z-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Sidebar Sticky Navigation (Visible on Desktop) */}
            <div className="hidden lg:block lg:col-span-4 sticky top-32 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
              <h3 className="text-sm font-bold text-pink-400 uppercase tracking-wider mb-4 px-2">
                Privacy Policy Index
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                      activeSection === sec.id
                        ? 'bg-pink-600/20 text-pink-300 border border-pink-500/30'
                        : 'text-kaki-grey hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="truncate">{sec.title}</span>
                    <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                      activeSection === sec.id ? 'opacity-100 text-pink-300' : ''
                    }`} />
                  </button>
                ))}
              </nav>
            </div>

            {/* Document Contents */}
            <div className="lg:col-span-8 bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md">
              <div className="space-y-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Privacy Policy</h2>
                  <div className="text-sm text-kaki-grey mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-6">
                    <span><strong>Effective Date:</strong> May 28, 2026</span>
                  </div>
                </div>

                {/* Section 1 */}
                <div id="p1" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">1. Our Commitment to Your Privacy</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>
                      At KAKI, we take privacy seriously. This Privacy Policy explains what information we collect, how we use it, and the choices you have. We believe in being transparent — not vague — about data practices.
                    </p>
                    <p>
                      This policy applies to our website and to any personal data we handle in the course of our business operations, including client engagements.
                    </p>
                  </div>
                </div>

                {/* Section 2 */}
                <div id="p2" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">2. What Information We Collect</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-6 text-base">
                    <div>
                      <h4 className="text-white font-semibold mb-2">2.1 Information You Give Us Directly</h4>
                      <p className="mb-3">
                        When you contact us through our website form, WhatsApp, email, or phone, you may share:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Your name</li>
                        <li>Your email address</li>
                        <li>Your phone number</li>
                        <li>Your business name or industry</li>
                        <li>Any details you include in your message</li>
                      </ul>
                      <p className="mt-3">
                        We only use this information to respond to your inquiry and understand how we might work together.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">2.2 Information Collected Automatically</h4>
                      <p className="mb-3">
                        When you visit our website, certain data is collected automatically through analytics tools:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>IP address and approximate location</li>
                        <li>Browser type and operating system</li>
                        <li>Pages visited and time spent on each page</li>
                        <li>Referring website or search query</li>
                        <li>Device type (mobile, desktop, tablet)</li>
                      </ul>
                      <p className="mt-3">
                        This data is collected in aggregate form to help us improve our website. It does not identify you personally.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-semibold mb-2">2.3 Information from Client Engagements</h4>
                      <p className="mb-3">
                        When you become a client, we may additionally collect:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Business registration or billing details</li>
                        <li>Project-related files, assets, and content you share</li>
                        <li>Login credentials or platform access details (handled securely)</li>
                        <li>Communication records (emails, WhatsApp messages)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div id="p3" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">3. How We Use Your Information</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>We use the information we collect to:</p>
                    <ul className="space-y-2 pl-4 list-disc list-outside">
                      <li>Respond to inquiries and service requests.</li>
                      <li>Deliver, manage, and improve our services.</li>
                      <li>Send project-related updates, proposals, and invoices.</li>
                      <li>Maintain records for accounting and legal compliance.</li>
                      <li>Improve our website and user experience through analytics.</li>
                      <li>Occasionally share updates, relevant content, or new services (you can opt out at any time).</li>
                    </ul>
                    <p className="mt-4 text-purple-300 font-medium italic bg-purple-950/20 p-4 rounded-xl border border-purple-500/10">
                      We do not sell your data. We do not trade it. We do not share it for advertising purposes without your explicit knowledge and consent.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div id="p4" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">4. Third-Party Services We Use</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p className="mb-4">
                      To operate our business and deliver services effectively, we use a range of third-party tools. These may process some of your data in accordance with their own privacy policies:
                    </p>
                    
                    {/* Responsive Premium Table */}
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white">
                            <th className="p-4 font-bold">Tool / Platform</th>
                            <th className="p-4 font-bold">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm text-kaki-grey">
                          {[
                            { name: 'Google Analytics', purpose: 'Website traffic and behaviour analysis' },
                            { name: 'Google Ads', purpose: 'Paid advertising management' },
                            { name: 'Meta Ads Manager', purpose: 'Facebook and Instagram advertising' },
                            { name: 'Google Workspace', purpose: 'Email, file storage, communication' },
                            { name: 'WhatsApp Business', purpose: 'Client communication' },
                            { name: 'CRM platforms', purpose: 'Client relationship management' },
                            { name: 'Hosting providers', purpose: 'Website and application hosting' },
                            { name: 'Payment gateways', purpose: 'Invoice processing and payments' }
                          ].map((item, idx) => (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                              <td className="p-4 font-semibold text-white">{item.name}</td>
                              <td className="p-4">{item.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <p className="mt-4 text-xs italic">
                      We encourage you to review the privacy policies of these platforms if you have specific concerns about how they handle data.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div id="p5" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">5. Cookies</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>
                      We use cookies and similar tracking technologies on our website to understand visitor behaviour and improve our service. These include functional cookies that keep the site running smoothly and analytical cookies that help us understand which pages are most useful.
                    </p>
                  </div>
                </div>

                {/* Section 6 */}
                <div id="p6" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">6. Data Storage and Security</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>
                      Your data is stored securely using industry-standard practices. We take reasonable technical and organisational measures to protect personal information against unauthorised access, loss, or disclosure.
                    </p>
                    <p>
                      However, no digital system is entirely immune to risk. While we do our best to protect your information, we cannot guarantee absolute security. If we ever become aware of a data breach that affects you, we will notify you promptly.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div id="p7" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">7. How Long We Keep Your Data</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>We retain personal data for as long as necessary to:</p>
                    <ul className="space-y-2 pl-4 list-disc list-outside">
                      <li>Fulfil the purpose it was collected for.</li>
                      <li>Comply with legal, tax, or accounting requirements.</li>
                      <li>Resolve disputes or enforce agreements.</li>
                    </ul>
                    <p>
                      Inquiry data from non-clients is typically retained for up to 12 months. Client project data may be retained for up to 5 years for compliance purposes. You may request earlier deletion (subject to legal obligations).
                    </p>
                  </div>
                </div>

                {/* Section 8 */}
                <div id="p8" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">8. Your Rights</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>Under applicable Indian data protection norms, and as a matter of respect, you have the right to:</p>
                    <ul className="space-y-3 pl-2">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0" />
                        <span><strong>Access</strong> — Request a copy of the personal data we hold about you.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0" />
                        <span><strong>Correction</strong> — Ask us to correct inaccurate information.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0" />
                        <span><strong>Deletion</strong> — Request that we delete your data (where no legal obligation requires us to retain it).</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0" />
                        <span><strong>Withdrawal of Consent</strong> — Opt out of marketing communications at any time.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2.5 shrink-0" />
                        <span><strong>Objection</strong> — Object to how we process your data in specific circumstances.</span>
                      </li>
                    </ul>
                    <p className="mt-4">
                      To exercise any of these rights, contact us at{' '}
                      <a href="mailto:connect@kakihelpsbrands.com" className="text-pink-400 hover:text-pink-300 font-semibold underline decoration-2 transition-colors">
                        connect@kakihelpsbrands.com
                      </a>
                      . We will respond within a reasonable timeframe.
                    </p>
                  </div>
                </div>

                {/* Section 9 */}
                <div id="p9" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">9. Children's Privacy</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>
                      Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has submitted information through our website, please contact us and we will remove it promptly.
                    </p>
                  </div>
                </div>

                {/* Section 10 */}
                <div id="p10" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">10. External Links</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>
                      Our website may contain links to external websites. KAKI is not responsible for the privacy practices or content of those sites. We encourage you to read the privacy policies of any third-party websites you visit.
                    </p>
                  </div>
                </div>

                {/* Section 11 */}
                <div id="p11" className="privacy-section scroll-mt-28">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">11. Changes to This Policy</h3>
                  <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                    <p>
                      We may update this Privacy Policy as our business or legal requirements evolve. The updated version will always be available on our website, with the revision date clearly marked. Your continued use of our website after changes are published constitutes acceptance.
                    </p>
                  </div>
                </div>

                {/* Section 12 */}
                <div id="p12" className="privacy-section scroll-mt-28 border-t border-white/10 pt-8">
                  <h3 className="text-xl font-bold text-pink-400 mb-4">12. Contact Us</h3>
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
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Action Section */}
      <section className="section-padding bg-gradient-to-r from-kaki-black via-purple-950/20 to-kaki-black border-t border-white/5 relative z-10">
        <div className="container-custom text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Have questions about your data?</h2>
          <p className="text-kaki-grey max-w-xl mx-auto mb-8 text-base">
            Please feel free to ask about how we protect and manage your personal details.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 px-8 py-5 rounded-xl font-bold shadow-lg shadow-purple-500/10">
            <Link to="/contact" className="flex items-center gap-2">
              <span>Contact KAKI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
