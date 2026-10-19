import { DEFAULT_SERVICE_PRICING, ServicePricingCategory, ServiceTierItem } from '../data/portfolioContent';

export interface BudgetTierBadge {
  tier: 'basic' | 'standard' | 'premium' | 'package';
  label: string;
  colorClass: string;
  priceRangeText: string;
}

export interface ParsedRange {
  min: number;
  max: number;
  rawMax: number;
  hasPlus: boolean;
}

export interface DynamicTierOption {
  tierKey: 'basic' | 'standard' | 'premium' | 'package';
  name: string; // "Basic", "Standard", "Premium", or "Full Package"
  price: string; // e.g. "$40 - $80"
  description: string; // e.g. "Single image, light editing"
  badgeColorClass: string;
}

/**
 * Normalizes a tier item from potential legacy string or missing structure.
 */
export function normalizeServiceTier(rawTier: any, defaultItem?: ServiceTierItem): ServiceTierItem {
  if (!rawTier) {
    return defaultItem ? { ...defaultItem } : { price: '', description: '' };
  }
  if (typeof rawTier === 'string') {
    return {
      price: rawTier,
      description: defaultItem?.description || '',
    };
  }
  return {
    price: typeof rawTier.price === 'string' ? rawTier.price : (defaultItem?.price || ''),
    description: typeof rawTier.description === 'string' ? rawTier.description : (defaultItem?.description || ''),
  };
}

/**
 * Normalizes an entire category's pricing data.
 */
export function normalizeServicePricingCategory(
  rawCategory: any,
  defaultCategory?: ServicePricingCategory
): ServicePricingCategory {
  const fallback = defaultCategory || {
    basic: { price: '', description: '' },
    standard: { price: '', description: '' },
    premium: { price: '', description: '' },
  };

  if (!rawCategory) {
    return {
      basic: { ...fallback.basic },
      standard: { ...fallback.standard },
      premium: { ...fallback.premium },
    };
  }

  return {
    basic: normalizeServiceTier(rawCategory.basic, fallback.basic),
    standard: normalizeServiceTier(rawCategory.standard, fallback.standard),
    premium: normalizeServiceTier(rawCategory.premium, fallback.premium),
  };
}

/**
 * Retrieves the normalized pricing for a specific service discipline.
 */
export function getCategoryPricing(
  servicePricingMap: any,
  categoryName: string
): ServicePricingCategory {
  const defaultCategory = DEFAULT_SERVICE_PRICING[categoryName] || {
    basic: { price: '', description: '' },
    standard: { price: '', description: '' },
    premium: { price: '', description: '' },
  };

  const raw = servicePricingMap?.[categoryName];
  return normalizeServicePricingCategory(raw, defaultCategory);
}

/**
 * Generates the dynamic pricing options to display in the contact brief form
 * based on the currently selected service.
 * Returns 1 option for "Complete Full-Package Campaign", 3 options (Basic, Standard, Premium) for others,
 * or an empty array if no service is selected.
 */
export function getServicePricingOptions(
  selectedService: string | undefined | null,
  servicePricingMap: any
): DynamicTierOption[] {
  if (!selectedService || !selectedService.trim()) {
    return [];
  }

  const pricing = getCategoryPricing(servicePricingMap, selectedService);
  const isSinglePackage = selectedService === 'Complete Full-Package Campaign';

  if (isSinglePackage) {
    const pkgPrice = pricing.basic.price || '$800 - $5,000+';
    const pkgDesc = pricing.basic.description || 'Full multi-deliverable campaign';
    return [
      {
        tierKey: 'package',
        name: 'Full Package',
        price: pkgPrice,
        description: pkgDesc,
        badgeColorClass:
          'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
      },
    ];
  }

  return [
    {
      tierKey: 'basic',
      name: 'Basic',
      price: pricing.basic.price || '$40 - $80',
      description: pricing.basic.description || 'Single image, light editing',
      badgeColorClass: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
    },
    {
      tierKey: 'standard',
      name: 'Standard',
      price: pricing.standard.price || '$80 - $200',
      description: pricing.standard.description || 'Composite, custom typography',
      badgeColorClass:
        'bg-[#8116E0]/25 text-[#d8b4fe] border-[#8116E0]/50 shadow-[0_0_8px_rgba(129,22,224,0.2)]',
    },
    {
      tierKey: 'premium',
      name: 'Premium',
      price: pricing.premium.price || '$200 - $500+',
      description: pricing.premium.description || 'Complex multi-layer, campaign-level',
      badgeColorClass:
        'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/40 shadow-[0_0_8px_rgba(142,255,1,0.2)]',
    },
  ];
}

/**
 * Parses a price range string (e.g. "$40-$80", "$400 - $1,000", "$1,000-$3,000+") into numeric min and max.
 */
export function parsePriceRange(str: string | undefined | null): ParsedRange | null {
  if (!str || typeof str !== 'string') return null;
  const clean = str.replace(/,/g, '').trim();
  if (!clean) return null;
  const nums = clean.match(/\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) return null;

  const min = parseFloat(nums[0]);
  const rawMax = nums.length > 1 ? parseFloat(nums[1]) : min;
  const hasPlus = clean.includes('+');
  const max = hasPlus ? Math.max(rawMax + 1, rawMax * 1.05) : rawMax;

  return { min, max, rawMax, hasPlus };
}

/**
 * Parses a budget button's display string into its interval.
 */
export function parseBudgetButton(
  btnStr: string,
  index: number,
  totalButtons: number
): { min: number; max: number } {
  const clean = btnStr.replace(/,/g, '');
  const nums = clean.match(/\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) {
    return { min: 0, max: Infinity };
  }

  const min = index === 0 ? 0 : parseFloat(nums[0]);
  const max =
    index === totalButtons - 1
      ? Infinity
      : nums.length > 1
      ? parseFloat(nums[1])
      : parseFloat(nums[0]);

  return { min, max };
}

/**
 * Returns any matching Basic / Standard / Premium / Package badges for legacy button views.
 */
export function getTierBadgesForButton(
  buttonText: string,
  buttonIndex: number,
  totalButtons: number,
  selectedService: string | undefined | null,
  servicePricingMap: any
): BudgetTierBadge[] {
  if (!selectedService || !servicePricingMap) return [];
  const pricing = getCategoryPricing(servicePricingMap, selectedService);

  const btnInterval = parseBudgetButton(buttonText, buttonIndex, totalButtons);
  const badges: BudgetTierBadge[] = [];

  const isSinglePackage = selectedService === 'Complete Full-Package Campaign';

  if (isSinglePackage && pricing.basic.price) {
    const range = parsePriceRange(pricing.basic.price);
    if (range) {
      const overlaps = Math.min(range.max, btnInterval.max) > Math.max(range.min, btnInterval.min);
      if (overlaps) {
        badges.push({
          tier: 'package',
          label: 'Package',
          colorClass:
            'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
          priceRangeText: pricing.basic.price,
        });
      }
    }
    return badges;
  }

  if (pricing.basic.price) {
    const range = parsePriceRange(pricing.basic.price);
    if (range) {
      const overlaps = Math.min(range.max, btnInterval.max) > Math.max(range.min, btnInterval.min);
      if (overlaps) {
        badges.push({
          tier: 'basic',
          label: 'Basic',
          colorClass: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
          priceRangeText: pricing.basic.price,
        });
      }
    }
  }

  if (pricing.standard.price) {
    const range = parsePriceRange(pricing.standard.price);
    if (range) {
      const overlaps = Math.min(range.max, btnInterval.max) > Math.max(range.min, btnInterval.min);
      if (overlaps) {
        badges.push({
          tier: 'standard',
          label: 'Standard',
          colorClass:
            'bg-[#8116E0]/25 text-[#d8b4fe] border-[#8116E0]/50 shadow-[0_0_8px_rgba(129,22,224,0.2)]',
          priceRangeText: pricing.standard.price,
        });
      }
    }
  }

  if (pricing.premium.price) {
    const range = parsePriceRange(pricing.premium.price);
    if (range) {
      const overlaps = Math.min(range.max, btnInterval.max) > Math.max(range.min, btnInterval.min);
      if (overlaps) {
        badges.push({
          tier: 'premium',
          label: 'Premium',
          colorClass:
            'bg-[#8EFF01]/15 text-[#8EFF01] border-[#8EFF01]/40 shadow-[0_0_8px_rgba(142,255,1,0.2)]',
          priceRangeText: pricing.premium.price,
        });
      }
    }
  }

  return badges;
}
