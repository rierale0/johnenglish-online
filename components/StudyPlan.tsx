"use client"
import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface StudyPlanProps {
  title: string;
  currency?: string;
  price: string;
  features: string[];
  cta: string;
  ctaBgColor?: string;
  ctaTextColor?: string;
  discount?: string;
  cardBgColor?: string;
  link?: string;
}

const isImagePath = (path: string) => {
  if (!path) return false;
  return path.includes('/') || /\.(jpg|jpeg|png|gif|svg)$/i.test(path);
};

export function StudyPlan({ title, currency, price, features, cta, ctaBgColor = "#7FDEFF", ctaTextColor = "#242239", discount, cardBgColor = "#2C2A4A", link = "#" }: StudyPlanProps) {
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
            {currency && isImagePath(currency) ? (
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
          onClick={() => {
            if (link?.startsWith('http') || link?.startsWith('https')) {
              window.open(link, '_blank');
            } else {
              document.getElementById(link)?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          style={{ 
            background: `
              linear-gradient(145deg, ${ctaBgColor}dd, ${ctaBgColor}99),
              radial-gradient(circle at 30% 20%, #ffffff10 0%, transparent 30%)
            `,
            color: ctaTextColor,
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
          }}
          className="w-full hover:brightness-125 hover:text-white text-md font-regular py-6 shadow-lg hover:shadow-xl transition-all border border-white/5 hover:border-white/20 whitespace-normal min-h-[72px] flex items-center justify-center"
        >
          {cta}
        </Button>
        </CardFooter>
      </div>
    </Card>
  );
}