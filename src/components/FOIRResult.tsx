import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, AlertTriangle, XCircle, Download, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface FOIRResultProps {
  foir: number;
  salary: number;
  totalObligations: number;
  emis?: Array<{ id: string; amount: number }>;
  creditCardOutstanding?: number;
}

export const FOIRResult: React.FC<FOIRResultProps> = ({
  foir,
  salary,
  totalObligations,
  emis = [],
  creditCardOutstanding = 0
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

  const handleExport = async () => {
    try {
      const doc = new jsPDF();
      
      // Add logo
      const logoImg = new Image();
      logoImg.src = '/lovable-uploads/a6844765-7365-44d4-be7b-4593394a3944.png';
      
      logoImg.onload = () => {
        // Header with logo and title
        doc.addImage(logoImg, 'PNG', 20, 15, 25, 25);
        doc.setFontSize(22);
        doc.setTextColor(220, 53, 69);
        doc.text('FOIR Calculation Report', 55, 30);
        
        // Date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 150, 20);
        
        // FOIR Result Box
        doc.setFillColor(240, 248, 255);
        doc.rect(20, 50, 170, 40, 'F');
        doc.setDrawColor(59, 130, 246);
        doc.rect(20, 50, 170, 40);
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('Your FOIR Result', 105, 65, { align: 'center' });
        
        doc.setFontSize(24);
        doc.setTextColor(config.status === 'Excellent' ? 22 : config.status === 'Good' ? 245 : 220, 
                         config.status === 'Excellent' ? 163 : config.status === 'Good' ? 158 : 53, 
                         config.status === 'Excellent' ? 74 : config.status === 'Good' ? 11 : 69);
        doc.text(`${foir.toFixed(1)}%`, 105, 80, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`${config.status} FOIR - ${config.message}`, 105, 88, { align: 'center' });
        
        // Financial Details
        let yPos = 110;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Financial Breakdown:', 20, yPos);
        yPos += 15;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(`Monthly Net Salary: Rs ${salary.toLocaleString('en-IN')}`, 30, yPos);
        yPos += 10;
        
        // EMI Details
        if (emis.length > 0) {
          doc.text('Monthly EMIs:', 30, yPos);
          yPos += 8;
          emis.forEach((emi, index) => {
            if (emi.amount > 0) {
              doc.text(`  EMI ${index + 1}: Rs ${emi.amount.toLocaleString('en-IN')}`, 40, yPos);
              yPos += 8;
            }
          });
          const totalEmis = emis.reduce((sum, emi) => sum + emi.amount, 0);
          doc.setFontSize(10);
          doc.text(`  Total EMIs: Rs ${totalEmis.toLocaleString('en-IN')}`, 40, yPos);
          yPos += 12;
        }
        
        // Credit Card Details
        if (creditCardOutstanding > 0) {
          doc.setFontSize(11);
          doc.text(`Credit Card Outstanding: Rs ${creditCardOutstanding.toLocaleString('en-IN')}`, 30, yPos);
          yPos += 8;
          doc.text(`5% of Credit Card Outstanding: Rs ${(creditCardOutstanding * 0.05).toLocaleString('en-IN')}`, 30, yPos);
          yPos += 12;
        }
        
        doc.text(`Total Monthly Obligations: Rs ${totalObligations.toLocaleString('en-IN')}`, 30, yPos);
        yPos += 15;
        
        // Guidelines
        doc.setFontSize(12);
        doc.text('FOIR Guidelines:', 20, yPos);
        yPos += 10;
        doc.setFontSize(10);
        doc.text('• Below 50%: Excellent financial health - High loan eligibility', 25, yPos);
        yPos += 8;
        doc.text('• 50-60%: Moderate obligations - Good loan eligibility', 25, yPos);
        yPos += 8;
        doc.text('• Above 60%: High obligations - May face loan approval challenges', 25, yPos);
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by Loan Chacha FOIR Calculator', 105, 280, { align: 'center' });
        
        // Save the PDF
        doc.save(`FOIR_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      };
      
      logoImg.onerror = () => {
        // Fallback without logo
        doc.setFontSize(22);
        doc.setTextColor(220, 53, 69);
        doc.text('FOIR Calculation Report', 20, 30);
        
        // Continue with rest of the PDF generation...
        doc.save(`FOIR_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      };
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    const shareText = `My FOIR is ${foir.toFixed(2)}% - ${config.status}`;
    
    try {
      if (navigator.share && navigator.canShare) {
        await navigator.share({
          title: 'My FOIR Result',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Result Copied!",
          description: "FOIR result copied to clipboard"
        });
      }
    } catch (error) {
      // Fallback to clipboard if share fails
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Result Copied!",
          description: "FOIR result copied to clipboard"
        });
      } catch (clipboardError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy result",
          variant: "destructive"
        });
      }
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