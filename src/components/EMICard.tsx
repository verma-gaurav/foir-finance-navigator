import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndianRupee, Trash2 } from 'lucide-react';

interface EMI {
  id: string;
  amount: number;
}

interface EMICardProps {
  emi: EMI;
  index: number;
  onUpdate: (id: string, amount: number) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export const EMICard: React.FC<EMICardProps> = ({
  emi,
  index,
  onUpdate,
  onRemove,
  canRemove
}) => {
  return (
    <Card className="p-4 border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-soft transition-all duration-300 animate-slide-in">
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`emi-${emi.id}`}>{`EMI ${index + 1} amount`}</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id={`emi-${emi.id}`}
              type="text"
              value={emi.amount ? emi.amount.toLocaleString('en-IN') : ''}
              onChange={(e) => onUpdate(emi.id, Number(e.target.value.replace(/,/g, '')))}
              placeholder="0"
              className="pl-10"
            />
          </div>
        </div>
        
        {canRemove && (
          <Button
            onClick={() => onRemove(emi.id)}
            variant="outline"
            size="sm"
            className="p-2 h-10 w-10 text-destructive hover:text-destructive-foreground hover:bg-destructive/10 border-destructive/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};