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
  onClear,
  onRegenerate,
  ...props
}: {
  onClear: () => void;
  onRegenerate: () => void;
  responseMarkdown: string;
} & BoxProps) {
  const onCopy = () => {
    writeText(responseMarkdown);
  };

  return (
    <AnimatePresence>
      {responseMarkdown && (
        <Box
          as={motion.div}
          bg="blackAlpha.800"
          borderRadius="md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          {...props}
        >
          {/* <Debug text={responseMarkdown} /> */}
          <Box>
            <Box px={4} pt={4}>
              <ReactMarkdown
                remarkPlugins={[remarkBreaks, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                children={responseMarkdown}
                components={renderer}
              />
            </Box>
            <HStack
              position="sticky"
              bottom={0}
              right={0}
              pt={8}
              pb={4}
              px={4}
              bg="linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1.0))"
            >
              <Button
                onClick={onClear}
                size="sm"
                ml="auto"
                boxShadow="md"
                colorScheme="red"
                variant="outline"
              >
                Clear
              </Button>
              <Tooltip label="Regenerate Response">
                <IconButton
                  aria-label="Regenerate"
                  icon={<Icon as={FiRefreshCw} />}
                  size="sm"
                  boxShadow="md"
                  onClick={onRegenerate}
                />
              </Tooltip>
              <CopyButton onCopy={onCopy} size="sm" />
            </HStack>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
}

export default ResponseBox;
