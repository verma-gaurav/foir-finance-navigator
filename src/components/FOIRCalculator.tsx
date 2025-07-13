import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FloatingInput } from './FloatingInput';
import { EMICard } from './EMICard';
import { FOIRResult } from './FOIRResult';
import { Plus, IndianRupee, Info, RotateCcw, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EMI {
  id: string;
  amount: number;
}

export const FOIRCalculator = () => {
  const [salary, setSalary] = useState<number>(0);
  const [emis, setEmis] = useState<EMI[]>([{ id: '1', amount: 0 }]);
  const [creditCardOutstanding, setCreditCardOutstanding] = useState<number>(0);
  const [foirResult, setFoirResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  // Calculate 5% of credit card outstanding
  const creditCardFactor = creditCardOutstanding * 0.05;
  
  // Calculate total EMIs
  const totalEmis = emis.reduce((sum, emi) => sum + (emi.amount || 0), 0);
  
  // Check if all required fields are filled
  const isFormValid = salary > 0 && totalEmis >= 0 && creditCardOutstanding >= 0;

  const addEMI = () => {
    const newEmi: EMI = {
      id: Date.now().toString(),
      amount: 0
    };
    setEmis([...emis, newEmi]);
  };

  const removeEMI = (id: string) => {
    if (emis.length > 1) {
      setEmis(emis.filter(emi => emi.id !== id));
    }
  };

  const updateEMI = (id: string, amount: number) => {
    setEmis(emis.map(emi => emi.id === id ? { ...emi, amount } : emi));
  };

  const calculateFOIR = async () => {
    if (!isFormValid) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields to calculate FOIR",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate calculation time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const totalObligations = totalEmis + creditCardFactor;
    const foir = (totalObligations / salary) * 100;
    
    setFoirResult(foir);
    setShowResult(true);
    setIsCalculating(false);

    // Success toast
    toast({
      title: "FOIR Calculated Successfully! 🎯",
      description: `Your FOIR is ${foir.toFixed(2)}%`
    });
  };

  const resetCalculator = () => {
    setSalary(0);
    setEmis([{ id: '1', amount: 0 }]);
    setCreditCardOutstanding(0);
    setFoirResult(null);
    setShowResult(false);
    
    toast({
      title: "Calculator Reset",
      description: "All fields have been cleared"
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl shadow-glow overflow-hidden">
                <img 
                  src="/lovable-uploads/a6844765-7365-44d4-be7b-4593394a3944.png" 
                  alt="Loan Chacha Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                FOIR Calculator
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate your Fixed Obligations to Income Ratio and understand your loan eligibility
              with our intelligent financial assessment tool.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Salary Input */}
              <Card className="card-elegant animate-slide-in">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-input-calm/20 rounded-xl">
                      <IndianRupee className="h-5 w-5 text-input-calm-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">Monthly Net Salary</h3>
                  </div>
                  
                  <FloatingInput
                    label="Enter your monthly net salary"
                    type="text"
                    value={salary || ''}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    placeholder="0"
                    className="input-calm"
                    icon={<IndianRupee className="h-4 w-4" />}
                    formatNumber={true}
                  />
                </div>
              </Card>

              {/* EMI Section */}
              <Card className="card-elegant animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning/20 rounded-xl">
                        <Calculator className="h-5 w-5 text-warning-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold">Monthly EMIs</h3>
                    </div>
                    <Button
                      onClick={addEMI}
                      variant="outline"
                      size="sm"
                      className="btn-ghost"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add EMI
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {emis.map((emi, index) => (
                      <EMICard
                        key={emi.id}
                        emi={emi}
                        index={index}
                        onUpdate={updateEMI}
                        onRemove={removeEMI}
                        canRemove={emis.length > 1}
                      />
                    ))}
                  </div>

                  {totalEmis > 0 && (
                    <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground">Total Monthly EMIs:</span>
                        <span className="text-xl font-bold text-foreground">
                          ₹{totalEmis.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Credit Card Outstanding */}
              <Card className="card-elegant animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/20 rounded-xl">
                      <IndianRupee className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">Credit Card Outstanding</h3>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Only 5% of your credit card outstanding amount is considered in FOIR calculation</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <FloatingInput
                    label="Enter current outstanding amount"
                    type="text"
                    value={creditCardOutstanding || ''}
                    onChange={(e) => setCreditCardOutstanding(Number(e.target.value))}
                    placeholder="0"
                    className="input-calm"
                    icon={<IndianRupee className="h-4 w-4" />}
                    formatNumber={true}
                  />

                  {creditCardOutstanding > 0 && (
                    <div className="p-4 bg-success/20 rounded-xl border border-success/30 animate-fade-in-up">
                      <div className="flex items-center gap-2 text-success-foreground">
                        <Info className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          🧮 5% of ₹{creditCardOutstanding.toLocaleString()} = ₹{creditCardFactor.toLocaleString()} will be added to your obligations
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              {/* Calculate Button */}
              <Card className="card-elegant animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Ready to Calculate?</h3>
                    <p className="text-muted-foreground">
                      Get your FOIR score and loan eligibility status instantly
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={calculateFOIR}
                      disabled={!isFormValid || isCalculating}
                      className="btn-primary flex-1"
                      size="lg"
                    >
                      {isCalculating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2"></div>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="h-5 w-5 mr-2" />
                          Calculate FOIR
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={resetCalculator}
                      variant="outline"
                      className="btn-ghost"
                      size="lg"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Results */}
              {showResult && foirResult !== null && (
                <FOIRResult 
                  foir={foirResult} 
                  salary={salary}
                  totalObligations={totalEmis + creditCardFactor}
                  emis={emis}
                  creditCardOutstanding={creditCardOutstanding}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};