import { useEffect, useState } from "react";

export const useDebounce = <T>(value: T, delay: number = 2000) => {
const [debouncedValue, setDebouncedValue] = useState(value);

useEffect(() => {
    const timeout = setTimeout(() => {
        setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
    }, [value, delay]);

    return debouncedValue;
}