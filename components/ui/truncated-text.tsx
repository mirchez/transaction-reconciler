"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  mobileMaxLength?: number;
  className?: string;
  showTooltip?: boolean;
}

export function TruncatedText({
  text,
  maxLength = 50,
  mobileMaxLength = 25,
  className,
  showTooltip = true,
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (!text) return null;
  
  const currentMaxLength = isMobile ? mobileMaxLength : maxLength;
  const needsTruncation = text.length > currentMaxLength;
  const displayText = needsTruncation && !isExpanded 
    ? `${text.slice(0, currentMaxLength)}...` 
    : text;

  if (!needsTruncation) {
    return <span className={className}>{text}</span>;
  }

  const content = (
    <span 
      className={cn("cursor-pointer hover:text-primary transition-colors", className)}
      onClick={() => setIsExpanded(!isExpanded)}
      title={isExpanded ? "Click to collapse" : "Click to expand"}
    >
      {displayText}
    </span>
  );

  if (!showTooltip || isExpanded) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {content}
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs sm:max-w-sm break-words rounded-none">
        <p className="text-sm">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
}