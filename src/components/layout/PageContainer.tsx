
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`flex-1 overflow-auto custom-scrollbar relative ${className}`}>
      <div className="p-6 pb-28 md:pb-32">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;
