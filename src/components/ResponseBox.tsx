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

const ToolbarButton = ({
  label,
  icon,
  onClick,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
} & Omit<IconButtonProps, "aria-label">) => {
  return (
    <Tooltip label={label}>
      <IconButton
        ml="auto"
        aria-label={label}
        icon={icon}
        size="sm"
        boxShadow="md"
        onClick={onClick}
        {...props}
      />
    </Tooltip>
  );
};

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

  const onSettings = () => {
    invoke("open_settings");
  };

  return responseMarkdown ? (
    <Box {...props}>
      <Box px={4} py={4} overflowY="auto" flex={1}>
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
        bg="linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1.0))"
        pb={4}
        px={4}
      >
        <ToolbarButton
          label="Open Settings"
          icon={<Icon as={SettingsIcon} />}
          onClick={onSettings}
        />

        <ToolbarButton
          label="Regenerate Response"
          icon={<Icon as={FiRefreshCw} />}
          onClick={onRegenerate}
        />

        <ToolbarButton
          label="Clear Response"
          icon={<Icon as={NotAllowedIcon} />}
          colorScheme="red"
          variant="outline"
          onClick={onClear}
        />

        <CopyButton onCopy={onCopy} size="sm" />
      </HStack>
    </Box>
  ) : null;
}

export default ResponseBox;
