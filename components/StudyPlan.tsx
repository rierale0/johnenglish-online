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
}

const isImagePath = (path: string) => {
  if (!path) return false;
  return path.includes('/') || /\.(jpg|jpeg|png|gif|svg)$/i.test(path);
};

export function StudyPlan({ title, currency, price, features, cta, ctaBgColor = "#7FDEFF", ctaTextColor = "#242239", discount }: StudyPlanProps) {
  return (
    <Card className="w-full max-w-sm bg-[#2C2A4A] text-white border-[#8FB3BF] border-[0.5px] relative">
      <CardHeader className='space-y-0.2 pt-14'>
        {discount && (
          <div className="absolute top-4 right-4 bg-[#7FDEFF] text-[#242239] px-3 py-1 rounded-lg font-medium text-sm">
            {discount}
          </div>
        )}
        <CardTitle className="text-2xl font-bold text-left">{title}</CardTitle>
        <CardDescription className="text-left">
          <span className="text-3xl text-white text-[22px] flex items-center gap-1">
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
            <li key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full bg-[${ctaBgColor}] hover:bg-[#907AD6] hover:text-white text-[${ctaTextColor}] text-md font-extralight py-6`}
        >
          {cta}
        </Button>
      </CardFooter>
    </Card>
  );
}