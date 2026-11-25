import { useEffect, useState } from 'react';

interface MediaAvailabilityState {
  available: boolean;
  checking: boolean;
}

export function useMediaAvailability(url: string): MediaAvailabilityState {
  const [state, setState] = useState<MediaAvailabilityState>({
    available: false,
    checking: true,
  });

  useEffect(() => {
    if (!url) {
      setState({ available: false, checking: false });
      return;
    }

    let cancelled = false;
    setState({ available: false, checking: true });

    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (cancelled) return;
        const contentType = res.headers.get('content-type') ?? '';
        const isHtmlFallback = contentType.includes('text/html');
        setState({
          available: res.ok && !isHtmlFallback,
          checking: false,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ available: false, checking: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}
