import { ComponentType, lazy } from 'react';

export function lazyRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const hasRefreshed = sessionStorage.getItem('retry-lazy-refreshed') === 'true';

      componentImport()
        .then((component) => {
          sessionStorage.setItem('retry-lazy-refreshed', 'false');
          resolve(component);
        })
        .catch((error) => {
          if (!hasRefreshed) {
            sessionStorage.setItem('retry-lazy-refreshed', 'true');
            window.location.reload();
          } else {
            reject(error);
          }
        });
    });
  });
}
