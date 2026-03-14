import { useEffect } from 'react';

export default function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
  }, [description, title]);
}
