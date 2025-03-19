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
      }} 
      className="w-full max-w-sm text-white border-none relative border border-white/10 shadow-lg flex flex-col md:min-h-[450px]"
    >
      <CardHeader className='space-y-0.2 pt-14'>
        {discount && (
          <div className="absolute top-4 right-4 bg-[#7FDEFF] text-[#242239] px-3 py-1 rounded-lg font-regular text-xs">
            {discount}
          </div>
        )}
        <CardTitle className="text-xl font-bold text-left">{title}</CardTitle>
        <CardDescription className="text-left">
          <span className="text-lg text-white text-[22px] flex items-center gap-1">
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
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-left">
              <span className="text-sm text-gray-300 text-left">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <div className="mt-auto">
        <CardFooter className="pb-5">
          <Button 
          className="w-full text-sm font-medium transition-all duration-300 hover:brightness-110"
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