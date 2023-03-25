import {
  Box,
  BoxProps,
  Collapse,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { listen } from "@tauri-apps/api/event";
import { CiChat1, CiChat2, CiTempHigh } from "react-icons/ci";
import { BsChatRightFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";

const TEMPERATURE_GRADES = [
  {
    value: 0.0,
    label: "Rigid",
  },
  {
    value: 0.1,
    label: "Stable",
  },
  {
    value: 0.8,
    label: "Balanced",
  },
  {
    value: 1.2,
    label: "Creative",
  },
  {
    value: 1.5,
    label: "Crazy",
  },
  {
    value: 2.0,
    label: "Insane",
  },
].reverse();

function Search({
  onGenerate = () => {},
  isLoading = false,
  ...props
}: {
  onGenerate?: (prompt: string, temperature: number) => void;
  isLoading?: boolean;
} & BoxProps) {
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(1.0);
  const [showOptions, setShowOptions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const temperatureLabel = TEMPERATURE_GRADES.find(
    (grade) => grade.value <= temperature
  )?.label;

  useEffect(() => {
    const unlisten = listen("show", (e) => {
      inputRef.current?.focus();
    });

    return () => {
      unlisten.then((unlisten) => unlisten());
    };
  }, []);

  return (
    <Box display="flex" flexDirection="column" {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("GENERATING Prompt");
          onGenerate(prompt, temperature);
        }}
      >
        <HStack>
          <InputGroup size="lg">
            <Input
              ref={inputRef}
              placeholder="Unleash your creativity"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              autoFocus
              bg="blackAlpha.800"
              _placeholder={{ color: "whiteAlpha.500" }}
            />
            <InputRightElement
              children={
                <DragHandleIcon
                  cursor="grab"
                  color="whiteAlpha.500"
                  data-tauri-drag-region
                />
              }
            />
          </InputGroup>
          <Tooltip label="Generate" aria-label="Generate" hasArrow>
            <IconButton
              size="lg"
              colorScheme="green"
              aria-label="Generate"
              icon={<BsChatRightFill />}
              type="submit"
              isLoading={isLoading}
            />
          </Tooltip>

          <IconButton
            size="lg"
            colorScheme="green"
            aria-label="Options"
            icon={showOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setShowOptions(!showOptions)}
          />
        </HStack>
      </form>

      <Collapse in={showOptions} animateOpacity>
        <Box p={2} rounded="md" bg="blackAlpha.800" mt={2}>
          <HStack>
            <Icon as={CiTempHigh} />
            <Slider
              aria-label="temperature"
              min={0}
              max={2}
              step={0.01}
              value={temperature}
              onChange={(value) => setTemperature(value)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              colorScheme="red"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                label={`Temperature: ${temperature}`}
                isOpen={showTooltip}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>

            <Text w={24} align="center">
              {temperatureLabel || temperature}
            </Text>
          </HStack>
        </Box>
      </Collapse>
    </Box>
  );
}

export default Search;
