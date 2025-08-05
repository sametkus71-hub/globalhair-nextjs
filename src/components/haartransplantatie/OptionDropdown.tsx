import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface OptionDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const OptionDropdown = ({ options, value, onChange }: OptionDropdownProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "rounded-full font-header text-xs font-medium transition-all duration-300 px-3 py-1.5",
            value
              ? "text-gray-900"
              : "text-white/80 hover:text-white"
          )}
          style={value ? {
            background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))'
          } : {}}
        >
          {value}
          <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-40 inline" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-1 border border-white/10 shadow-xl rounded-md backdrop-blur-sm" 
        align="center"
        style={{
          background: 'linear-gradient(145deg, rgba(80,80,80,0.95), rgba(50,50,50,0.95))'
        }}
      >
        <div className="flex flex-col space-y-0.5">
          {options.map((option) => (
            <button
              key={option}
              className={cn(
                "text-left text-xs h-auto py-1.5 px-2.5 rounded-sm font-medium transition-all duration-300",
                option === value 
                  ? "text-gray-900" 
                  : "text-white/80 hover:text-white"
              )}
              style={option === value ? {
                background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))'
              } : {}}
              onClick={() => handleSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};