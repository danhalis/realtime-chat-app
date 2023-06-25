import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import React, { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  `inline-flex items-center justify-center
  rounded-md transition-color
  text-sm font-medium
  focus:outline-none
  focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
  active:scale-95
  disabled:opacity-50 disabled:pointer-events-none`,
  {
    variants: {
      variant: {
        default: `bg-slate-900 text-white
                  hover:bg-slate-800`,
        ghost: `bg-transparent
                hover:text-slate-900 hover:bg-slate-200`,
      },
      size: {
        default: `h-10 px-4 py-2`,
        sm: `h-9 px-2`,
        lg: `h-11 px-8`,
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface Props
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

function Button({
  className,
  children,
  variant,
  isLoading,
  size,
  ...rest
}: Props) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
      {children}
    </button>
  );
}

export default Button;
