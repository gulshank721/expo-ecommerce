import React from 'react';
import { LoaderIcon } from 'lucide-react';

export const PageLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="size-12 animate-spin" />
    </div>
  );
};
