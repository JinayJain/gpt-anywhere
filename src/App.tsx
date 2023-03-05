import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { register } from "@tauri-apps/api/globalShortcut";
import Search from "./components/Search";
import { Box, Heading } from "@chakra-ui/react";
import Titlebar from "./components/Titlebar";

function App() {
  return (
    <Box>
      <Box p={4}>
        <Search />
      </Box>
    </Box>
  );
}

export default App;
