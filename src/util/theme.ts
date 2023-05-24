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
    primary: {
      1: "#0084FF",
      2: "#3FDD78",
    },
    accent: {
      1: "#D84C10",
      2: "#3E90F0",
      3: "#8E55EA",
      4: "#8C6584",
      5: "#DDA73F",
    },
    n: {
      1: "#FEFEFE",
      2: "#F3F5F7",
      3: "#E8ECEF",
      4: "#6C7275",
      5: "#343839",
      6: "#232627",
      7: "#141718",
    },
  },
});

export default theme;
