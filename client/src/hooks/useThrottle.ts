import { useState, useEffect } from "react";

// Custom Throttle Hook
const useThrottle = <T>(value: T, delay: number): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const [isCooldown, setIsCooldown] = useState<boolean>(false);

    useEffect(() => {
        if (!isCooldown) {
            setThrottledValue(value);
            setIsCooldown(true);
            setTimeout(() => {
                setIsCooldown(false);
            }, delay);
        }
    }, [value, delay, isCooldown]);

    return throttledValue;
};

export default useThrottle;
