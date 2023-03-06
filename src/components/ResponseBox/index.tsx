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
} from "@chakra-ui/react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import renderer from "../../util/markdown";
import { writeText } from "@tauri-apps/api/clipboard";
import { FiClipboard, FiCopy } from "react-icons/fi";
import { useState } from "react";

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
  ...props
}: {
  responseMarkdown: string;
} & BoxProps) {
  const onCopy = () => {
    writeText(responseMarkdown);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), COPY_MSG_TIMEOUT);
  };

  const [isCopied, setIsCopied] = useState(false);

  console.log(responseMarkdown);

  return responseMarkdown ? (
    <Box {...props} bg="blackAlpha.800" borderRadius="md">
      <Debug text={responseMarkdown} />
      <Box p={4}>
        <ReactMarkdown children={responseMarkdown} components={renderer} />
        <Stack position="sticky" bottom={4} right={4}>
          <Button
            colorScheme="green"
            onClick={onCopy}
            leftIcon={<Icon as={FiCopy} />}
            size="sm"
            variant={isCopied ? "solid" : "outline"}
            ml="auto"
          >
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </Stack>
      </Box>
    </Box>
  ) : null;
}

export default ResponseBox;
