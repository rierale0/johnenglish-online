'use client'
import { Button } from "@/components/ui/button";

interface ScrollButtonProps {
    link?: string;
    bgColor?: string;
    textColor?: string;
}

export function ScrollButton({ link = "#", bgColor = "7FDEFF", textColor = "#242239" }: ScrollButtonProps) {
  return (
    <Button 
      onClick={() => document.getElementById(link)?.scrollIntoView({ behavior: 'smooth' })}
      style={{
        background: `linear-gradient(145deg, ${bgColor}dd, ${bgColor}99),
                    radial-gradient(circle at 30% 20%, #ffffff10 0%, transparent 30%)`,
        color: textColor,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
      className="mt-6 w-full max-w-xl mx-auto hover:brightness-110 hover:text-white font-bold text-[24px] py-8 px-8 cursor-pointer transition-all shadow-lg hover:shadow-xl"
    >
      Empieza ya
    </Button>
  );
}