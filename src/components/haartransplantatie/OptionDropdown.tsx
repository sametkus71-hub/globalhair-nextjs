import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface OptionDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const OptionDropdown = ({ options, value, onChange, className }: OptionDropdownProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost"
          className={`px-3 py-1.5 h-auto text-xs font-medium hover:bg-transparent focus:bg-transparent rounded-none border-0 shadow-none ${className}`}
        >
          {value}
          <ChevronDown className="w-2.5 h-2.5 ml-1 opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-1 bg-white border border-gray-200 shadow-lg rounded-lg" align="center">
        <div className="flex flex-col space-y-0.5">
          {options.map((option) => (
            <Button
              key={option}
              variant={option === value ? "default" : "ghost"}
              className={`justify-start text-sm h-auto py-2 px-3 rounded-md font-medium ${
                option === value 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => onChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};