import {
  Text,
  Box,
  BoxProps,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  HStack,
  Stack,
  IconButton,
  Icon,
  Flex,
  Tooltip,
  IconButtonProps,
} from "@chakra-ui/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import renderer from "../util/markdown";
import { writeText } from "@tauri-apps/api/clipboard";
import { FiClipboard, FiCopy, FiRefreshCw } from "react-icons/fi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CopyButton from "./CopyButton";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { NotAllowedIcon, SettingsIcon } from "@chakra-ui/icons";
import { invoke } from "@tauri-apps/api";
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
    <Box bg="blackAlpha.800" rounded="md" overflow="hidden" {...props}>
      <Box px={4} py={4} flex={1}>
        <ReactMarkdown
          remarkPlugins={[remarkBreaks, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          children={responseMarkdown}
          components={renderer}
        />
      </Box>

      <Box position="sticky" bottom={0} right={0} pb={4} px={4}>
        <HStack ml="auto">
          {onRegenerate && (
            <ToolbarButton
              label="Regenerate Response"
              icon={<Icon as={FiRefreshCw} />}
              onClick={onRegenerate}
            />
          )}

          <CopyButton onCopy={onCopy} size="sm" />
        </HStack>
      </Box>
    </Box>
  );
}

export default ResponseBox;
