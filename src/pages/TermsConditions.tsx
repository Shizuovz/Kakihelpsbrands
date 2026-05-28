import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Mail, Phone, MapPin, ArrowRight, ChevronRight, Check } from 'lucide-react';

const TermsConditions = () => {
  const [activeTab, setActiveTab] = useState<'website' | 'service'>('website');
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.term-section');
      let currentSection = '';

      headings.forEach((heading) => {
        const top = heading.getBoundingClientRect().top;
        // If the heading is near the top of the viewport
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

  const websiteSections = [
    { id: 'w1', title: '1. Who We Are' },
    { id: 'w2', title: '2. Definitions' },
    { id: 'w3', title: '3. Use of Our Website' },
    { id: 'w4', title: '4. Inquiries and Contact Forms' },
    { id: 'w5', title: '5. Service Agreements' },
    { id: 'w6', title: '6. Payments' },
    { id: 'w7', title: '7. Refunds and Cancellations' },
    { id: 'w8', title: '8. Third-Party Platforms and Tools' },
    { id: 'w9', title: '9. Campaign Performance Disclaimer' },
    { id: 'w10', title: '10. Confidentiality' },
    { id: 'w11', title: '11. Limitation of Liability' },
    { id: 'w12', title: '12. Governing Law and Jurisdiction' },
    { id: 'w13', title: '13. Amendments' },
    { id: 'w14', title: '14. Contact Us' }
  ];

  const serviceSections = [
    { id: 's1', title: '1. Overview' },
    { id: 's2', title: '2. Services Covered' },
    { id: 's3', title: '3. Project Commencement' },
    { id: 's4', title: '4. Timelines and Delivery' },
    { id: 's5', title: '5. Revisions Policy' },
    { id: 's6', title: '6. Content Approval' },
    { id: 's7', title: '7. SEO Services' },
    { id: 's8', title: '8. Paid Advertising Services' },
    { id: 's9', title: '9. Web Development' },
    { id: 's10', title: '10. Third-Party Integrations' },
    { id: 's11', title: '11. Confidential Business Info' },
    { id: 's12', title: '12. Suspension & Termination' },
    { id: 's13', title: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen pt-24 bg-kaki-black text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-kaki-black via-purple-950/15 to-kaki-black z-0 pointer-events-none" />
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl z-0 pointer-events-none" />

      {/* Hero Header */}
      <section className="pt-16 pb-12 relative z-10">
        <div className="container-custom text-center max-w-4xl">
          <div className="inline-flex p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20 mb-6 animate-pulse">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Terms & Services
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-kaki-grey max-w-2xl mx-auto mb-10 leading-relaxed">
            Please read these terms carefully. They outline our website policies and the standard service conditions for engaging KAKI.
          </p>

          {/* Premium Tab Swapper */}
          <div className="flex justify-center p-1 bg-white/5 border border-white/10 rounded-2xl max-w-lg mx-auto backdrop-blur-md">
            <button
              onClick={() => setActiveTab('website')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'website'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-kaki-grey hover:text-white hover:bg-white/5'
                }`}
            >
              <Shield className="w-4 h-4" />
              Website Terms
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === 'service'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-kaki-grey hover:text-white hover:bg-white/5'
                }`}
            >
              <FileText className="w-4 h-4" />
              Service Terms
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
                {activeTab === 'website' ? 'Website Terms Index' : 'Service Terms Index'}
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {activeTab === 'website'
                  ? websiteSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${activeSection === sec.id
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                        : 'text-kaki-grey hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === sec.id ? 'opacity-100 text-purple-300' : ''
                        }`} />
                    </button>
                  ))
                  : serviceSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group ${activeSection === sec.id
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                        : 'text-kaki-grey hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      <span className="truncate">{sec.title}</span>
                      <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeSection === sec.id ? 'opacity-100 text-purple-300' : ''
                        }`} />
                    </button>
                  ))}
              </nav>
            </div>

            {/* Document Contents */}
            <div className="lg:col-span-8 bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-md">
              {activeTab === 'website' ? (
                // --- WEBSITE TERMS & CONDITIONS ---
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Terms & Conditions</h2>
                    <div className="text-sm text-kaki-grey mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-6">
                      <span><strong>Effective Date:</strong> May 28, 2026</span>
                      <span>•</span>
                      <span><strong>Last Updated:</strong> May 28, 2026</span>
                    </div>
                  </div>

                  {/* Section 1 */}
                  <div id="w1" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">1. Who We Are</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI is a creative marketing agency based in Nagaland, India. We work with businesses across industries to deliver digital marketing, branding, design, content, web development, and creative production services. These Terms & Conditions govern your use of our website and your engagement with our services.
                      </p>
                      <p>
                        By accessing our website or entering into a service agreement with us, you confirm that you have read, understood, and agreed to these terms. If you do not agree, please do not use our website or services.
                      </p>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div id="w2" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">2. Definitions</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>Throughout this document:</p>
                      <ul className="space-y-3 pl-2">
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0" />
                          <span><strong>"KAKI," "we," "us," or "our"</strong> refers to the agency and its team.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0" />
                          <span><strong>"Client" or "you"</strong> refers to any individual or business engaging with our services or website.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0" />
                          <span><strong>"Services"</strong> refers to all work KAKI performs, including but not limited to digital marketing, SEO, social media management, paid advertising, video marketing, web development, CRM and app development, graphic design, branding, event branding, content creation, and marketing strategy.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0" />
                          <span><strong>"Project"</strong> refers to any specific deliverable or campaign undertaken under a service agreement.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2.5 shrink-0" />
                          <span><strong>"Agreement"</strong> refers to any proposal, contract, or written communication confirming the scope and terms of a project.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div id="w3" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">3. Use of Our Website</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Our website is intended to provide information about KAKI and our services. You agree to use it lawfully and responsibly.
                      </p>

                      <h4 className="text-white font-semibold mt-4 mb-2">3.1 Permitted Use</h4>
                      <p>
                        You may browse our website, submit inquiries, read our content, and contact us through available channels. All use must be for lawful purposes only.
                      </p>

                      <h4 className="text-white font-semibold mt-4 mb-2">3.2 Prohibited Use</h4>
                      <p>You must not:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Attempt to gain unauthorized access to any part of our website or systems.</li>
                        <li>Use automated tools (bots, scrapers, crawlers) to extract content without prior written permission.</li>
                        <li>Submit false, misleading, or harmful information through any form or channel.</li>
                        <li>Use our website or content to compete with us or misrepresent your affiliation with KAKI.</li>
                        <li>Attempt to disrupt, damage, or interfere with our website's operation.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div id="w4" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">4. Inquiries and Contact Forms</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        When you submit an inquiry through our website's contact forms or reach out via WhatsApp or email, you are initiating a conversation — not formalising a service agreement. KAKI is under no obligation to respond to every inquiry or accept every project.
                      </p>
                      <p>
                        An engagement becomes binding only when both parties have agreed in writing to a scope of work, timeline, and payment terms.
                      </p>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div id="w5" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">5. Service Agreements</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">

                      <h4 className="text-white font-semibold mb-2">5.1 Scope of Work</h4>
                      <p>
                        All projects begin with a defined scope. Any work outside the agreed scope — including additional revisions, new deliverables, or expanded campaigns — may be subject to additional charges. We will always communicate this before proceeding.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">5.2 Client Responsibilities</h4>
                      <p>You agree to:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Provide accurate and complete project briefs and brand information.</li>
                        <li>Supply required assets (logos, images, copy, access credentials) within agreed timelines.</li>
                        <li>Designate a point of contact who has the authority to approve deliverables.</li>
                        <li>Review and respond to submissions within the timeframes outlined in your agreement.</li>
                      </ul>
                      <p className="mt-2 text-purple-300/95 italic bg-purple-950/20 p-4 rounded-xl border border-purple-500/10">
                        Delays caused by late feedback, missing assets, or unclear instructions may extend project timelines. KAKI will not be held responsible for delays that arise due to client-side communication gaps.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">5.3 Revisions</h4>
                      <p>
                        Unless otherwise agreed in writing, each project includes a reasonable number of revision rounds as specified in your proposal. Revisions beyond this scope will be billed at our standard hourly or project rate.
                      </p>
                      <p>
                        Revisions must be submitted as consolidated feedback — not piecemeal. Revisions requested after a project has been approved and delivered may be treated as new work.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">5.4 Approvals and Sign-Off</h4>
                      <p>
                        Once you approve a deliverable — whether verbally, via email, or through any messaging platform — KAKI considers that stage of the project complete. Changes requested after approval may incur additional costs.
                      </p>
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div id="w6" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">6. Payments</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">6.1 Payment Terms</h4>
                      <p>
                        Payment terms are outlined in each project agreement. Unless stated otherwise, a deposit is required before work begins. Remaining balances are due upon completion or as per the milestone schedule agreed upon.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">6.2 Late Payments</h4>
                      <p>
                        KAKI reserves the right to pause or suspend work on any project where invoices remain unpaid beyond the agreed payment period. Continued delays may result in project cancellation, with any payments already made retained to cover work completed.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">6.3 Taxes</h4>
                      <p>
                        All quoted prices are exclusive of applicable taxes including GST, unless explicitly stated otherwise.
                      </p>
                    </div>
                  </div>

                  {/* Section 7 */}
                  <div id="w7" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">7. Refunds and Cancellations</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">7.1 Cancellations by Client</h4>
                      <p>
                        If you cancel a project after work has commenced, any deposit or payments made are non-refundable to the extent they cover work already performed. KAKI will provide a written summary of work completed at the time of cancellation.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">7.2 Cancellations by KAKI</h4>
                      <p>
                        In rare circumstances, KAKI may need to withdraw from a project due to ethical concerns, resource constraints, or breach of these terms. In such cases, we will refund any portion of payment attributable to work not yet performed.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">7.3 Ongoing Retainers</h4>
                      <p>
                        Retainer agreements may be cancelled by either party with a minimum of <strong>30 days'</strong> written notice, unless a different notice period is specified in the contract. Work performed during the notice period will be invoiced as normal.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">7.4 No Refunds for Campaign Performance</h4>
                      <p>
                        Fees paid for digital advertising campaigns, SEO services, or any performance-based marketing work are non-refundable, as these involve third-party platform spend, time, and expertise regardless of outcome.
                      </p>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div id="w8" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">8. Third-Party Platforms and Tools</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI uses industry-standard third-party tools and platforms to deliver our services, including Google Analytics, Google Ads, Meta Ads Manager, social media platforms, hosting providers, CRM systems, and payment gateways.
                      </p>
                      <p>By engaging our services, you acknowledge that:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>These platforms operate under their own terms and policies.</li>
                        <li>KAKI cannot guarantee the continued availability, performance, or policy consistency of third-party platforms.</li>
                        <li>Changes to platform algorithms, ad policies, or availability may affect campaign outcomes, and such changes are outside KAKI's control.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 9 */}
                  <div id="w9" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">9. Campaign Performance Disclaimer</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI brings expertise, strategy, and creative excellence to every campaign. However, we do not — and cannot — guarantee specific results such as a defined number of leads, conversions, revenue, search engine rankings, or social media growth.
                      </p>
                      <p>
                        Digital marketing outcomes are influenced by market conditions, competition, platform algorithms, seasonal factors, and audience behaviour — all of which are beyond our direct control. We will always work diligently to achieve the best possible results for your business.
                      </p>
                    </div>
                  </div>

                  {/* Section 10 */}
                  <div id="w10" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">10. Confidentiality</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Any business information, strategies, financials, or trade secrets you share with KAKI in the course of our engagement will be kept confidential. We will not disclose this information to third parties without your consent, except as required by law.
                      </p>
                      <p>
                        We ask for the same in return — our internal processes, pricing structures, team information, and unreleased work are confidential and should not be shared without our written permission.
                      </p>
                    </div>
                  </div>

                  {/* Section 11 */}
                  <div id="w11" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">11. Limitation of Liability</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>To the maximum extent permitted under applicable Indian law:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>KAKI's total liability to you, for any claim arising from our services or website, shall not exceed the total amount you have paid us in the three (3) months preceding the claim.</li>
                        <li>KAKI shall not be liable for indirect, incidental, special, or consequential damages, including loss of profit, revenue, data, or business opportunity, even if advised of the possibility of such damages.</li>
                        <li>KAKI is not liable for losses arising from third-party platform failures, policy changes, or actions outside our control.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 12 */}
                  <div id="w12" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">12. Governing Law and Jurisdiction</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        These Terms & Conditions are governed by the laws of India. Any disputes arising from these terms or from your engagement with KAKI will be subject to the exclusive jurisdiction of courts located in Nagaland, India.
                      </p>
                    </div>
                  </div>

                  {/* Section 13 */}
                  <div id="w13" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">13. Amendments</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        We may update these terms from time to time. Continued use of our website or services after changes are published constitutes acceptance of the updated terms. We will indicate the revision date at the top of this page.
                      </p>
                    </div>
                  </div>

                  {/* Section 14 */}
                  <div id="w14" className="term-section scroll-mt-28 border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">14. Contact Us</h3>
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
              ) : (
                // --- SERVICE TERMS ---
                <div className="space-y-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Service Terms</h2>
                    <div className="text-sm text-kaki-grey mb-8 flex flex-wrap gap-4 border-b border-white/10 pb-6">
                      <span>Apply to all client agreements and project work</span>
                    </div>
                  </div>

                  {/* Section 1 */}
                  <div id="s1" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">1. Overview</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        These Service Terms apply to all services delivered by KAKI and form part of every client agreement. By engaging KAKI — whether through a signed proposal, written confirmation, or payment — you agree to these terms in full.
                      </p>
                      <p>
                        These terms should be read alongside our Terms & Conditions and any project-specific scope agreed between both parties.
                      </p>
                    </div>
                  </div>

                  {/* Section 2 */}
                  <div id="s2" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">2. Services Covered</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>KAKI offers the following services, each subject to these terms:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2">
                        {[
                          "Digital Marketing — strategy, planning, and campaign management across digital channels.",
                          "SEO Services — on-page optimisation, technical SEO, content strategy, and performance monitoring.",
                          "Social Media Marketing — content planning, community management, and platform growth.",
                          "Paid Advertising — campaign setup, management, and optimisation on Google, Meta, and other platforms.",
                          "Video Marketing — concept, production, editing, and distribution strategy.",
                          "Web Development & Website Development — design, development, and deployment of websites and landing pages.",
                          "CRM & App Development — custom CRM systems, workflows, and mobile/web application development.",
                          "Graphic Design & Branding — visual identity, branding systems, design assets, and brand guidelines.",
                          "Event Branding — branding for physical and virtual events, exhibitions, and activations.",
                          "Content Creation — copywriting, photography direction, video scripting, and editorial content.",
                          "Marketing Strategy — consulting, brand positioning, and go-to-market planning.",
                          "Creative Production — end-to-end creative execution across campaigns, shoots, and media."
                        ].map((srv, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                            <Check className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                            <span>{srv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 3 */}
                  <div id="s3" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">3. Project Commencement</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>Work begins only after:</p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>A written scope of work has been agreed upon by both parties.</li>
                        <li>Any required deposit or advance payment has been received.</li>
                        <li>All required project assets and access credentials have been provided by the client.</li>
                      </ul>
                      <p className="mt-2 text-pink-300/90 italic bg-pink-950/20 p-4 rounded-xl border border-pink-500/10">
                        KAKI will not be held accountable for delays arising from incomplete project kick-off requirements on the client's side.
                      </p>
                    </div>
                  </div>

                  {/* Section 4 */}
                  <div id="s4" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">4. Timelines and Delivery</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">4.1 Estimated Timelines</h4>
                      <p>
                        All timelines communicated by KAKI are estimates based on the agreed scope and current workload. We work diligently to meet every deadline we commit to.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">4.2 Client-Caused Delays</h4>
                      <p>
                        If a project is delayed due to late feedback, unavailability of client contacts, missing assets, or slow approval cycles, KAKI reserves the right to:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Adjust the project timeline accordingly.</li>
                        <li>Reprioritise the project in our production schedule.</li>
                        <li>Bill for any time lost due to project interruptions.</li>
                      </ul>

                      <h4 className="text-white font-semibold mt-6 mb-2">4.3 Force Majeure and Unexpected Delays</h4>
                      <p>
                        KAKI will not be held liable for delays caused by circumstances beyond our reasonable control — including platform outages, internet disruptions, natural events, or technical failures on third-party systems.
                      </p>
                    </div>
                  </div>

                  {/* Section 5 */}
                  <div id="s5" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">5. Revisions Policy</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">5.1 Included Revisions</h4>
                      <p>
                        Each service package or project proposal will specify the number of revision rounds included. Please review your proposal for details.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">5.2 Additional Revisions</h4>
                      <p>
                        Revisions exceeding the agreed scope will be billed at KAKI's standard rate. We will always inform you before proceeding with billable revision work.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">5.3 What Counts as a Revision</h4>
                      <p>
                        A revision is a change to a deliverable after it has been presented to the client. A revision does not include:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Corrections to errors made by KAKI.</li>
                        <li>Minor typographic or factual fixes identified promptly.</li>
                      </ul>

                      <h4 className="text-white font-semibold mt-6 mb-2">5.4 Scope Changes</h4>
                      <p>
                        Requests to significantly change the direction, format, or nature of a deliverable after work has begun may be treated as a new project or scope extension, and will be quoted accordingly.
                      </p>
                    </div>
                  </div>

                  {/* Section 6 */}
                  <div id="s6" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">6. Content Approval and Client Responsibility</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        KAKI may produce content, copy, creative assets, or campaigns on your behalf. You are responsible for:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Reviewing all content before it is published or distributed.</li>
                        <li>Ensuring that content approved for publication complies with relevant laws and industry regulations.</li>
                        <li>Obtaining any third-party permissions or licences required for content you supply to us.</li>
                        <li>Confirming that brand, product, and business information provided to KAKI is accurate.</li>
                      </ul>
                      <p className="mt-4 text-pink-300 font-semibold italic bg-pink-950/20 p-4 rounded-xl border border-pink-500/10">
                        KAKI is not liable for errors, claims, or legal consequences arising from client-provided information or from content approved and signed off by the client.
                      </p>
                    </div>
                  </div>

                  {/* Section 7 */}
                  <div id="s7" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">7. SEO Services — Specific Terms</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">7.1 No Ranking Guarantees</h4>
                      <p>
                        KAKI does not guarantee specific search engine rankings or organic traffic targets. SEO is a long-term, iterative process influenced by many external factors including search algorithm changes, competitor activity, and content quality.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">7.2 Algorithm Changes</h4>
                      <p>
                        Search engines (including Google) update their algorithms frequently and without notice. These updates may affect your website's rankings positively or negatively. KAKI is not responsible for ranking fluctuations resulting from algorithm changes beyond our control, and will always work proactively to adapt strategy accordingly.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">7.3 Timeline Expectations</h4>
                      <p>
                        SEO results typically take 3–6 months or longer to become visible. Clients should approach SEO with realistic expectations and a long-term commitment.
                      </p>
                    </div>
                  </div>

                  {/* Section 8 */}
                  <div id="s8" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">8. Paid Advertising Services — Specific Terms</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">8.1 Ad Spend</h4>
                      <p>
                        Ad budget (media spend) paid directly to advertising platforms is separate from KAKI's management fee and is not included in our invoices unless explicitly stated. Clients are responsible for funding their own ad accounts.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">8.2 Platform Policy Changes</h4>
                      <p>
                        Google, Meta, and other advertising platforms routinely update their policies. Changes may affect ad delivery, targeting capabilities, or account status. KAKI will make every effort to stay compliant with platform policies on your behalf, but cannot be held responsible for actions taken by platforms independently.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">8.3 Ad Account Ownership</h4>
                      <p>
                        We recommend that ad accounts be held in the client's name wherever possible. KAKI can operate with manager access. If KAKI creates accounts on your behalf, ownership can be transferred upon project completion.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">8.4 Campaign Performance</h4>
                      <p>
                        Advertising results — including impressions, clicks, conversions, and return on ad spend — can vary significantly based on budget, market conditions, creative quality, audience behaviour, and platform dynamics. We do not guarantee specific advertising outcomes.
                      </p>
                    </div>
                  </div>

                  {/* Section 9 */}
                  <div id="s9" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">9. Web Development — Specific Terms</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">9.1 Browser and Device Compatibility</h4>
                      <p>
                        KAKI will develop websites compatible with all modern browsers and devices as of the project's delivery date. We do not guarantee compatibility with outdated or unsupported browsers.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">9.2 Hosting and Maintenance</h4>
                      <p>
                        Unless we have a separate hosting or maintenance agreement in place, KAKI's responsibility ends upon delivery of the completed website. Post-delivery hosting, uptime, security, and updates are the client's responsibility unless covered under a retainer or maintenance plan.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">9.3 Third-Party Plugins and Integrations</h4>
                      <p>
                        Websites may rely on third-party plugins, themes, or APIs. KAKI is not responsible for failures, conflicts, or security vulnerabilities arising from third-party components that fall outside our control.
                      </p>
                    </div>
                  </div>

                  {/* Section 10 */}
                  <div id="s10" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">10. Third-Party Integrations</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Many of our services involve external platforms — CRMs, email tools, social platforms, ad networks, analytics dashboards, and more. Where we work within third-party systems on your behalf:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>We do so under your direction and with your authorisation.</li>
                        <li>The terms, limitations, and data practices of those platforms apply.</li>
                        <li>KAKI cannot guarantee the performance or availability of third-party services.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Section 11 */}
                  <div id="s11" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">11. Confidential Business Information</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <p>
                        Both parties agree to treat each other's business information — including strategies, pricing, internal processes, client lists, and operational details — as confidential. This obligation remains in effect for a minimum of two (2) years after the conclusion of a project or engagement.
                      </p>
                      <p>
                        KAKI will not share your business strategy, campaign data, or proprietary information with third parties, except where required by law or necessary to deliver the services (e.g., sharing creative assets with a printing vendor).
                      </p>
                    </div>
                  </div>

                  {/* Section 12 */}
                  <div id="s12" className="term-section scroll-mt-28">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">12. Service Suspension and Termination</h3>
                    <div className="text-kaki-grey leading-relaxed space-y-4 text-base">
                      <h4 className="text-white font-semibold mb-2">12.1 By the Client</h4>
                      <p>
                        Clients may terminate an ongoing engagement with written notice. Termination terms vary depending on the contract type and will be outlined in your project agreement. Work completed up to the point of termination will be invoiced.
                      </p>

                      <h4 className="text-white font-semibold mt-6 mb-2">12.2 By KAKI</h4>
                      <p>
                        KAKI reserves the right to suspend or terminate services if:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc list-outside">
                        <li>Payment obligations are not met after reasonable notice.</li>
                        <li>The client engages in conduct that is abusive, unethical, or unlawful.</li>
                        <li>The client breaches these terms or the project agreement.</li>
                      </ul>
                      <p className="mt-4">
                        In such cases, KAKI will provide written notice, retain fees for work already performed, and — where appropriate — deliver completed work.
                      </p>
                    </div>
                  </div>

                  {/* Section 13 */}
                  <div id="s13" className="term-section scroll-mt-28 border-t border-white/10 pt-8">
                    <h3 className="text-xl font-bold text-pink-400 mb-4">Contact Us</h3>
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
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Action Footer Page */}
      <section className="section-padding bg-gradient-to-r from-kaki-black via-purple-950/20 to-kaki-black border-t border-white/5 relative z-10">
        <div className="container-custom text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-white">Have questions about our Terms?</h2>
          <p className="text-kaki-grey max-w-xl mx-auto mb-8 text-base">
            If you need clarification regarding any section of our terms, please reach out to our team.
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

export default TermsConditions;
