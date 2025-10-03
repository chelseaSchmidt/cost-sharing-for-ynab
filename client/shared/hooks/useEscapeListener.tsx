import { useEffect } from 'react';

export default function useEscapeListener(callback: () => void, condition = true) {
  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Escape') callback();
  }

  useEffect(
    function listenForKeyUp() {
      if (condition) {
        window.addEventListener('keyup', onKeyUp);
      }
      return () => window.removeEventListener('keyup', onKeyUp);
    },
    [condition],
  );
}
