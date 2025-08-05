import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface OptionDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const OptionDropdown = ({ label, options, value, onChange }: OptionDropdownProps) => {
  return (
    <div className="flex flex-col items-center">
      <span className="text-white/80 text-xs mb-1">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:text-white px-3 py-1.5 h-auto text-sm min-w-[100px] justify-between"
          >
            {value}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-lg" align="center">
          <div className="flex flex-col space-y-1">
            {options.map((option) => (
              <Button
                key={option}
                variant={option === value ? "default" : "ghost"}
                className="justify-start text-sm h-auto py-2 px-3"
                onClick={() => onChange(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};