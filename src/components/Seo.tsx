import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  image?: string;
};

export const Seo = ({ title, description, image }: SeoProps) => {
  useEffect(() => {
    document.title = title;

    const updateMeta = (name: string, value: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    updateMeta('description', description);
    updateMeta('og:title', title);
    updateMeta('og:description', description);
    if (image) {
      updateMeta('og:image', image);
    }
  }, [description, image, title]);

  return null;
};