import React from "react";

type LogoProps = {
  width?: string;
};

export default function Logo({ width }: LogoProps) {
  return (
    <div style={{ width: width ?? "140px" }}>
      <img src='/images/logo/platter-logo-may.svg' style={{ width: "100%" }} />
    </div>
  );
}
