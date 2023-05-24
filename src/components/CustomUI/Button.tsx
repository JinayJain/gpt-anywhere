import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  size?: "0" | "sm" | "md" | "lg";
  variant?: "contained" | "outlined" | "text";
  rounded?: "sm" | "md" | "lg";
  onClick?: any;
  fullwidth?: boolean;
  theme?: "dark" | "light" | "primary" | "secondary";
};

export default function Button({
  children,
  type,
  size,
  variant,
  rounded,
  onClick,
  fullwidth,
  theme,
}: ButtonProps) {
  const buttonProps = {
    type,
    onClick,
    style: { width: fullwidth ? "100%" : "" },
  };

  const classSize =
    size === "0"
      ? "btn-0"
      : size === "sm"
      ? "btn-sm"
      : size === "md"
      ? "btn-md"
      : "btn-lg";
  const classRounded =
    rounded === "sm"
      ? "rounded"
      : rounded === "md"
      ? "rounded-lg"
      : rounded === "lg"
      ? "rounded-xl"
      : "rounded-lg";
  const classVariant =
    variant === "contained"
      ? "btn-contained"
      : variant === "outlined"
      ? "btn-outlined"
      : "btn-text";

  return (
    <button
      className={`${classRounded} ${classVariant} ${classSize}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
