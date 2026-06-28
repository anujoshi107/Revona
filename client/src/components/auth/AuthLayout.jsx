import React from "react";
import Logo from "../common/Logo";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen relative overflow-hidden bg-slate-950">
      {/* Decorative gradients for the whole page */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[80px]" />
      </div>

      {/* ── Left: Branding Panel ── */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 overflow-hidden bg-transparent z-10">
        {/* Logo */}
        <div className="relative z-10">
          <Logo />
        </div>

        {/* Marketing copy */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight text-white font-sans">
            Take control of your money with{" "}
            <span className="text-blue-400">Revona.</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400 font-sans font-medium">
            Track income, expenses, reports, and insights — all in one modern
            dashboard built for clarity and confidence.
          </p>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-slate-600 font-sans font-medium">
          © {new Date().getFullYear()} Revona. All rights reserved.
        </p>
      </div>

      {/* ── Right: Auth Card Area ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-transparent z-10">
        {/* Mobile-only logo (hidden on desktop) */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Logo />
        </div>

        {children}
      </div>
    </div>
  );
}
