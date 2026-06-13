import { useState, useEffect } from 'react';

export default function useResponsive() {
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width,
        isMobile: width <= 640,
        isTablet: width > 640 && width <= 1024,
        isDesktop: width > 1024,
    };
}
