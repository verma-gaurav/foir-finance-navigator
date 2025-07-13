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
  emis?: { id: string; amount: number; }[];
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

  const handleExport = () => {
    try {
      const pdf = new jsPDF();
      
      // Set up colors and fonts
      const primaryColor = [255, 69, 58]; // Red color from logo
      const textColor = [51, 51, 51];
      const lightGray = [245, 245, 245];
      
      // Add logo
      const logoImg = new Image();
      logoImg.onload = () => {
        // Add logo
        pdf.addImage('/lovable-uploads/62f61c47-8d87-49f7-99dd-4c482ff72083.png', 'PNG', 20, 15, 30, 30);
        
        // Title
        pdf.setFontSize(28);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('FOIR Calculator Report', 60, 35);
        
        // Subtitle
        pdf.setFontSize(14);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text('Fixed Obligations to Income Ratio Analysis', 20, 55);
        
        // Divider line
        pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setLineWidth(1);
        pdf.line(20, 65, 190, 65);
        
        // FOIR Result Section
        pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
        pdf.rect(20, 75, 170, 40, 'F');
        
        pdf.setFontSize(16);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text('Your FOIR Result', 25, 85);
        
        pdf.setFontSize(24);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text(`${foir.toFixed(1)}% - ${config.status}`, 25, 100);
        
        pdf.setFontSize(12);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(config.message, 25, 110);
        
        // Financial Details Section
        let yPos = 130;
        pdf.setFontSize(16);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('Financial Details', 20, yPos);
        
        yPos += 15;
        pdf.setFontSize(12);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        
        // Salary
        pdf.text(`Monthly Net Salary: ₹${salary.toLocaleString()}`, 25, yPos);
        yPos += 10;
        
        // EMIs breakdown
        if (emis.length > 0) {
          pdf.text('Monthly EMIs:', 25, yPos);
          yPos += 8;
          emis.forEach((emi, index) => {
            if (emi.amount > 0) {
              pdf.text(`  EMI ${index + 1}: ₹${emi.amount.toLocaleString()}`, 30, yPos);
              yPos += 8;
            }
          });
          const totalEmis = emis.reduce((sum, emi) => sum + emi.amount, 0);
          pdf.setFont(undefined, 'bold');
          pdf.text(`  Total EMIs: ₹${totalEmis.toLocaleString()}`, 30, yPos);
          pdf.setFont(undefined, 'normal');
          yPos += 15;
        }
        
        // Credit Card Outstanding
        if (creditCardOutstanding > 0) {
          pdf.text(`Credit Card Outstanding: ₹${creditCardOutstanding.toLocaleString()}`, 25, yPos);
          yPos += 8;
          pdf.text(`5% of Credit Card (considered): ₹${(creditCardOutstanding * 0.05).toLocaleString()}`, 25, yPos);
          yPos += 15;
        }
        
        // Total Obligations
        pdf.setFont(undefined, 'bold');
        pdf.text(`Total Monthly Obligations: ₹${totalObligations.toLocaleString()}`, 25, yPos);
        pdf.setFont(undefined, 'normal');
        yPos += 15;
        
        // Calculation
        pdf.setFontSize(14);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('FOIR Calculation', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(12);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text(`FOIR = (₹${totalObligations.toLocaleString()} ÷ ₹${salary.toLocaleString()}) × 100 = ${foir.toFixed(2)}%`, 25, yPos);
        
        // Guidelines
        yPos += 20;
        pdf.setFontSize(14);
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.text('FOIR Guidelines', 20, yPos);
        yPos += 10;
        
        pdf.setFontSize(10);
        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.text('• Below 50%: Excellent financial health - High loan approval chances', 25, yPos);
        yPos += 8;
        pdf.text('• 50-60%: Moderate obligations - Good loan approval chances', 25, yPos);
        yPos += 8;
        pdf.text('• Above 60%: High obligations - Consider reducing debt before applying', 25, yPos);
        
        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN')} | लोन चाचा FOIR Calculator`, 20, 280);
        
        // Save the PDF
        pdf.save(`FOIR-Report-${new Date().toISOString().split('T')[0]}.pdf`);
        
        toast({
          title: "PDF Downloaded Successfully! 📄",
          description: "Your FOIR report has been saved to your downloads"
        });
      };
      
      logoImg.src = '/lovable-uploads/62f61c47-8d87-49f7-99dd-4c482ff72083.png';
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    }
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