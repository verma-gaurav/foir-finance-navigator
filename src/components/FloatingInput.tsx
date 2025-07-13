import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  formatNumber?: boolean;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  icon,
  className,
  formatNumber = false,
  value,
  onChange,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (formatNumber && value) {
      const stringValue = Array.isArray(value) ? value[0]?.toString() || '' : value.toString();
      const numValue = parseFloat(stringValue.replace(/,/g, ''));
      if (!isNaN(numValue) && numValue > 0) {
        setDisplayValue(numValue.toLocaleString());
      } else {
        setDisplayValue('');
      }
    } else {
      const stringValue = Array.isArray(value) ? value[0]?.toString() || '' : value?.toString() || '';
      setDisplayValue(stringValue);
    }
  }, [value, formatNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (formatNumber) {
      // Remove all non-digit characters except decimal point
      const numericValue = inputValue.replace(/[^\d.]/g, '');
      const numValue = parseFloat(numericValue);
      
      if (!isNaN(numValue)) {
        setDisplayValue(numValue.toLocaleString());
        // Call the original onChange with the numeric value
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: numericValue
            }
          };
          onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        }
      } else {
        setDisplayValue('');
        if (onChange) {
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: ''
            }
          };
          onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        }
      }
    } else {
      setDisplayValue(inputValue);
      if (onChange) {
        onChange(e);
      }
    }
  };

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