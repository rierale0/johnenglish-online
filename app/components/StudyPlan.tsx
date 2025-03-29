"use client"
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StudyPlanProps {
  title: string;
  price: string;
  features: string[];
  cta: string;
  currency?: string;
  cardBgColor?: string;
  ctaBgColor?: string;
  ctaTextColor?: string;
  discount?: string;
  link?: string;
  onClick?: () => void;
  glow?: boolean;
}

export function StudyPlan({
  title,
  price,
  features,
  cta,
  currency,
  cardBgColor = "#3D3F70",
  ctaBgColor = "#7FDEFF",
  ctaTextColor = "black",
  discount,
  link,
  onClick,
  glow = false,
}: StudyPlanProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <Card 
      style={{ 
        background: `
          linear-gradient(145deg, ${cardBgColor}dd, ${cardBgColor}55),
          radial-gradient(circle at 20% 30%, #7FDEFF15 0%, transparent 20%),
          radial-gradient(circle at 80% 20%,rgba(74, 21, 148, 0.36) 0%, transparent 20%),
          radial-gradient(circle at 60% 70%,rgba(173, 156, 95, 0.03) 0%, transparent 20%)
        `,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: glow ? `0 0 15px 5px ${cardBgColor}55, 0 0 30px 10px ${cardBgColor}33, 0 0 45px 15px ${cardBgColor}22` : '',
        animation: glow ? 'glowPulse 3s infinite alternate' : 'none',
      }} 
      className={`px-2 w-full max-w-sm text-white border-none relative border border-white/10 shadow-lg flex flex-col md:min-h-[200px] ${glow ? 'glow-card' : ''}`}
    >
      <style jsx global>{`
        @keyframes glowPulse {
          0% {
            box-shadow: 0 0 15px 5px ${cardBgColor}55, 0 0 30px 10px ${cardBgColor}33, 0 0 45px 15px ${cardBgColor}22;
          }
          50% {
            box-shadow: 0 0 20px 8px ${cardBgColor}66, 0 0 40px 15px ${cardBgColor}44, 0 0 60px 20px ${cardBgColor}33;
          }
          100% {
            box-shadow: 0 0 15px 5px ${cardBgColor}55, 0 0 30px 10px ${cardBgColor}33, 0 0 45px 15px ${cardBgColor}22;
          }
        }
        
        .glow-card::before {
          content: '';
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background: radial-gradient(circle at 50% 50%, ${cardBgColor}22, transparent 60%);
          z-index: -1;
          opacity: 0;
          animation: sparkleEffect 4s infinite;
        }
        
        @keyframes sparkleEffect {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.5; transform: scale(1); }
        }
      `}</style>
      <CardHeader className='space-y-1 pt-10'>
        {discount && (
          <div className="absolute top-4 right-4 bg-[#7FDEFF] text-[#242239] px-3 py-1 rounded-lg font-regular text-xs">
            {discount}
          </div>
        )}
        <CardTitle className="text-[1.7em] font-bold text-left">{title}</CardTitle>
        <CardDescription className="text-left">
          <span className="text-[2em] pt-2 text-white text-[22px] flex items-center gap-1">
            {currency && currency.endsWith('.png') ? (
              <Image src={currency} alt="currency" width={20} height={20} className="object-contain" />
            ) : (
              currency
            )}
            {price}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 pr-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-left">
              <span className="text-md text-gray-300 text-left">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="mt-auto">
        <CardFooter className="pb-5">
          <Button 
          className="w-full text-md font-medium transition-all duration-300 hover:brightness-110"
          style={{
            backgroundColor: ctaBgColor,
            color: ctaTextColor,
          }}
          onClick={handleClick}
        >
          {cta}
        </Button>
        </CardFooter>
      </div>
    </Card>
  );
}