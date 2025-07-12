import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, AlertTriangle, XCircle, Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FOIRResultProps {
  foir: number;
  salary: number;
  totalObligations: number;
}

export const FOIRResult: React.FC<FOIRResultProps> = ({
  foir,
  salary,
  totalObligations
}) => {
  const { toast } = useToast();

  const getStatusConfig = (foir: number) => {
    if (foir < 50) {
      return {
        status: 'Excellent',
        message: 'Very Good FOIR! You are loan eligible',
        emoji: '🎯',
        icon: Trophy,
        className: 'status-excellent',
        bgGradient: 'from-success/20 to-success/10',
        borderColor: 'border-success/30'
      };
    } else if (foir >= 50 && foir <= 60) {
      return {
        status: 'Good',
        message: 'Average FOIR. You may qualify for loans',
        emoji: '⚠️',
        icon: TrendingUp,
        className: 'status-good',
        bgGradient: 'from-warning/20 to-warning/10',
        borderColor: 'border-warning/30'
      };
    } else {
      return {
        status: 'Poor',
        message: 'High Risk FOIR. Loan approval may be difficult',
        emoji: '🔴',
        icon: XCircle,
        className: 'status-poor',
        bgGradient: 'from-destructive/20 to-destructive/10',
        borderColor: 'border-destructive/30'
      };
    }
  };

  const config = getStatusConfig(foir);
  const StatusIcon = config.icon;

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "PDF export functionality coming soon! 📄"
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My FOIR Result',
        text: `My FOIR is ${foir.toFixed(2)}% - ${config.status}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`My FOIR is ${foir.toFixed(2)}% - ${config.status}`);
      toast({
        title: "Result Copied!",
        description: "FOIR result copied to clipboard"
      });
    }
  };

  return (
    <Card className={`card-elegant animate-bounce-in bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-card rounded-2xl shadow-soft">
              <StatusIcon className="h-8 w-8 text-foreground" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Your FOIR Result</h3>
              <p className="text-muted-foreground">Fixed Obligations to Income Ratio</p>
            </div>
          </div>
        </div>

        {/* FOIR Score */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-foreground">
              {foir.toFixed(1)}%
            </div>
            <div className={`inline-flex items-center gap-2 ${config.className}`}>
              <span className="text-2xl">{config.emoji}</span>
              <span className="font-semibold">{config.status} FOIR</span>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {config.message}
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-center">Calculation Breakdown</h4>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-card/50 rounded-xl">
              <span className="text-muted-foreground">Monthly Salary:</span>
              <span className="font-semibold">₹{salary.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-card/50 rounded-xl">
              <span className="text-muted-foreground">Total Obligations:</span>
              <span className="font-semibold">₹{totalObligations.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-xl border border-primary/20">
              <span className="text-foreground font-medium">FOIR Calculation:</span>
              <span className="font-bold text-primary">
                {totalObligations.toLocaleString()} ÷ {salary.toLocaleString()} × 100
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleExport}
            variant="outline"
            className="btn-ghost flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          
          <Button 
            onClick={handleShare}
            variant="outline"
            className="btn-ghost flex-1"
          >
            <Share className="h-4 w-4 mr-2" />
            Share Result
          </Button>
        </div>

        {/* Tips */}
        <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
          <h5 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            FOIR Guidelines
          </h5>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Below 50%: Excellent financial health</li>
            <li>• 50-60%: Moderate obligations, manageable</li>
            <li>• Above 60%: High obligations, consider reducing debt</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};