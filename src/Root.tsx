import { ColorModeScript, ChakraProvider } from "@chakra-ui/react";
import theme from "./util/theme";
import React from "react";

import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "./global.css";
import "./tailwind.css";

const Root = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </>
  );
};

export default Root;
