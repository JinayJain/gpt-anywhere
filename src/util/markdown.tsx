import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { Components } from "react-markdown";
import { Code } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as style } from "react-syntax-highlighter/dist/esm/styles/prism";

const theme: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");

    return !inline ? (
      <SyntaxHighlighter
        children={String(children).replace(/\n$/, "")}
        // @ts-ignore
        style={style}
        language={match ? match[1] : "text"}
        PreTag="div"
        {...props}
      />
    ) : (
      <Code className={className} p={1} mx="2px" borderRadius="md" {...props}>
        {children}
      </Code>
    );
  },
};

const renderer = ChakraUIRenderer(theme);

export default renderer;
