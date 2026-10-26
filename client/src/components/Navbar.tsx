import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from './ui/button.js';
import { Badge } from './ui/badge.js';

interface NavbarProps {
  onOpenNew: () => void;
  productCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNew, productCount }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Package className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-foreground text-sm tracking-tight">
                Products
              </h1>
              {productCount !== undefined && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal">
                  {productCount}
                </Badge>
              )}
            </div>
          </div>

          {/* New Button */}
          <Button
            size="sm"
            onClick={onOpenNew}
            className="gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Product</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
