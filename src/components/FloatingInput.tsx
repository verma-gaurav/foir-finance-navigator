import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  icon,
  className,
  ...props
}) => {
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