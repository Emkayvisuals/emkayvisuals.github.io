import React from 'react';
import { AdminTabProps } from './types';
import { SaveButton } from './SaveButton';
import { DEFAULT_SERVICE_PRICING, ServicePricingMap } from '../../data/portfolioContent';
import { getCategoryPricing } from '../../lib/pricingGuidance';
import { DollarSign, RotateCcw, Sparkles, Layers, Check } from 'lucide-react';

export const AdminServicePricingTab: React.FC<AdminTabProps> = ({
  content,
  onChange,
  onSave,
  saveState,
}) => {
  const contact = content.contact || ({} as any);
  const servicesOptions: string[] =
    contact.servicesOptions && contact.servicesOptions.length > 0
      ? contact.servicesOptions
      : Object.keys(DEFAULT_SERVICE_PRICING);

  const rawPricingMap = contact.servicePricing || {};

  const handleFieldChange = (
    category: string,
    tier: 'basic' | 'standard' | 'premium',
    field: 'price' | 'description',
    value: string
  ) => {
    const currentCategory = getCategoryPricing(rawPricingMap, category);
    const updatedCategory = {
      ...currentCategory,
      [tier]: {
        ...currentCategory[tier],
        [field]: value,
      },
    };

    const updatedMap: ServicePricingMap = {
      ...DEFAULT_SERVICE_PRICING,
      ...rawPricingMap,
      [category]: updatedCategory,
    };

    onChange({
      ...content,
      contact: {
        ...contact,
        servicePricing: updatedMap,
      },
    });
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset all service pricing tiers and descriptions to the default matrices?'
      )
    ) {
      onChange({
        ...content,
        contact: {
          ...contact,
          servicePricing: { ...DEFAULT_SERVICE_PRICING },
        },
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header with Title, Reset, and Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-[#FEFFFC]">
            <DollarSign className="w-6 h-6 text-[#8EFF01]" />
            Service Pricing Tiers
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Configure the price range and short description for each service&apos;s tiers (Basic, Standard, Premium).
            These dynamically replace the fixed budget buttons in the client brief form when a service is selected.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            title="Restore all default service tiers and descriptions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <SaveButton
            onSave={() => onSave('Service Pricing')}
            state={saveState}
            label="Save Pricing"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#8EFF01]/10 border border-[#8EFF01]/30 flex items-center justify-center shrink-0 text-[#8EFF01] mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1.5 leading-relaxed text-white/75">
          <p className="font-semibold text-white">How Dynamic Pricing Tiers Work:</p>
          <p>
            When a visitor selects a discipline in <span className="text-[#8EFF01] font-semibold">Service Required</span>,
            the brief form automatically renders that service&apos;s 3 pricing options (Basic, Standard, Premium) with the price prominently featured,
            the tier badge underneath, and the short description below.
          </p>
          <p className="text-white/50 text-[11px]">
            For <span className="font-semibold text-white/70">&quot;Complete Full-Package Campaign&quot;</span>, a single full-width option is displayed.
            Visitors can click any tier to select their estimated budget, which is saved with their project brief.
          </p>
        </div>
      </div>

      {/* Service Categories List */}
      <div className="space-y-5">
        {servicesOptions.map((serviceName, idx) => {
          const pricing = getCategoryPricing(rawPricingMap, serviceName);
          const isSinglePackage = serviceName === 'Complete Full-Package Campaign';

          return (
            <div
              key={serviceName}
              className="p-4 sm:p-5 rounded-2xl bg-[#0c0c0c] border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-sm"
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-mono flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                    {serviceName}
                  </h3>
                  {isSinglePackage ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Single Option
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#8EFF01]/10 text-[#8EFF01] border border-[#8EFF01]/30">
                      3 Tiers
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-white/40 font-mono">
                  {isSinglePackage ? (
                    <span>{pricing.basic.price || '$800 - $5,000+'}</span>
                  ) : (
                    <span>
                      {pricing.basic.price} &bull; {pricing.standard.price} &bull; {pricing.premium.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Tier Inputs */}
              {isSinglePackage ? (
                <div className="space-y-4 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Price Range */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Price Range (Plain Text)
                      </label>
                      <input
                        type="text"
                        value={pricing.basic.price || ''}
                        placeholder="e.g. $800 - $5,000+"
                        onChange={(e) =>
                          handleFieldChange(serviceName, 'basic', 'price', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder-white/20 focus:border-amber-400 outline-none font-mono transition-colors"
                      />
                    </div>

                    {/* Short Description */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={pricing.basic.description || ''}
                        placeholder="e.g. Full multi-deliverable campaign"
                        onChange={(e) =>
                          handleFieldChange(serviceName, 'basic', 'description', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-white placeholder-white/20 focus:border-amber-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Mini Preview */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-center">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider block">Brief Form Preview:</span>
                    <div className="py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center gap-0.5 max-w-md mx-auto">
                      <span className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-[0.5px] rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
                        Full Package
                      </span>
                      <div className="text-sm font-bold text-white leading-tight">{pricing.basic.price || '$800 - $5,000+'}</div>
                      <p className="text-[9.5px] text-white/50 leading-tight">{pricing.basic.description || 'Full multi-deliverable campaign'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Basic Tier */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                            Basic Tier
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40">Entry level</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/60 block">Price Range</label>
                        <input
                          type="text"
                          value={pricing.basic.price || ''}
                          placeholder="e.g. $40 - $80"
                          onChange={(e) =>
                            handleFieldChange(serviceName, 'basic', 'price', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs sm:text-sm text-white placeholder-white/20 focus:border-sky-400 outline-none font-mono transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/60 block">Short Description</label>
                        <input
                          type="text"
                          value={pricing.basic.description || ''}
                          placeholder="e.g. Single image, light editing"
                          onChange={(e) =>
                            handleFieldChange(serviceName, 'basic', 'description', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white placeholder-white/20 focus:border-sky-400 outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Standard Tier */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#8116E0]"></span>
                          <span className="text-xs font-bold text-[#d8b4fe] uppercase tracking-wider">
                            Standard Tier
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40">Most Popular</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/60 block">Price Range</label>
                        <input
                          type="text"
                          value={pricing.standard.price || ''}
                          placeholder="e.g. $80 - $200"
                          onChange={(e) =>
                            handleFieldChange(serviceName, 'standard', 'price', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs sm:text-sm text-white placeholder-white/20 focus:border-[#8116E0] outline-none font-mono transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/60 block">Short Description</label>
                        <input
                          type="text"
                          value={pricing.standard.description || ''}
                          placeholder="e.g. Composite, custom typography"
                          onChange={(e) =>
                            handleFieldChange(serviceName, 'standard', 'description', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white placeholder-white/20 focus:border-[#8116E0] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Premium Tier */}
                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#8EFF01]"></span>
                          <span className="text-xs font-bold text-[#8EFF01] uppercase tracking-wider">
                            Premium Tier
                          </span>
                        </div>
                        <span className="text-[10px] text-white/40">High-End Scope</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/60 block">Price Range</label>
                        <input
                          type="text"
                          value={pricing.premium.price || ''}
                          placeholder="e.g. $200 - $500+"
                          onChange={(e) =>
                            handleFieldChange(serviceName, 'premium', 'price', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs sm:text-sm text-white placeholder-white/20 focus:border-[#8EFF01] outline-none font-mono transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] text-white/60 block">Short Description</label>
                        <input
                          type="text"
                          value={pricing.premium.description || ''}
                          placeholder="e.g. Complex multi-layer, campaign-level"
                          onChange={(e) =>
                            handleFieldChange(serviceName, 'premium', 'description', e.target.value)
                          }
                          className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/10 text-xs text-white placeholder-white/20 focus:border-[#8EFF01] outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider block">Live Brief Form Preview:</span>
                    <div className="space-y-1.5 max-w-xl mx-auto">
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center gap-0.5 text-center">
                          <span className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-[0.5px] rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/35">
                            Basic
                          </span>
                          <div className="text-sm font-bold text-white leading-tight">{pricing.basic.price || '$40 - $80'}</div>
                          <p className="text-[9.5px] text-white/50 leading-tight line-clamp-2">{pricing.basic.description || 'Single image, light editing'}</p>
                        </div>

                        <div className="py-2 px-2.5 rounded-xl bg-[#8EFF01] border-2 border-[#8EFF01] flex flex-col items-center justify-center gap-0.5 text-center shadow-[0_0_15px_rgba(142,255,1,0.2)]">
                          <span className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-[0.5px] rounded-full bg-black/90 text-white border border-black/40">
                            Standard
                          </span>
                          <div className="text-sm font-bold text-[#050505] leading-tight">{pricing.standard.price || '$80 - $200'}</div>
                          <p className="text-[9.5px] text-black/80 font-medium leading-tight line-clamp-2">{pricing.standard.description || 'Composite, custom typography'}</p>
                          <span className="text-[7px] text-black/60 uppercase font-bold tracking-widest">(Selected State)</span>
                        </div>
                      </div>

                      <div className="w-full py-2 px-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col items-center justify-center gap-0.5 text-center">
                        <span className="text-[7.5px] font-bold uppercase tracking-wider px-1.5 py-[0.5px] rounded-full bg-[#8EFF01]/15 text-[#8EFF01] border border-[#8EFF01]/40">
                          Premium
                        </span>
                        <div className="text-sm font-bold text-white leading-tight">{pricing.premium.price || '$200 - $500+'}</div>
                        <p className="text-[9.5px] text-white/50 leading-tight line-clamp-2">{pricing.premium.description || 'Complex multi-layer, campaign-level'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
