import { useEffect } from 'react';

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterHandle?: string;
  author?: string;
  robots?: string;
  viewport?: string;
}

/**
 * Hook to manage SEO metadata for individual pages
 * Usage: useSEO({ title: 'My Page', description: '...' })
 */
export const useSEO = (metadata: SEOMetadata) => {
  useEffect(() => {
    // Set title
    document.title = `${metadata.title} | 2CaRvN`;

    // Set or update meta tags
    updateMetaTag('description', metadata.description);
    
    if (metadata.keywords) {
      updateMetaTag('keywords', metadata.keywords);
    }

    if (metadata.robots) {
      updateMetaTag('robots', metadata.robots);
    }

    if (metadata.author) {
      updateMetaTag('author', metadata.author);
    }

    // Set canonical URL
    updateCanonicalTag(metadata.canonical);

    // Open Graph tags for social media
    updateMetaTag('og:title', metadata.ogImage ? metadata.title : undefined, 'property');
    updateMetaTag('og:description', metadata.description, 'property');
    updateMetaTag('og:image', metadata.ogImage || 'https://www.2carvn.com/og-image.png', 'property');
    updateMetaTag('og:type', metadata.ogType || 'website', 'property');
    updateMetaTag('og:url', metadata.ogUrl || getCurrentUrl(), 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image', 'name');
    if (metadata.twitterHandle) {
      updateMetaTag('twitter:creator', metadata.twitterHandle, 'name');
    }

    // Structured data (JSON-LD)
    updateStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': metadata.title,
      'description': metadata.description,
      'url': metadata.canonical || getCurrentUrl(),
      'image': metadata.ogImage || 'https://www.2carvn.com/og-image.png',
      'publisher': {
        '@type': 'Organization',
        'name': '2CaRvN',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://www.2carvn.com/logo.png'
        }
      }
    });
  }, [metadata]);
};

/**
 * Helper function to update meta tags
 */
const updateMetaTag = (
  name: string,
  content: string | undefined,
  attribute: 'name' | 'property' = 'name'
) => {
  if (!content) return;

  let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }

  tag.content = content;
};

/**
 * Helper function to update canonical URL
 */
const updateCanonicalTag = (url: string | undefined) => {
  const currentUrl = url || getCurrentUrl();
  
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = currentUrl;
};

/**
 * Helper function to update structured data (JSON-LD)
 */
const updateStructuredData = (schema: Record<string, any>) => {
  let script = document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.innerHTML = JSON.stringify(schema);
};

/**
 * Helper function to get current URL
 */
const getCurrentUrl = (): string => {
  return typeof window !== 'undefined' ? window.location.href : 'https://www.2carvn.com';
};

/**
 * Default SEO metadata for public pages
 */
export const defaultSEOConfig = {
  home: {
    title: 'Premium Learning Platform - Master Your Skills',
    description: 'Join 2CaRvN and unlock your potential with interactive courses, gamified learning, and expert certifications. Transform your career with quality education.',
    keywords: 'online learning, courses, certifications, skill development, gamified education, premium learning platform',
    ogImage: 'https://www.2carvn.com/og-home.png'
  },
  login: {
    title: 'Sign In to Your Account',
    description: 'Log in to your 2CaRvN account to access your personalized learning dashboard, courses, and progress tracking.',
    keywords: 'login, sign in, 2carvn account',
    robots: 'noindex, follow'
  },
  register: {
    title: 'Create Your Free Account',
    description: 'Join 2CaRvN today and start learning. Sign up for free access to our premium educational platform.',
    keywords: 'register, sign up, create account, join 2carvn',
    robots: 'noindex, follow'
  },
  about: {
    title: 'About 2CaRvN - Our Mission & Vision',
    description: 'Learn about 2CaRvN\'s mission to democratize quality education through innovative learning experiences and cutting-edge technology.',
    keywords: 'about 2carvn, mission, vision, educational platform',
    ogImage: 'https://www.2carvn.com/og-about.png'
  },
  courses: {
    title: 'Browse Our Courses - Learn at Your Own Pace',
    description: 'Explore our comprehensive collection of interactive courses designed by experts. From beginner to advanced levels.',
    keywords: 'courses, online courses, learning, skill development',
    ogImage: 'https://www.2carvn.com/og-courses.png'
  },
  leaderboard: {
    title: 'Public Leaderboard - Top Performers',
    description: 'See how you rank among our top-performing students. Celebrate achievements and get inspired by the community.',
    keywords: 'leaderboard, rankings, achievements, student performance',
    ogImage: 'https://www.2carvn.com/og-leaderboard.png'
  }
};