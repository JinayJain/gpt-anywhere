import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Components } from "react-markdown";
import { Box, Code, IconButton } from "@chakra-ui/react";
import { FiCopy } from "react-icons/fi";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as style } from "react-syntax-highlighter/dist/esm/styles/prism";
import { writeText } from "@tauri-apps/api/clipboard";
import CopyButton from "../components/CopyButton";

const theme: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");

    return !inline ? (
      <Box position="relative">
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, "")}
          // @ts-ignore
          style={style}
          language={match ? match[1].toLowerCase() : "text"}
          PreTag="div"
          {...props}
        />

        <Box position="absolute" top={4} right={4} bottom={4}>
          <CopyButton
            iconOnly
            onCopy={() => writeText(String(children))}
            position="sticky"
            top={4}
          />
        </Box>
      </Box>
    ) : (
      <Code className={className} p={1} mx="2px" borderRadius="md" {...props}>
        {children}
      </Code>
    );
  },
};

const renderer = ChakraUIRenderer(theme);

export default renderer;
