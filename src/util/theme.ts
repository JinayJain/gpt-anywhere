import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
// const config: ThemeConfig = {
//   initialColorMode: "system",
//   useSystemColorMode: true,
// };

export const theme = extendTheme({
  config,
  fonts: {
    heading: `'Manrope', sans-serif`,
    body: `'Manrope', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "#17192300",
      },
    },
  },
  colors: {
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
});

export default theme;
