"use client";
import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = ({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) => {
  const base = "rounded-lg font-semibold transition shadow focus:outline-none";
  const variants = {
    default: "bg-gold text-[#0a0a23] hover:bg-yellow-400",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "p-2 text-base",
  };
  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
