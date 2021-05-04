import { extendTheme } from "@chakra-ui/react";

const colors = {
  primary: {
    100: "#222629",
    200: "#27EF96",
    300: "#6B6E70",
    400: "#474B4F",
    500: "#86C232",
    600: "#0A864F",
    700: "#086F42",
    800: "#61892F",
    900: "#064C2E"
  }
};

const customTheme = extendTheme({ colors });

export default customTheme;
