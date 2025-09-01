export interface CustomDomain {
  businessSlug: string;
  customDomain: string;
  isActive: boolean;
  createdAt: Date;
  businessName: string;
  region: string;
}

export const DOMAIN_CONFIG = {
  // Main domain that YOU already own - no customer purchases needed
  mainDomain: 'www.nubarber.com',
  // Reserved subdomains that can't be used by customers
  reservedSubdomains: ['www', 'api', 'admin', 'app', 'dashboard', 'auth', 'login', 'signup'],
  // Minimum length for business slugs
  minSlugLength: 3,
  // Maximum length for business slugs
  maxSlugLength: 30,
};

export class DomainService {
  /**
   * Generate a business slug from business name
   * Converts "Harry's Barbers" to "harrysbarbers"
   */
  static generateBusinessSlug(businessName: string): string {
    return businessName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .replace(/\s+/g, '') // Remove spaces
      .substring(0, DOMAIN_CONFIG.maxSlugLength);
  }

  /**
   * Generate the default subdomain URL for any barbershop
   * Example: "harrysbarbers" becomes "harrysbarbers.nubarber.com"
   * NOTE: You already own nubarber.com, customers get subdomains automatically
   */
  static getDefaultSubdomainUrl(businessSlug: string): string {
    return `https://${businessSlug}.${DOMAIN_CONFIG.mainDomain}`;
  }

  /**
   * Get the current Vercel deployment URL (fallback)
   */
  static getCurrentUrl(businessSlug: string): string {
    // This should be replaced with your actual Vercel domain
    return `https://www.nubarber.com/public/${businessSlug}`;
  }

  /**
   * Validate if a business slug is available
   */
  static validateBusinessSlug(businessSlug: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (businessSlug.length < DOMAIN_CONFIG.minSlugLength) {
      errors.push(`Business slug must be at least ${DOMAIN_CONFIG.minSlugLength} characters`);
    }

    if (businessSlug.length > DOMAIN_CONFIG.maxSlugLength) {
      errors.push(`Business slug must be no more than ${DOMAIN_CONFIG.maxSlugLength} characters`);
    }

    if (!/^[a-z0-9]+$/.test(businessSlug)) {
      errors.push('Business slug can only contain lowercase letters and numbers');
    }

    if (DOMAIN_CONFIG.reservedSubdomains.includes(businessSlug)) {
      errors.push(`"${businessSlug}" is a reserved subdomain and cannot be used`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get all available domains for a business
   * NOTE: Customers do NOT need to purchase domains - they get subdomains automatically
   */
  static getAvailableDomains(businessName: string): {
    primary: string;
    alternatives: string[];
    current: string;
  } {
    const businessSlug = this.generateBusinessSlug(businessName);
    const validation = this.validateBusinessSlug(businessSlug);

    if (!validation.isValid) {
      // Generate alternative slug if primary is invalid
      const alternativeSlug = businessSlug + Math.floor(Math.random() * 1000);
      return {
        primary: this.getDefaultSubdomainUrl(alternativeSlug),
        alternatives: [this.getDefaultSubdomainUrl(businessSlug)],
        current: this.getCurrentUrl(businessSlug)
      };
    }

    return {
      primary: this.getDefaultSubdomainUrl(businessSlug),
      alternatives: [],
      current: this.getCurrentUrl(businessSlug)
    };
  }

  /**
   * Create a custom domain mapping (for future use with database)
   */
  static async createCustomDomain(
    businessSlug: string, 
    customDomain: string,
    businessName: string,
    region: string
  ): Promise<CustomDomain> {
    const domain: CustomDomain = {
      businessSlug,
      customDomain,
      isActive: true,
      createdAt: new Date(),
      businessName,
      region
    };
    
    return domain;
  }

  /**
   * Get custom domain for a business (for future use with database)
   */
  static async getCustomDomain(businessSlug: string): Promise<CustomDomain | null> {
    // This would integrate with your database to get custom domain mappings
    // For now, return null to use default subdomain structure
    return null;
  }
} 