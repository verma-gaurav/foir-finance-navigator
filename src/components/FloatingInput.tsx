import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const formatNumber = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Add commas for thousands
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseNumber = (value: string): number => {
  // Remove commas and convert to number
  return Number(value.replace(/,/g, ''));
};

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  icon,
  className,
  onChange,
  value,
  type,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number' && onChange) {
      const formattedValue = formatNumber(e.target.value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: parseNumber(formattedValue).toString()
        }
      };
      onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    } else if (onChange) {
      onChange(e);
    }
  };

  const displayValue = type === 'number' && value ? formatNumber(value.toString()) : value;
  return (
    <div className="floating-label-group">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          {...props}
          type={type}
          value={displayValue}
          onChange={handleChange}
          placeholder=" "
          className={cn(
            "floating-input transition-all duration-300 border-2 focus:border-ring",
            icon && "pl-10",
            className
          )}
        />
        <label className={cn("floating-label", icon && "left-10")}>
          {label}
        </label>
      </div>
    </div>
  );
};