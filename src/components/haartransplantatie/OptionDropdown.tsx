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
}

export const OptionDropdown = ({ options, value, onChange }: OptionDropdownProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/95 backdrop-blur-sm border-white/30 text-gray-800 hover:bg-white hover:text-gray-900 px-4 py-3 h-auto text-sm font-medium rounded-xl shadow-sm min-w-[120px] justify-between"
        >
          {value}
          <ChevronDown className="w-4 h-4 ml-2 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-white border border-gray-200 shadow-xl rounded-xl" align="center">
        <div className="flex flex-col space-y-1">
          {options.map((option) => (
            <Button
              key={option}
              variant={option === value ? "default" : "ghost"}
              className={`justify-start text-sm h-auto py-3 px-4 rounded-lg font-medium ${
                option === value 
                  ? "bg-blue-500 text-white hover:bg-blue-600" 
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