import React, { useState, useEffect, useRef } from 'react';
import { PORTFOLIO_CONTENT, WEB3FORMS_ACCESS_KEY } from '../data/portfolioContent';
import { saveProjectBrief } from '../lib/analytics';
import { getResolvedSocialLinks, getPlatformMeta } from '../lib/socialLinks';
import { CustomDropdown } from './CustomDropdown';
import {
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowUpRight,
  Loader2,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface AnimatedCheckmarkProps {
  shouldReduceMotion?: boolean | null;
}

const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({ shouldReduceMotion }) => {
  return (
    <motion.div
      className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 sm:mb-6 flex items-center justify-center shrink-0"
      initial={{ scale: shouldReduceMotion ? 1 : 0.85, opacity: shouldReduceMotion ? 1 : 0 }}
      animate={
        shouldReduceMotion
          ? { scale: 1, opacity: 1 }
          : {
              scale: [0.85, 1, 1.08, 1],
              opacity: 1,
            }
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 1.15,
        times: [0, 0.45, 0.88, 1],
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-hidden="true"
    >
      {/* Outer Faint Violet #8116E0 Glow */}
      <motion.div
        className="absolute -inset-3 rounded-full bg-[#8116E0]/25 blur-2xl pointer-events-none"
        initial={{ opacity: shouldReduceMotion ? 0.6 : 0, scale: 0.8 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.6, scale: 1 }
            : {
                opacity: [0, 0.3, 0.75, 0.45],
                scale: [0.8, 1, 1.2, 1],
              }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 1.2,
          times: [0, 0.4, 0.88, 1],
          ease: 'easeOut',
        }}
      />

      {/* Inner Soft Yellow #8EFF01 Glow */}
      <motion.div
        className="absolute inset-1 rounded-full bg-[#8EFF01]/20 blur-xl pointer-events-none"
        initial={{ opacity: shouldReduceMotion ? 0.6 : 0, scale: 0.8 }}
        animate={
          shouldReduceMotion
            ? { opacity: 0.6, scale: 1 }
            : {
                opacity: [0, 0.35, 0.85, 0.55],
                scale: [0.8, 0.95, 1.15, 1],
              }
        }
        transition={{
          duration: shouldReduceMotion ? 0 : 1.2,
          times: [0, 0.4, 0.88, 1],
          ease: 'easeOut',
        }}
      />

      {/* SVG Checkmark */}
      <svg
        viewBox="0 0 96 96"
        className="w-full h-full relative z-10 overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Step 1: Clockwise sweep circle outline (~0.5s) */}
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          stroke="#8EFF01"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ transformOrigin: '48px 48px', rotate: -90 }}
          initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.5,
            ease: [0.65, 0, 0.35, 1],
          }}
        />

        {/* Step 2: Inner Checkmark path (~0.35s ease-out after circle sweep) */}
        <motion.path
          d="M28 48 L42 62 L68 36"
          stroke="#8EFF01"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: shouldReduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.35,
            delay: shouldReduceMotion ? 0 : 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </svg>
    </motion.div>
  );
};

interface ContactSectionProps {
  prefilledService?: string;
  prefilledProject?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  prefilledService,
  prefilledProject,
}) => {
  const { contact, socials } = PORTFOLIO_CONTENT;

  if (contact?.enabled === false) {
    return null;
  }

  const badgeMain = contact?.badgeMain || 'Commission //';
  const badgeAccent = contact?.badgeAccent || 'Available';
  const headingMain = contact?.headingMain || 'Let’s Construct Your Next';
  const headingAccent = contact?.headingAccent || 'Visual Landmark';
  const subtext =
    contact?.subtext ||
    'Whether you need a full visual identity system, high-end motion graphics, or theatrical key art, brief me on your project below. Serious inquiries typically receive a comprehensive proposal within 4 hours.';
  const directChannelsTitle = contact?.directChannelsHeading || 'Direct Channels';
  const whatsappButtonText = contact?.whatsappCardTitle || 'Chat on WhatsApp';
  const emailButtonText = contact?.emailCardTitle || 'Direct Email';
  const copyEmailText = contact?.copyEmailText || 'Click to copy email';
  const copySuccessText = contact?.copiedEmailText || 'Email copied to clipboard!';
  const formCardTitle = contact?.formTitle || 'Project Inquiry & Commission Brief';
  const formStepIndicator = contact?.formStepBadge || 'Step 01 // Form';
  const nameLabel = contact?.nameLabel || 'Your Name / Company *';
  const namePlaceholder = contact?.namePlaceholder || 'e.g. Elena Rostova / Aether Records';
  const emailLabel = contact?.emailLabel || 'Your Email Address *';
  const emailPlaceholder = contact?.emailPlaceholder || 'name@company.com';
  const deadlineLabel = contact?.deadlineLabel || 'Target Deadline / Timeline';
  const deadlinePlaceholder = contact?.deadlinePlaceholder || 'e.g. Next 3 weeks / Flexible';
  const referenceLabel = contact?.referenceLinkLabel || 'Reference Link / Moodboard URL (Optional)';
  const referencePlaceholder = contact?.referenceLinkPlaceholder || 'https://...';
  const serviceLabel = contact?.serviceLabel || 'Service Required';
  const budgetLabel = contact?.budgetLabel || 'Estimated Budget Tier (USD)';
  const messageLabel = contact?.messageLabel || 'Project Vision & Deliverables *';
  const messagePlaceholder =
    contact?.messagePlaceholder ||
    'Tell me about your release date, narrative references, dimensions, sound/theme inspirations, and key deliverables...';
  const submitButtonText = contact?.submitButtonText || 'Send Project Brief';
  const submitLoadingText = contact?.submittingButtonText || 'Sending Project Brief...';
  const confirmationTitle =
    (contact as any)?.confirmationTitle ||
    contact?.successTitle ||
    'We Got The Brief!';
  const confirmationMessage =
    (contact as any)?.confirmationMessage ||
    contact?.successMessage ||
    "Thanks for trusting me with your project. I'll review the details and get back to you within 24/48 hours.";
  const confirmationClosing =
    (contact as any)?.confirmationClosing ||
    (contact as any)?.confirmationTagline ||
    "Ideas received. Let's create.";
  const successButtonText = contact?.sendAnotherButtonText || 'Send Another Brief';
  const responseTime = contact?.responseTime || 'Average response time: < 4 hours worldwide';

  const servicesOptions =
    contact?.servicesOptions && contact.servicesOptions.length > 0
      ? contact.servicesOptions
      : [
          'Posters & Art Prints',
          'Club & Event Flyers',
          'Visual Branding & Identity',
          'Movie Posters & Key Art',
          'Photo Manipulation & Composite',
          'Music / Album Covers',
          'High-CTR Thumbnail Design',
          'Motion Graphics & Video Animation',
          'Complete Full-Package Campaign',
        ];

  const budgetRanges = contact?.budgetRanges || [
    '$50 - $500',
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $7,500',
    '$7,500 - $10,000',
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: servicesOptions[0] || 'Posters & Art Prints',
    budget: budgetRanges[0] || '$50 - $500',
    deadline: '',
    message: '',
    referenceLink: '',
    website: '', // honeypot spam protection
  });

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const confirmationCardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Auto-scroll confirmation card into view on successful submission
  useEffect(() => {
    if (submitted && confirmationCardRef.current) {
      setTimeout(() => {
        confirmationCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    }
  }, [submitted]);

  // If user clicked "Request Quote" or "Inquire Similar Project", prefill form
  useEffect(() => {
    if (prefilledService) {
      setFormData((prev) => ({
        ...prev,
        service:
          servicesOptions.find((s) => s.toLowerCase().includes(prefilledService.toLowerCase())) ||
          prefilledService,
        message: prev.message ? prev.message : `Hi Emkay, I would like to inquire about your ${prefilledService} service.`,
      }));
    }
  }, [prefilledService, servicesOptions]);

  useEffect(() => {
    if (prefilledProject) {
      setFormData((prev) => ({
        ...prev,
        message: `Hi Emkay, I was looking at your portfolio project "${prefilledProject}" and would love to discuss a similar design/motion scope for our upcoming project.`,
      }));
    }
  }, [prefilledProject]);

  const validateForm = () => {
    const errors: { name?: string; email?: string; message?: string } = {};

    if (!formData.name.trim()) {
      errors.name = 'Please provide your name or brand name.';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must be under 100 characters.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Please enter a valid email address.';
    } else if (!emailPattern.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format (e.g. name@domain.com).';
    } else if (formData.email.trim().length > 100) {
      errors.email = 'Email must be under 100 characters.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please provide brief details about your project.';
    } else if (formData.message.trim().length < 5) {
      errors.message = 'Please provide a bit more detail (at least 5 characters).';
    } else if (formData.message.trim().length > 2000) {
      errors.message = 'Message must be under 2000 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setErrorMessage(null);

    // Spam honeypot check
    if (formData.website) {
      setSubmitted(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    let emailSent = false;
    let firestoreSaved = false;

    // 1. Send email notification via Web3Forms
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY || 'f8ddaf24-13a1-40b4-8a3e-ae9f7dd15423',
          to: 'emkayvisuals@gmail.com',
          to_email: 'emkayvisuals@gmail.com',
          name: formData.name.trim(),
          email: formData.email.trim(),
          service: formData.service,
          budget: formData.budget,
          deadline: formData.deadline.trim() || 'Flexible',
          message: formData.message.trim(),
          reference_link: formData.referenceLink.trim(),
          subject: `New Project Brief from ${formData.name.trim()} - Emkay Visuals`,
          from_name: formData.name.trim(),
          replyto: formData.email.trim(),
        }),
      });

      const data = await response.json();
      // Verify Web3Forms actually returned success, not just that the network request completed
      if (response.ok && data?.success === true) {
        emailSent = true;
      } else {
        console.error('Web3Forms did not return success:', data?.message || data);
      }
    } catch (err: unknown) {
      console.error('Web3Forms error:', err);
    }

    // 2. Save to Firestore for the Project Briefs tab in /admin (Both must happen on every submission)
    try {
      const saved = await saveProjectBrief({
        name: formData.name.trim(),
        email: formData.email.trim(),
        service: formData.service,
        budget: formData.budget,
        deadline: formData.deadline.trim() || 'Flexible',
        message: formData.message.trim(),
        referenceLink: formData.referenceLink.trim(),
      });
      if (saved !== false) {
        firestoreSaved = true;
      }
    } catch (err: unknown) {
      console.error('Firestore save error:', err);
    }

    if (emailSent || firestoreSaved) {
      setSubmitted(true);
    } else {
      setErrorMessage(
        'Unable to dispatch submission at this moment. Please connect directly on WhatsApp!'
      );
    }
    setLoading(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Pre-formatted WhatsApp link including current message draft if any
  const whatsappFallbackUrl = `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    formData.name
      ? `Hi Emkay, my name is ${formData.name}. I'm inquiring about ${formData.service} (${formData.budget}). Project details: ${formData.message}`
      : `Hi Emkay, I saw your portfolio and would like to discuss a project!`
  )}`;

  const visibleChannels = getResolvedSocialLinks(socials).filter(
    (item) => item.visible !== false && item.isValid
  );

  const getDesktopGridCols = (count: number) => {
    if (count <= 3) return 'sm:grid-cols-3 lg:grid-cols-3';
    if (count === 4) return 'sm:grid-cols-4 lg:grid-cols-4';
    if (count === 5) return 'sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5';
    if (count === 6) return 'sm:grid-cols-3 lg:grid-cols-3';
    if (count === 7 || count === 8) return 'sm:grid-cols-4 lg:grid-cols-4';
    return 'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5';
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Soft Glows */}
      <div
        className="pointer-events-none absolute top-10 left-10 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.115]"
        style={{ background: '#8116E0' }}
      />
      <div
        className="pointer-events-none absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full blur-[150px] opacity-[0.092]"
        style={{ background: '#8EFF01' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Direct Links & Instant Comms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/[0.04] border border-[#8116E0]/40 text-[#8EFF01] text-[11px] sm:text-xs font-semibold tracking-wide mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {badgeMain}{' '}
                {badgeAccent && (
                  <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                    {badgeAccent}
                  </span>
                )}
              </span>
            </div>

            <h2 className="font-montserrat font-medium italic text-xl sm:text-3xl lg:text-4xl text-[#8EFF01] tracking-tight leading-[1.15] mb-2.5 sm:mb-3">
              {headingMain}{' '}
              <span className="font-cormorant italic font-medium sm:font-semibold text-[1.12em] text-[#FEFFFC]">
                {headingAccent}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-white/70 font-normal leading-relaxed mb-5 sm:mb-6">
              {subtext}
            </p>

            {/* Direct Connect Action Buttons (Compact Grid) */}
            <div className="mb-4 sm:mb-5">
              <span className="text-[11px] font-semibold text-white/45 tracking-wide block mb-2">
                {directChannelsTitle}
              </span>

              <div
                className={`grid ${
                  visibleChannels.length < 3
                    ? visibleChannels.length === 1
                      ? 'grid-cols-1'
                      : 'grid-cols-2'
                    : 'grid-cols-3'
                } ${getDesktopGridCols(visibleChannels.length)} gap-2 sm:gap-2.5`}
              >
                {visibleChannels.map((item, idx) => {
                  const meta = getPlatformMeta(item.platform);
                  const IconComp = meta.icon;
                  const isExternal = !item.isMailto;

                  return (
                    <motion.a
                      key={item.id || idx}
                      href={item.url}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      title={item.description || item.displayHandle || `${item.label || item.platform} (${item.platform})`}
                      id={`contact-channel-${item.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`}
                      whileHover={{ scale: 1.025, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative flex flex-col justify-between p-2.5 sm:p-3 rounded-xl glass-panel border border-white/10 ${meta.hoverBorder} transition-all duration-300 min-h-[96px] sm:min-h-[102px] bg-[#050505]/75 hover:bg-[#0c0c0c] overflow-hidden`}
                    >
                      {/* Top Row: Branded Icon (32-34px) + Subtle Arrow */}
                      <div className="flex items-start justify-between gap-1 w-full mb-1.5">
                        <div
                          className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 border ${meta.cardBg}`}
                        >
                          <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>
                        <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white/35 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                      </div>

                      {/* Bottom Info: Platform Name (wraps if long) + Colored Label Pill */}
                      <div className="min-w-0 w-full flex flex-col items-start gap-1">
                        <span className="font-montserrat font-bold text-xs sm:text-[13px] text-[#FEFFFC] block leading-[1.25] break-words line-clamp-2 group-hover:text-[#8EFF01] transition-colors">
                          {item.label || item.platform}
                        </span>
                        <span
                          className={`inline-block text-[8px] sm:text-[9px] font-semibold px-1.5 py-0.5 rounded-full border max-w-full truncate leading-none ${meta.badgeBg}`}
                        >
                          {item.platform}
                        </span>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Quick Copy Email action */}
            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-[#8EFF01] transition-colors py-2 cursor-pointer min-h-[44px]"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#8EFF01]" />
                  <span className="text-[#8EFF01] font-medium">{copySuccessText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>
                    {copyEmailText} ({socials.email})
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-white/45 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8EFF01] animate-pulse"></span>
            <span>{responseTime}</span>
          </div>
        </motion.div>

        {/* Right Column: Interactive Inquiry Form with Web3Forms */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <div className="rounded-2xl sm:rounded-3xl glass-panel border border-white/12 p-4 sm:p-6 md:p-8 bg-[#080808] shadow-2xl relative overflow-hidden">
            {/* Corner Tech Glow */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#8116E0]/10 blur-3xl pointer-events-none" />

            {submitted ? (
              <motion.div
                ref={confirmationCardRef}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, scale: 0.93, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[500px] mx-auto rounded-[20px] sm:rounded-[24px] bg-[#0B0B0B] border border-white/12 p-6 sm:p-8 md:p-9 shadow-[0_0_40px_rgba(129,22,224,0.2),0_15px_35px_rgba(0,0,0,0.85)] relative overflow-hidden text-center flex flex-col items-center justify-center"
              >
                {/* Soft Violet Glow Backdrop */}
                <div
                  className="absolute -top-20 -right-20 w-48 h-48 bg-[#8116E0]/20 rounded-full blur-3xl pointer-events-none -z-10"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#8116E0]/20 rounded-full blur-3xl pointer-events-none -z-10"
                  aria-hidden="true"
                />

                {/* Animated Circular SVG Checkmark */}
                <AnimatedCheckmark shouldReduceMotion={shouldReduceMotion} />

                {/* 1. Top, bold heading in the website's yellow #8EFF01, Montserrat Bold */}
                <motion.h3
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 0.9,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-montserrat font-bold text-xl sm:text-2xl md:text-[26px] text-[#8EFF01] tracking-tight mb-2.5 sm:mb-3 text-center leading-tight"
                >
                  {confirmationTitle}
                </motion.h3>

                {/* 2. Middle paragraph, white/light grey #FEFFFC at reduced opacity, Montserrat Regular */}
                <motion.p
                  initial={{ opacity: shouldReduceMotion ? 0.75 : 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 0.75, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 1.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-montserrat font-normal text-xs sm:text-sm text-[#FEFFFC]/75 leading-relaxed max-w-[400px] mx-auto text-center mb-0"
                >
                  {confirmationMessage}
                </motion.p>

                {/* Small yellow divider line between paragraph and closing line */}
                <motion.div
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, scaleX: shouldReduceMotion ? 1 : 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.3,
                    delay: shouldReduceMotion ? 0 : 1.18,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="w-10 h-[2px] bg-[#8EFF01] rounded-full mx-auto my-4 sm:my-5 shrink-0 shadow-[0_0_8px_rgba(142, 255, 1, 0.3)] origin-center"
                  aria-hidden="true"
                />

                {/* 3. Bottom line, centered, in Cormorant Garamond Italic, white, slightly larger than paragraph */}
                <motion.p
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 1.28,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-cormorant italic text-base sm:text-lg md:text-[19px] text-[#FEFFFC] font-medium tracking-wide text-center"
                >
                  "{confirmationClosing.replace(/^["']|["']$/g, '')}"
                </motion.p>

                {/* Action Buttons: Send Another Brief / WhatsApp Direct */}
                <motion.div
                  initial={{ opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.4,
                    delay: shouldReduceMotion ? 0 : 1.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mt-6 pt-1 flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        service: servicesOptions[0] || '',
                        budget: budgetRanges[0] || '$50 - $500',
                        deadline: '',
                        message: '',
                        referenceLink: '',
                        website: '',
                      });
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FEFFFC] text-xs font-semibold font-montserrat transition-all duration-200 cursor-pointer min-h-[40px] flex items-center justify-center"
                  >
                    {successButtonText}
                  </button>
                  <a
                    href={socials.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold font-montserrat transition-colors min-h-[40px] flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Follow up on WhatsApp</span>
                  </a>
                </motion.div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10">
                  <h3 className="font-montserrat font-medium italic text-base sm:text-lg text-[#8EFF01]">
                    {formCardTitle}
                  </h3>
                  <span className="text-xs font-semibold text-[#FEFFFC]/70">
                    {formStepIndicator}
                  </span>
                </div>

                {/* Error Banner with WhatsApp fallback button */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs sm:text-sm text-red-200 font-medium">
                          {errorMessage}
                        </p>
                        <p className="text-[11px] text-red-300/70 mt-0.5">
                          You can also chat directly on WhatsApp right away.
                        </p>
                      </div>
                    </div>

                    <a
                      href={whatsappFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 px-4 py-2 rounded-full bg-[#25D366] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(37,211,102,0.3)] min-h-[40px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </motion.div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                      {nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={namePlaceholder}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (validationErrors.name) {
                          setValidationErrors({ ...validationErrors, name: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors min-h-[46px] ${
                        validationErrors.name
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
                          : 'border-white/10 focus:border-[#8EFF01] focus:ring-1 focus:ring-[#8EFF01]'
                      }`}
                    />
                    {validationErrors.name && (
                      <span className="text-[11px] text-red-400 mt-1 block">
                        {validationErrors.name}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                      {emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (validationErrors.email) {
                          setValidationErrors({ ...validationErrors, email: undefined });
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors min-h-[46px] ${
                        validationErrors.email
                          ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
                          : 'border-white/10 focus:border-[#8EFF01] focus:ring-1 focus:ring-[#8EFF01]'
                      }`}
                    />
                    {validationErrors.email && (
                      <span className="text-[11px] text-red-400 mt-1 block">
                        {validationErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Deadline & Reference Link Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                      {deadlineLabel}
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      placeholder={deadlinePlaceholder}
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#8EFF01] focus:ring-1 focus:ring-[#8EFF01] text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors min-h-[46px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                      {referenceLabel}
                    </label>
                    <input
                      type="url"
                      maxLength={250}
                      placeholder={referencePlaceholder}
                      value={formData.referenceLink}
                      onChange={(e) => setFormData({ ...formData, referenceLink: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 focus:border-[#8EFF01] focus:ring-1 focus:ring-[#8EFF01] text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors min-h-[46px]"
                    />
                  </div>
                </div>

                {/* Hidden Honeypot Field for Spam Protection */}
                <div aria-hidden="true" style={{ opacity: 0, position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>

                {/* Service Selection */}
                <div>
                  <CustomDropdown
                    id="brief-service-required"
                    name="service"
                    label={serviceLabel}
                    modalTitle="Select a Service"
                    options={servicesOptions}
                    value={formData.service}
                    onChange={(val) => setFormData({ ...formData, service: val })}
                    required
                  />
                </div>

                {/* Budget Range - 2 columns on mobile (3 rows for 6 items), 3 columns on desktop */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                    {budgetLabel}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {budgetRanges.map((b) => {
                      const isSelected = formData.budget === b;
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: b })}
                          className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center min-h-[44px] flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#8EFF01] text-[#050505] font-bold shadow-[0_0_15px_rgba(142, 255, 1, 0.19)]'
                              : 'bg-white/[0.04] border border-white/10 text-white/70 hover:border-white/20'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message / Project Specs */}
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-2 tracking-wide">
                    {messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (validationErrors.message) {
                        setValidationErrors({ ...validationErrors, message: undefined });
                      }
                    }}
                    className={`w-full px-4 py-3 rounded-xl bg-black/60 border text-sm text-[#FEFFFC] placeholder-white/25 outline-none transition-colors resize-none ${
                      validationErrors.message
                        ? 'border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-500'
                        : 'border-white/10 focus:border-[#8EFF01] focus:ring-1 focus:ring-[#8EFF01]'
                    }`}
                  />
                  {validationErrors.message && (
                    <span className="text-[11px] text-red-400 mt-1 block">
                      {validationErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit Pill Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  id="contact-form-submit"
                  whileHover={loading ? {} : { scale: 1.012, boxShadow: '0 0 60px rgba(142, 255, 1, 0.95)' }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                  className={`w-full py-2.5 sm:py-3 rounded-full bg-[#8EFF01] text-[#050505] font-extrabold text-xs sm:text-sm tracking-wide shadow-[0_0_45px_rgba(142, 255, 1, 0.75)] transition-all duration-300 flex items-center justify-center gap-2 min-h-[42px] sm:min-h-[44px] ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 text-[#050505] animate-spin" />
                      <span>{submitLoadingText}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#050505] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                      <span>{submitButtonText}</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
