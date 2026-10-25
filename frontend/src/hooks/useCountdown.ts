import { useEffect, useRef, useState } from "react";

interface UseCountdownResult {
  countdown: number | null;
  startCountdown: () => void;
  cancelCountdown: () => void;
}

/**
 * Runs a countdown and invokes the latest callback when it reaches zero.
 *
 * @param onComplete - Callback invoked at zero.
 * @param durationSeconds - Countdown duration in seconds.
 * @returns Countdown state and start/cancel actions.
 */
export function useCountdown(
  onComplete: () => void,
  durationSeconds: number = 3,
): UseCountdownResult {
  const [countdown, setCountdown] = useState<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (countdown === null) {
      return;
    }

    if (countdown === 0) {
      onCompleteRef.current();
      setCountdown(null);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCountdown((currentValue) =>
        currentValue === null ? null : Math.max(0, currentValue - 1),
      );
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [countdown]);

  function startCountdown(): void {
    setCountdown(durationSeconds);
  }

  function cancelCountdown(): void {
    setCountdown(null);
  }

  return { countdown, startCountdown, cancelCountdown };
}
