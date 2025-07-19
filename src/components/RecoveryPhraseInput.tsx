import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RecoveryPhraseInputProps {
  onChange: (value: string) => void;
  value: string;
  className?: string;
  placeholder?: string;
}

const RecoveryPhraseInput: React.FC<RecoveryPhraseInputProps> = ({ 
  onChange, 
  value, 
  className,
  placeholder = "Enter your 15 words recovery Phrase"
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.style.opacity = "1";
        inputRef.current.style.transform = "translateY(0)";
        inputRef.current.focus();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "relative transition-all duration-300 w-full",
      isFocused ? "scale-[1.01]" : "",
    )}>
      <textarea
        autoFocus={true}
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={cn(
          "recovery-input min-h-[150px] opacity-0 transform translate-y-[10px] transition-all duration-500",
          "placeholder:text-gray-500 resize-none",
          isFocused ? "shadow-lg" : "",
          className
        )}
        style={{ 
          backgroundColor: 'rgba(26, 31, 44, 0.95)',
          backdropFilter: 'blur(5px)'
        }}
      />
      {isFocused && (
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          {value.split(/\s+/).filter(word => word.length > 0).length} / 15 words
        </div>
      )}
    </div>
  );
};

export default RecoveryPhraseInput;