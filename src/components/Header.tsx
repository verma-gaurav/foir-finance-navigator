import React from 'react';

export const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-card">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl shadow-soft overflow-hidden">
              <img 
                src="/lovable-uploads/a6844765-7365-44d4-be7b-4593394a3944.png" 
                alt="Loan Chacha Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                LoanChacha
              </h1>
              <p className="text-sm text-muted-foreground">Financial Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};