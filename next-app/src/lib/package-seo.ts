export type Country = 'nl' | 'tr';
export type Tier = 'Standard' | 'Premium' | 'Elite';
export type Language = 'nl' | 'en';

export const getPackageSEO = (country: Country, tier: Tier, language: Language) => {
    // Normalize tier input to ensure capitalization matches keys
    const normalizedTier = (tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()) as Tier;

    // Default to Standard if invalid tier
    const safeTier = ['Standard', 'Premium', 'Elite'].includes(normalizedTier) ? normalizedTier : 'Standard';

    // Default to nl if invalid country
    const safeCountry = ['nl', 'tr'].includes(country) ? country : 'nl';

    const seoData = {
        nl: {
            Standard: {
                nl: {
                    title: 'Standard Haartransplantatie - FUE Saffier & Comfort Verdoving | GlobalHair Institute',
                    description: 'Een complete start. Onze Standard haartransplantatie bevat de precieze FUE Saffier methode met Comfort Verdoving voor een natuurlijk en pijnloos resultaat.'
                },
                en: {
                    title: 'Standard Hair Transplant - FUE Sapphire & Comfort Anesthesia | GlobalHair Institute',
                    description: 'A complete start. Our Standard hair transplant includes the precise FUE Sapphire method with Comfort Anesthesia for a natural and painless result.'
                }
            },
            Premium: {
                nl: {
                    title: 'Premium Haartransplantatie - GHI Stemcell Repair™ | GlobalHair Institute',
                    description: 'Ons meest gekozen pakket. Combineert FUE Saffier met onze unieke GHI Stemcell Repair™ voor 20-35% meer haardichtheid en sneller herstel.'
                },
                en: {
                    title: 'Premium Hair Transplant - GHI Stemcell Repair™ | GlobalHair Institute',
                    description: 'Our most chosen package. Combines FUE Sapphire with our unique GHI Stemcell Repair™ for 20-35% more hair density and faster recovery.'
                }
            },
            Elite: {
                nl: {
                    title: 'Elite Haartransplantatie - Slaapnarcose & V6 Hairboost® | GlobalHair Institute',
                    description: 'De ultieme behandeling. Exclusief inclusief Full Comfort Anesthesia (slaapnarcose) en het volledige V6 Hairboost® traject voor maximaal volume.'
                },
                en: {
                    title: 'Elite Hair Transplant - Sleep Anesthesia & V6 Hairboost® | GlobalHair Institute',
                    description: 'The ultimate treatment. Exclusively including Full Comfort Anesthesia (sleep anesthesia) and the complete V6 Hairboost® trajectory for maximum volume.'
                }
            }
        },
        tr: {
            Standard: {
                nl: {
                    title: 'Standard Haartransplantatie Turkije - FUE Saffier & All-Inclusive | GlobalHair Institute',
                    description: 'Bekijk ons Standard pakket in Turkije. FUE Saffier haartransplantatie inclusief 5-sterren verblijf, VIP transfers en Comfort Verdoving.'
                },
                en: {
                    title: 'Standard Hair Transplant Turkey - FUE Sapphire & All-Inclusive | GlobalHair Institute',
                    description: 'View our Standard package in Turkey. FUE Sapphire hair transplant including 5-star stay, VIP transfers and Comfort Anesthesia.'
                }
            },
            Premium: {
                nl: {
                    title: 'Premium Haartransplantatie Turkije - Stemcell Repair™ & VIP | GlobalHair Institute',
                    description: 'Luxe en resultaat. Premium haartransplantatie in Turkije met GHI Stemcell Repair™, 5-sterren hotel en volledige ontzorging.'
                },
                en: {
                    title: 'Premium Hair Transplant Turkey - Stemcell Repair™ & VIP | GlobalHair Institute',
                    description: 'Luxury and results. Premium hair transplant in Turkey with GHI Stemcell Repair™, 5-star hotel and complete care.'
                }
            },
            Elite: {
                nl: {
                    title: 'Elite Haartransplantatie - Slaapnarcose & V6 Hairboost® | GlobalHair Institute',
                    description: 'Het Elite pakket is exclusief beschikbaar in Nederland voor de hoogste kwaliteit en persoonlijke begeleiding.'
                },
                en: {
                    title: 'Elite Hair Transplant - Sleep Anesthesia & V6 Hairboost® | GlobalHair Institute',
                    description: 'The Elite package is exclusively available in Netherlands for the highest quality and personal guidance.'
                }
            }
        }
    };

    return seoData[safeCountry][safeTier][language];
};
