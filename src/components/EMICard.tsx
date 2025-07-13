import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FloatingInput } from './FloatingInput';
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
        <div className="flex-1">
          <FloatingInput
            label={`EMI ${index + 1} amount`}
            type="text"
            value={emi.amount || ''}
            onChange={(e) => onUpdate(emi.id, Number(e.target.value))}
            placeholder="0"
            className="input-calm"
            icon={<IndianRupee className="h-4 w-4" />}
            formatNumber={true}
          />
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