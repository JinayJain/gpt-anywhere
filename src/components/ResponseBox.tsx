import {
  Box,
  BoxProps,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
  Icon,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import renderer from "../util/markdown";
import { writeText } from "@tauri-apps/api/clipboard";
import { FiRefreshCw } from "react-icons/fi";
import CopyButton from "./CopyButton";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import ToolbarButton from "./ToolbarButton";

const COPY_MSG_TIMEOUT = 1000;

function Debug({ text }: { text: string }) {
  return (
    <Accordion allowToggle mt={4}>
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Debug
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} whiteSpace="pre-line">
          {text}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

function ResponseBox({
  responseMarkdown,
  onRegenerate,
  ...props
}: {
  onRegenerate?: () => void;
  responseMarkdown: string;
} & BoxProps) {
  const onCopy = () => {
    writeText(responseMarkdown);
  };

  return (
    <Stack bg="blackAlpha.800" rounded="md" p={4} {...props}>
      <Box>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          children={responseMarkdown}
          components={renderer}
        />
      </Box>

      <Box alignSelf="flex-end">
        {onRegenerate && (
          <ToolbarButton
            label="Regenerate Response"
            icon={<Icon as={FiRefreshCw} />}
            onClick={onRegenerate}
          />
        )}

        <CopyButton onCopy={onCopy} size="sm" />
      </Box>
    </Stack>
  );
}

export default ResponseBox;
