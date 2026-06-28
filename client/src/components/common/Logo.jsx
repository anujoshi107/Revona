import React from 'react';
import logoImg from '../../assets/mylogo.png';

export default function Logo() {
  return (
    <div className="flex items-center select-none">
      <img
        src={logoImg}
        alt="Revona Logo"
        className="h-8 w-auto object-contain"
      />
    </div>
  );
}