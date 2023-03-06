import {
  Box,
  BoxProps,
  Collapse,
  Heading,
  Text,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import renderer from "../../util/markdown";
import testMarkdown from "../../util/testMarkdown";
import theme from "../../util/theme";

function ResponseBox({
  responseMarkdown,
  ...props
}: {
  responseMarkdown: string;
} & BoxProps) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box {...props} bg="whiteAlpha.50" borderRadius="md">
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
            {responseMarkdown}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <Box p={4}>
        <ReactMarkdown children={responseMarkdown} components={renderer} />
      </Box>
    </Box>
  );
}

export default ResponseBox;
