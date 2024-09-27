import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  animationData: object;
  width?: string;
  height?: string;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({ animationData, width = '100%', height = '100%' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: containerRef.current!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData,
    });

    return () => anim.destroy();
  }, [animationData]);

  return <div ref={containerRef} style={{ width, height }} />;
};

export default LottieAnimation;
