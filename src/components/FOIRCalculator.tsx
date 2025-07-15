import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-6 py-12">
          {/* Page Title Section */}
          <header className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6 leading-tight">
              FOIR Calculator
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Calculate your Fixed Obligations to Income Ratio and understand your loan eligibility
              with our intelligent financial assessment tool.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
            {/* Input Section */}
            <section className="space-y-8" aria-labelledby="input-section">
              <h3 id="input-section" className="sr-only">Financial Information Input</h3>
              
              {/* Salary Input */}
              <Card className="card-elegant animate-slide-in">
                <div className="space-y-6">
                  <header className="flex items-center gap-4">
                    <div className="p-3 bg-input-calm/20 rounded-xl flex-shrink-0">
                      <IndianRupee className="h-5 w-5 text-input-calm-foreground" />
                    </div>
                    <h4 className="text-xl font-semibold leading-tight">Monthly Net Salary</h4>
                  </header>
                  
                  <div className="space-y-3">
                    <Label htmlFor="salary" className="text-base font-medium">Enter your monthly net salary</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="salary"
                        type="text"
                        value={salary ? salary.toLocaleString('en-IN') : ''}
                        onChange={(e) => setSalary(Number(e.target.value.replace(/,/g, '')))}
                        placeholder="0"
                        className="pl-10 h-12 text-base"
                        aria-describedby="salary-help"
                      />
                    </div>
                    <p id="salary-help" className="text-sm text-muted-foreground">
                      Enter your monthly take-home salary after deductions
                    </p>
                  </div>
                </div>
              </Card>

              {/* EMI Section */}
              <Card className="card-elegant animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="space-y-6">
                  <header className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-warning/20 rounded-xl flex-shrink-0">
                        <Calculator className="h-5 w-5 text-warning-foreground" />
                      </div>
                      <h4 className="text-xl font-semibold leading-tight">Monthly EMIs</h4>
                    </div>
                    <Button
                      onClick={addEMI}
                      variant="outline"
                      size="sm"
                      className="btn-ghost flex-shrink-0"
                      aria-label="Add new EMI entry"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add EMI
                    </Button>
                  </header>

                  <div className="space-y-4" role="list" aria-label="EMI entries">
                    {emis.map((emi, index) => (
                      <div key={emi.id} role="listitem">
                        <EMICard
                          emi={emi}
                          index={index}
                          onUpdate={updateEMI}
                          onRemove={removeEMI}
                          canRemove={emis.length > 1}
                        />
                      </div>
                    ))}
                  </div>

                  {totalEmis > 0 && (
                    <div className="p-5 bg-muted/50 rounded-xl border border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground text-base">Total Monthly EMIs:</span>
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
                <div className="space-y-6">
                  <header className="flex items-center gap-4">
                    <div className="p-3 bg-destructive/20 rounded-xl flex-shrink-0">
                      <IndianRupee className="h-5 w-5 text-destructive-foreground" />
                    </div>
                    <h4 className="text-xl font-semibold leading-tight">Credit Card Outstanding</h4>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-muted/50 transition-colors" aria-label="Information about credit card calculation">
                          <Info className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Only 5% of your credit card outstanding amount is considered in FOIR calculation</p>
                      </TooltipContent>
                    </Tooltip>
                  </header>
                  
                  <div className="space-y-3">
                    <Label htmlFor="creditCard" className="text-base font-medium">Enter current outstanding amount</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="creditCard"
                        type="text"
                        value={creditCardOutstanding ? creditCardOutstanding.toLocaleString('en-IN') : ''}
                        onChange={(e) => setCreditCardOutstanding(Number(e.target.value.replace(/,/g, '')))}
                        placeholder="0"
                        className="pl-10 h-12 text-base"
                        aria-describedby="creditCard-help"
                      />
                    </div>
                    <p id="creditCard-help" className="text-sm text-muted-foreground">
                      Total outstanding balance on all credit cards
                    </p>
                  </div>

                  {creditCardOutstanding > 0 && (
                    <div className="p-5 bg-success/20 rounded-xl border border-success/30 animate-fade-in-up">
                      <div className="flex items-start gap-3 text-success-foreground">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="text-sm font-medium block">
                            Calculation: 5% of ₹{creditCardOutstanding.toLocaleString()} = ₹{creditCardFactor.toLocaleString()}
                          </span>
                          <span className="text-xs opacity-90 block">
                            This amount will be added to your monthly obligations
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* Result Section */}
            <aside className="space-y-8" aria-labelledby="results-section">
              <h3 id="results-section" className="sr-only">Calculation Results</h3>
              
              {/* Calculate Button */}
              <Card className="card-elegant animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <div className="space-y-8">
                  <header className="text-center space-y-3">
                    <h4 className="text-2xl font-bold leading-tight">Ready to Calculate?</h4>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Get your FOIR score and loan eligibility status instantly
                    </p>
                  </header>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={calculateFOIR}
                      disabled={!isFormValid || isCalculating}
                      className="btn-primary flex-1 h-12"
                      size="lg"
                      aria-describedby="calculate-button-help"
                    >
                      {isCalculating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" aria-hidden="true"></div>
                          <span>Calculating...</span>
                        </>
                      ) : (
                        <>
                          <Calculator className="h-5 w-5 mr-2" aria-hidden="true" />
                          <span>Calculate FOIR</span>
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={resetCalculator}
                      variant="outline"
                      className="btn-ghost h-12"
                      size="lg"
                      aria-label="Reset all input fields"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Reset</span>
                    </Button>
                  </div>
                  
                  {!isFormValid && (
                    <p id="calculate-button-help" className="text-sm text-muted-foreground text-center">
                      Please fill in all required fields to calculate FOIR
                    </p>
                  )}
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
            </aside>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
};