/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';

interface LogoProps {
  className?: string;
  useGradient?: boolean;
}

/**
 * Logo component that displays the Hegira text logo.
 * 
 * Example usage:
 * <Logo className="text-3xl text-hegra-navy" />
 * <Logo className="text-4xl" useGradient={true} />
 */
const Logo: React.FC<LogoProps> = ({ className = "font-bold text-2xl", useGradient }) => {
  const combinedClassName = `
    ${className}
    ${useGradient ? 'text-gradient' : ''}
  `;

  return (
    <span className={combinedClassName.trim()}>
      HEGIRA
    </span>
  );
};

export default Logo;