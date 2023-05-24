import React from "react";

type FlexProps = {
  children?: React.ReactNode;
  direction?: any;
  items?: any;
  justify?: any;
  gap?: any;
  width?: any;
};

export default function Flex({
  children,
  direction = "column",
  items = "center",
  justify = "center",
  gap = "0px",
  width = "100%",
}: FlexProps) {
  return (
    <div
      style={{
        width: width,
        display: "flex",
        flexDirection: direction,
        alignItems: items,
        justifyContent: justify,
        gap: gap,
      }}
    >
      {children}
    </div>
  );
}
