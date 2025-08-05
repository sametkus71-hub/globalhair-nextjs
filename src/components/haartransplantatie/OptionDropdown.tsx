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
  size?: 'small' | 'medium';
}

export const OptionDropdown = ({ options, value, onChange, size = 'medium' }: OptionDropdownProps) => {
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
            "rounded-none font-header font-medium transition-all duration-300",
            "text-gray-800 hover:bg-gray-50 focus:outline-none focus:bg-gray-50",
            "first:rounded-l-full last:rounded-r-full",
            size === 'small' ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs"
          )}
        >
          {value}
          <ChevronDown className={cn(
            "ml-0.5 opacity-40 inline",
            size === 'small' ? "w-2 h-2" : "w-2.5 h-2.5"
          )} />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-1 bg-white border border-gray-200 shadow-lg rounded-md" 
        align="center"
      >
        <div className="flex flex-col space-y-0.5">
          {options.map((option) => (
            <button
              key={option}
              className={cn(
                "text-left h-auto rounded-sm font-medium transition-all duration-200",
                option === value 
                  ? "bg-gray-100 text-gray-900" 
                  : "text-gray-700 hover:bg-gray-50",
                size === 'small' ? "text-xs py-1 px-2" : "text-xs py-1.5 px-2.5"
              )}
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