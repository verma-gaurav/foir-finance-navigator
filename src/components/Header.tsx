import React from 'react';

export const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-card">
      <div className="container max-w-7xl mx-auto px-6 py-6">
        <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <div className="flex items-center gap-4">
            <figure className="w-12 h-12 rounded-xl shadow-soft overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/a6844765-7365-44d4-be7b-4593394a3944.png" 
                alt="LoanChacha company logo" 
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent leading-tight">
                LoanChacha
              </h1>
              <p className="text-sm text-muted-foreground leading-none">Financial Solutions</p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};