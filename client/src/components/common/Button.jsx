import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, success, danger, ghost
  size = 'md', // sm, md, lg
  disabled = false,
  className = '',
  iconLeft = null,
  iconRight = null,
  ...props
}) {
  // Base classes for premium button
  const baseClasses = 'inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  // Variant styles
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-500/35 border border-blue-500/30',
    secondary: 'bg-slate-900/40 hover:bg-slate-800/60 text-slate-200 border border-slate-700/50 hover:border-slate-500/50 backdrop-blur-sm',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/35 border border-emerald-500/30',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 hover:shadow-rose-500/35 border border-rose-500/30',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/40',
  };

  // Size styles
  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {iconLeft && <span className="flex-shrink-0">{iconLeft}</span>}
      <span>{children}</span>
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}
