import React from 'react';
import {
  MessageSquare,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Layers,
  Dribbble,
  Film,
  Facebook,
  Send,
  Pin,
  Mail,
  Globe,
  Link2,
} from 'lucide-react';
import { SocialPlatform, SocialLinkItem } from '../data/portfolioContent';

export interface FormattedLinkResult {
  url: string;
  isValid: boolean;
  error?: string;
  displayHandle: string;
  isMailto: boolean;
}

/**
 * Validates and formats a social platform input (handle, phone, or URL)
 * into a safe, working URL adhering strictly to allowed protocols: https://, mailto:, or wa.me
 */
export function formatSocialUrl(platform: SocialPlatform, rawValue: string): FormattedLinkResult {
  const value = (rawValue || '').trim();

  if (!value) {
    return {
      url: '',
      isValid: false,
      error: 'Value cannot be empty.',
      displayHandle: '',
      isMailto: false,
    };
  }

  // Reject dangerous protocols immediately
  const lower = value.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:') ||
    lower.startsWith('ftp:')
  ) {
    return {
      url: '',
      isValid: false,
      error: 'Protocol not permitted. Only https, mailto, and wa.me are allowed.',
      displayHandle: value,
      isMailto: false,
    };
  }

  switch (platform) {
    case 'WhatsApp': {
      // Handles: 09161889909, +2349161889909, 2349161889909, https://wa.me/2349161889909, wa.me/2349161889909
      let cleanDigits = value.replace(/[^\d+]/g, '');
      if (value.includes('wa.me/')) {
        const afterWaMe = value.split('wa.me/')[1]?.split('?')[0]?.replace(/[^\d]/g, '');
        if (afterWaMe) cleanDigits = afterWaMe;
      }

      // If starts with +, remove +
      if (cleanDigits.startsWith('+')) {
        cleanDigits = cleanDigits.slice(1);
      }

      // If Nigerian standard 11 digits starting with 0 (e.g. 09161889909) -> 2349161889909
      if (cleanDigits.startsWith('0') && cleanDigits.length === 11) {
        cleanDigits = '234' + cleanDigits.slice(1);
      }

      if (!cleanDigits || cleanDigits.length < 7 || cleanDigits.length > 16) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid phone number (e.g. 09161889909 or +234...) or wa.me link.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://wa.me/${cleanDigits}`,
        isValid: true,
        displayHandle: value.startsWith('http') ? `wa.me/${cleanDigits}` : value,
        isMailto: false,
      };
    }

    case 'Instagram': {
      // Handles: @emkayvisuals, emkayvisuals, https://instagram.com/emkayvisuals, instagram.com/emkayvisuals
      let handle = value;
      if (lower.includes('instagram.com/')) {
        const parts = value.split('instagram.com/')[1]?.split('/')[0]?.split('?')[0];
        handle = parts || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle || !/^[a-zA-Z0-9._]+$/.test(handle)) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid Instagram handle (e.g. @emkayvisuals) or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://instagram.com/${handle}`,
        isValid: true,
        displayHandle: `@${handle}`,
        isMailto: false,
      };
    }

    case 'YouTube': {
      // Handles: @handle, channel-id, or full https://youtube.com/...
      if (lower.startsWith('https://') || lower.startsWith('http://')) {
        const secureUrl = value.replace(/^http:\/\//i, 'https://');
        if (!secureUrl.toLowerCase().includes('youtube.com') && !secureUrl.toLowerCase().includes('youtu.be')) {
          return {
            url: '',
            isValid: false,
            error: 'Must be a valid YouTube URL (e.g. https://youtube.com/@...)',
            displayHandle: value,
            isMailto: false,
          };
        }
        return {
          url: secureUrl,
          isValid: true,
          displayHandle: value.replace(/^https?:\/\/(www\.)?youtube\.com\/?/i, '@'),
          isMailto: false,
        };
      }

      const cleanHandle = value.startsWith('@') ? value : `@${value}`;
      return {
        url: `https://youtube.com/${cleanHandle}`,
        isValid: true,
        displayHandle: cleanHandle,
        isMailto: false,
      };
    }

    case 'X/Twitter': {
      let handle = value;
      if (lower.includes('x.com/')) {
        handle = value.split('x.com/')[1]?.split('/')[0]?.split('?')[0] || '';
      } else if (lower.includes('twitter.com/')) {
        handle = value.split('twitter.com/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle || !/^[a-zA-Z0-9_]+$/.test(handle)) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid X/Twitter handle (e.g. @username) or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://x.com/${handle}`,
        isValid: true,
        displayHandle: `@${handle}`,
        isMailto: false,
      };
    }

    case 'LinkedIn': {
      if (lower.startsWith('https://') || lower.startsWith('http://')) {
        const secureUrl = value.replace(/^http:\/\//i, 'https://');
        if (!secureUrl.toLowerCase().includes('linkedin.com')) {
          return {
            url: '',
            isValid: false,
            error: 'Must be a valid LinkedIn URL (https://linkedin.com/...)',
            displayHandle: value,
            isMailto: false,
          };
        }
        return {
          url: secureUrl,
          isValid: true,
          displayHandle: 'LinkedIn Profile',
          isMailto: false,
        };
      }

      const cleanUser = value.replace(/^in\//, '').replace(/^@/, '').trim();
      return {
        url: `https://linkedin.com/in/${cleanUser}`,
        isValid: true,
        displayHandle: `in/${cleanUser}`,
        isMailto: false,
      };
    }

    case 'Behance': {
      let handle = value;
      if (lower.includes('behance.net/')) {
        handle = value.split('behance.net/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid Behance username or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://behance.net/${handle}`,
        isValid: true,
        displayHandle: `behance.net/${handle}`,
        isMailto: false,
      };
    }

    case 'Dribbble': {
      let handle = value;
      if (lower.includes('dribbble.com/')) {
        handle = value.split('dribbble.com/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid Dribbble username or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://dribbble.com/${handle}`,
        isValid: true,
        displayHandle: `dribbble.com/${handle}`,
        isMailto: false,
      };
    }

    case 'TikTok': {
      let handle = value;
      if (lower.includes('tiktok.com/')) {
        handle = value.split('tiktok.com/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid TikTok handle (e.g. @username) or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://tiktok.com/@${handle}`,
        isValid: true,
        displayHandle: `@${handle}`,
        isMailto: false,
      };
    }

    case 'Facebook': {
      let handle = value;
      if (lower.includes('facebook.com/')) {
        handle = value.split('facebook.com/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid Facebook username or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://facebook.com/${handle}`,
        isValid: true,
        displayHandle: `facebook.com/${handle}`,
        isMailto: false,
      };
    }

    case 'Telegram': {
      let handle = value;
      if (lower.includes('t.me/')) {
        handle = value.split('t.me/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid Telegram handle (e.g. @username) or t.me link.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://t.me/${handle}`,
        isValid: true,
        displayHandle: `@${handle}`,
        isMailto: false,
      };
    }

    case 'Pinterest': {
      let handle = value;
      if (lower.includes('pinterest.com/')) {
        handle = value.split('pinterest.com/')[1]?.split('/')[0]?.split('?')[0] || '';
      }
      handle = handle.replace(/^@/, '').trim();

      if (!handle) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid Pinterest username or URL.',
          displayHandle: value,
          isMailto: false,
        };
      }

      return {
        url: `https://pinterest.com/${handle}`,
        isValid: true,
        displayHandle: `pinterest.com/${handle}`,
        isMailto: false,
      };
    }

    case 'Email': {
      let emailAddress = value.replace(/^mailto:/i, '').trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(emailAddress)) {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid email address (e.g. name@domain.com).',
          displayHandle: value,
          isMailto: true,
        };
      }

      return {
        url: `mailto:${emailAddress}`,
        isValid: true,
        displayHandle: emailAddress,
        isMailto: true,
      };
    }

    case 'Website':
    case 'Custom':
    default: {
      let targetUrl = value;
      if (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://') && !targetUrl.startsWith('mailto:')) {
        targetUrl = `https://${targetUrl}`;
      } else if (targetUrl.startsWith('http://')) {
        targetUrl = targetUrl.replace(/^http:\/\//i, 'https://');
      }

      // Check URL validity
      try {
        const parsed = new URL(targetUrl);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'mailto:') {
          return {
            url: '',
            isValid: false,
            error: 'Only https:// or mailto: URLs are supported for custom links.',
            displayHandle: value,
            isMailto: false,
          };
        }
        return {
          url: targetUrl,
          isValid: true,
          displayHandle: parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : ''),
          isMailto: parsed.protocol === 'mailto:',
        };
      } catch {
        return {
          url: '',
          isValid: false,
          error: 'Please enter a valid URL (e.g. https://yourwebsite.com).',
          displayHandle: value,
          isMailto: false,
        };
      }
    }
  }
}

/**
 * Returns visual meta (icon, accent color, tag background) for each platform
 */
export function getPlatformMeta(platform: SocialPlatform) {
  switch (platform) {
    case 'WhatsApp':
      return {
        icon: MessageSquare,
        accentColor: '#25D366',
        badgeBg: 'bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30',
        hoverBorder: 'hover:border-[#25D366]/60',
        cardBg: 'bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366]',
        placeholder: 'e.g. 09161889909 or https://wa.me/2349161889909',
      };
    case 'Instagram':
      return {
        icon: Instagram,
        accentColor: '#E1306C',
        badgeBg: 'bg-[#E1306C]/15 text-[#E1306C] border-[#E1306C]/30',
        hoverBorder: 'hover:border-[#E1306C]/60',
        cardBg: 'bg-[#E1306C]/10 border-[#E1306C]/30 text-[#E1306C]',
        placeholder: 'e.g. @emkayvisuals or https://instagram.com/emkayvisuals',
      };
    case 'YouTube':
      return {
        icon: Youtube,
        accentColor: '#FF0000',
        badgeBg: 'bg-[#FF0000]/15 text-[#FF0000] border-[#FF0000]/30',
        hoverBorder: 'hover:border-[#FF0000]/60',
        cardBg: 'bg-[#FF0000]/10 border-[#FF0000]/30 text-[#FF0000]',
        placeholder: 'e.g. @emkayvisuals or https://youtube.com/@emkayvisuals',
      };
    case 'X/Twitter':
      return {
        icon: Twitter,
        accentColor: '#1DA1F2',
        badgeBg: 'bg-[#1DA1F2]/15 text-[#1DA1F2] border-[#1DA1F2]/30',
        hoverBorder: 'hover:border-[#1DA1F2]/60',
        cardBg: 'bg-[#1DA1F2]/10 border-[#1DA1F2]/30 text-[#1DA1F2]',
        placeholder: 'e.g. @emkayvisuals or https://x.com/emkayvisuals',
      };
    case 'LinkedIn':
      return {
        icon: Linkedin,
        accentColor: '#0A66C2',
        badgeBg: 'bg-[#0A66C2]/15 text-[#0A66C2] border-[#0A66C2]/30',
        hoverBorder: 'hover:border-[#0A66C2]/60',
        cardBg: 'bg-[#0A66C2]/10 border-[#0A66C2]/30 text-[#0A66C2]',
        placeholder: 'e.g. in/emkayvisuals or full profile URL',
      };
    case 'Behance':
      return {
        icon: Layers,
        accentColor: '#0057FF',
        badgeBg: 'bg-[#0057FF]/15 text-[#0057FF] border-[#0057FF]/30',
        hoverBorder: 'hover:border-[#0057FF]/60',
        cardBg: 'bg-[#0057FF]/10 border-[#0057FF]/30 text-[#0057FF]',
        placeholder: 'e.g. emkayvisuals or https://behance.net/emkayvisuals',
      };
    case 'Dribbble':
      return {
        icon: Dribbble,
        accentColor: '#EA4C89',
        badgeBg: 'bg-[#EA4C89]/15 text-[#EA4C89] border-[#EA4C89]/30',
        hoverBorder: 'hover:border-[#EA4C89]/60',
        cardBg: 'bg-[#EA4C89]/10 border-[#EA4C89]/30 text-[#EA4C89]',
        placeholder: 'e.g. emkayvisuals or https://dribbble.com/emkayvisuals',
      };
    case 'TikTok':
      return {
        icon: Film,
        accentColor: '#00F2FE',
        badgeBg: 'bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30',
        hoverBorder: 'hover:border-[#00F2FE]/60',
        cardBg: 'bg-[#00F2FE]/10 border-[#00F2FE]/30 text-[#00F2FE]',
        placeholder: 'e.g. @emkayvisuals or https://tiktok.com/@emkayvisuals',
      };
    case 'Facebook':
      return {
        icon: Facebook,
        accentColor: '#1877F2',
        badgeBg: 'bg-[#1877F2]/15 text-[#1877F2] border-[#1877F2]/30',
        hoverBorder: 'hover:border-[#1877F2]/60',
        cardBg: 'bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2]',
        placeholder: 'e.g. emkayvisuals or https://facebook.com/emkayvisuals',
      };
    case 'Telegram':
      return {
        icon: Send,
        accentColor: '#229ED9',
        badgeBg: 'bg-[#229ED9]/15 text-[#229ED9] border-[#229ED9]/30',
        hoverBorder: 'hover:border-[#229ED9]/60',
        cardBg: 'bg-[#229ED9]/10 border-[#229ED9]/30 text-[#229ED9]',
        placeholder: 'e.g. @emkayvisuals or https://t.me/emkayvisuals',
      };
    case 'Pinterest':
      return {
        icon: Pin,
        accentColor: '#E60023',
        badgeBg: 'bg-[#E60023]/15 text-[#E60023] border-[#E60023]/30',
        hoverBorder: 'hover:border-[#E60023]/60',
        cardBg: 'bg-[#E60023]/10 border-[#E60023]/30 text-[#E60023]',
        placeholder: 'e.g. @emkayvisuals or https://pinterest.com/emkayvisuals',
      };
    case 'Email':
      return {
        icon: Mail,
        accentColor: '#8EFF01',
        badgeBg: 'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/30',
        hoverBorder: 'hover:border-[#8EFF01]/60',
        cardBg: 'bg-[#8EFF01]/10 border-[#8EFF01]/30 text-[#8EFF01]',
        placeholder: 'e.g. emkayvisuals@gmail.com',
      };
    case 'Website':
      return {
        icon: Globe,
        accentColor: '#FEFFFC',
        badgeBg: 'bg-white/10 text-white border-white/20',
        hoverBorder: 'hover:border-white/50',
        cardBg: 'bg-white/10 border-white/20 text-white',
        placeholder: 'e.g. https://emkayvisuals.github.io',
      };
    case 'Custom':
    default:
      return {
        icon: Link2,
        accentColor: '#8EFF01',
        badgeBg: 'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/30',
        hoverBorder: 'hover:border-[#8EFF01]/60',
        cardBg: 'bg-[#8EFF01]/10 border-[#8EFF01]/30 text-[#8EFF01]',
        placeholder: 'e.g. https://...',
      };
  }
}

/**
 * Returns all social link items with resolved URLs and validity flags
 */
export function getResolvedSocialLinks(
  socials: any
): Array<SocialLinkItem & FormattedLinkResult & { id: string }> {
  if (!socials) return [];

  const rawList: SocialLinkItem[] =
    Array.isArray(socials.links) && socials.links.length > 0
      ? socials.links
      : [
          {
            id: 'link-whatsapp',
            platform: 'WhatsApp' as SocialPlatform,
            label: 'WhatsApp Direct',
            value: socials.whatsapp || '09161889909',
            description: socials.whatsappDisplay || '09161889909',
            visible: true,
          },
          {
            id: 'link-ig-main',
            platform: 'Instagram' as SocialPlatform,
            label: 'Instagram (Main)',
            value: socials.instagramDesigns?.handle || '@emkayvisuals',
            description: socials.instagramDesigns?.label || 'Graphic and motion designs',
            visible: true,
          },
          {
            id: 'link-ig-fx',
            platform: 'Instagram' as SocialPlatform,
            label: 'Instagram (FX & Art)',
            value: socials.instagramFx?.handle || '@emkayvisuals_fx',
            description: socials.instagramFx?.label || 'Digital art and photo manipulations',
            visible: true,
          },
          {
            id: 'link-email',
            platform: 'Email' as SocialPlatform,
            label: 'Direct Email',
            value: socials.email || 'emkayvisuals@gmail.com',
            description: socials.email || 'emkayvisuals@gmail.com',
            visible: true,
          },
          {
            id: 'link-behance',
            platform: 'Behance' as SocialPlatform,
            label: 'Behance',
            value: socials.behance || 'https://behance.net/emkayvisuals',
            description: 'Case studies & full portfolio',
            visible: true,
          },
          {
            id: 'link-dribbble',
            platform: 'Dribbble' as SocialPlatform,
            label: 'Dribbble',
            value: socials.dribbble || 'https://dribbble.com/emkayvisuals',
            description: 'Visual explorations & shots',
            visible: true,
          },
        ];

  return rawList.map((item, idx) => {
    const id = item.id || `social-link-${idx}-${Date.now()}`;
    const formatted = formatSocialUrl(item.platform, item.value);
    return {
      ...item,
      id,
      ...formatted,
    };
  });
}
