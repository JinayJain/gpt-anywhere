import React from "react";

import { Box, Heading, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

function Titlebar() {
  return (
    <Box
      data-tauri-drag-region
      w="full"
      p={2}
      display="flex"
      alignItems="center"
      justifyContent="end"
      bg="whiteAlpha.100"
    >
      <IconButton
        aria-label="Close"
        icon={<CloseIcon />}
        variant="ghost"
        size="xs"
      />
    </Box>
  );
}

export default Titlebar;
