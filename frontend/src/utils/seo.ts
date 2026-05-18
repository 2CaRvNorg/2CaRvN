/**
 * SEO Utility Functions
 * Helper functions for managing SEO across the application
 */

/**
 * Generate JSON-LD schema for various page types
 */
export const generateSchema = {
  /**
   * Organization schema
   */
  organization: () => ({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': '2CaRvN',
    'url': 'https://www.2carvn.com',
    'logo': 'https://www.2carvn.com/logo.png',
    'description': 'Premium educational platform with interactive courses, gamified learning, and professional certifications',
    'sameAs': [
      'https://twitter.com/2carvn',
      'https://www.linkedin.com/company/2carvn',
      'https://www.facebook.com/2carvn'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+1-XXX-XXX-XXXX',
      'contactType': 'Customer Service',
      'email': 'support@2carvn.com'
    }
  }),

  /**
   * Educational course schema
   */
  course: (course: {
    name: string;
    description: string;
    instructor?: string;
    rating?: number;
    reviews?: number;
    students?: number;
  }) => ({
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.name,
    'description': course.description,
    'provider': {
      '@type': 'Organization',
      'name': '2CaRvN'
    },
    'instructor': course.instructor ? {
      '@type': 'Person',
      'name': course.instructor
    } : undefined,
    'aggregateRating': course.rating ? {
      '@type': 'AggregateRating',
      'ratingValue': course.rating,
      'ratingCount': course.reviews || 0
    } : undefined,
    'educationalLevel': 'Beginner to Advanced',
    'author': {
      '@type': 'Organization',
      'name': '2CaRvN'
    }
  }),

  /**
   * BreadcrumbList schema for navigation
   */
  breadcrumb: (items: Array<{ name: string; url: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  }),

  /**
   * LocalBusiness schema
   */
  localBusiness: () => ({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': '2CaRvN',
    'image': 'https://www.2carvn.com/logo.png',
    'description': 'Premium educational platform',
    'telephone': '+1-XXX-XXX-XXXX',
    'email': 'support@2carvn.com',
    'url': 'https://www.2carvn.com',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'US',
      'addressRegion': 'State',
      'addressLocality': 'City'
    }
  }),

  /**
   * FAQ Page schema
   */
  faqPage: (faqs: Array<{ question: string; answer: string }>) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  })
};

/**
 * Sitemap utilities
 */
export const sitemapUtils = {
  /**
   * Generate a URL entry for sitemap
   */
  createUrl: (
    loc: string,
    lastmod?: string,
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
    priority?: number
  ) => ({
    loc,
    lastmod: lastmod || new Date().toISOString().split('T')[0],
    changefreq: changefreq || 'monthly',
    priority: priority !== undefined ? priority : 0.5
  }),

  /**
   * Format sitemap URLs to XML
   */
  formatToXML: (urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>) => {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const urlsetClose = '</urlset>';

    const urlEntries = urls.map(url => `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`).join('\n');

    return xmlHeader + urlsetOpen + urlEntries + '\n' + urlsetClose;
  }
};

/**
 * Escape special XML characters
 */
const escapeXml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Social media sharing utilities
 */
export const socialShare = {
  /**
   * Generate Twitter share URL
   */
  twitterShare: (url: string, text: string, handle?: string) => {
    const params = new URLSearchParams({
      url,
      text,
      via: handle || '2carvn'
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  },

  /**
   * Generate Facebook share URL
   */
  facebookShare: (url: string, hashtag?: string) => {
    const params = new URLSearchParams({
      u: url,
      ...(hashtag && { hashtag })
    });
    return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
  },

  /**
   * Generate LinkedIn share URL
   */
  linkedInShare: (url: string, title?: string, summary?: string) => {
    const params = new URLSearchParams({
      url,
      ...(title && { title }),
      ...(summary && { summary })
    });
    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
  },

  /**
   * Generate WhatsApp share URL
   */
  whatsappShare: (text: string, url: string) => {
    const message = encodeURIComponent(`${text}\n${url}`);
    return `https://wa.me/?text=${message}`;
  }
};

/**
 * Analytics and Tracking utilities
 */
export const trackingUtils = {
  /**
   * Track page view for analytics
   */
  trackPageView: (pagePath: string, pageTitle: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  },

  /**
   * Track custom event
   */
  trackEvent: (eventName: string, eventData: Record<string, any>) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', eventName, eventData);
    }
  },

  /**
   * Set user ID for analytics
   */
  setUserId: (userId: string) => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        'user_id': userId
      });
    }
  }
};

/**
 * Canonical URL utilities
 */
export const canonicalUrl = {
  /**
   * Get canonical URL for a page
   */
  getCanonical: (path: string): string => {
    return `https://www.2carvn.com${path}`;
  },

  /**
   * Validate if URL should have canonical tag
   */
  shouldHaveCanonical: (path: string): boolean => {
    const publicPaths = ['/', '/about', '/login', '/register', '/courses-preview', '/public-leaderboard', '/faq', '/blog'];
    return publicPaths.some(p => path.startsWith(p));
  }
};

/**
 * Performance utilities for SEO
 */
export const performanceUtils = {
  /**
   * Preload critical resources
   */
  preloadResource: (href: string, as: string) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = as;
      link.href = href;
      document.head.appendChild(link);
    }
  },

  /**
   * Add prefetch for navigation
   */
  prefetchResource: (href: string) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  },

  /**
   * Get Core Web Vitals for performance monitoring
   */
  measureCoreWebVitals: () => {
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      return true; // Integrate with web-vitals library
    }
    return false;
  }
};