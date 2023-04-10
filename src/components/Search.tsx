import {
  Box,
  BoxProps,
  Button,
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
  NotAllowedIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { invoke } from "@tauri-apps/api";
import { Mention, MentionsInput, SuggestionDataItem } from "react-mentions";
import ToolbarButton from "./ToolbarButton";

const inputStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "8px",
  // fontSize: "14px",
  // outline: "none",
  backgroundColor: "black",
  width: "100%",
};

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
  onClear = () => {},
  isLoading = false,
  ...props
}: {
  onGenerate?: (prompt: string, temperature: number) => void;
  onClear?: () => void;
  isLoading?: boolean;
} & BoxProps) {
  const [prompt, setPrompt] = useState("");
  const [temperature, setTemperature] = useState(1.0);
  const [showOptions, setShowOptions] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const inputRef = useRef<any>(null);

  const temperatureLabel = TEMPERATURE_GRADES.find(
    (grade) => grade.value <= temperature
  )?.label;

  const users = [
    { id: 1, display: "File Gdrive", value: "file gdrive bla bla" },
    { id: 2, display: "File 2", value: "file gdrive bla bla 2" },
    { id: 3, display: "File 3", value: "file gdrive bla bla 3" },
  ];

  const [valueInput, setValueInput] = useState<string>();
  interface User {
    id: number;
    display: string;
  }

  const searchUsers = (
    query: string,
    callback: (users: User[]) => void
  ): void => {
    const filteredUsers = users.filter((user) =>
      user.display.toLowerCase().includes(query.toLowerCase())
    );
    callback(filteredUsers);
  };

  const handleChange = (
    event: { target: { value: string } },
    newValue: string,
    newPlainTextValue: string,
    mentions: any[]
  ): void => {
    setValueInput(event?.target?.value);
    setPrompt(event?.target?.value);
  };

  console.log("Value changedaa:", valueInput);

  useEffect(() => {
    const unlisten = listen("show", (e) => {
      inputRef.current?.focus();
    });

    return () => {
      unlisten.then((unlisten) => unlisten());
    };
  }, []);

  const onSettings = () => {
    invoke("open_settings");
  };

  return (
    <Box display="flex" flexDirection="column" {...props}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate(prompt.trim(), temperature);
          setPrompt("");
        }}
      >
        <HStack>
          <InputGroup size="lg">
            {/* <Input
              ref={inputRef}
              placeholder="Unleash your creativity"
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              autoFocus
              bg="blackAlpha.800"
              _placeholder={{ color: "whiteAlpha.500" }}
            /> */}
            <MentionsInput
              ref={inputRef}
              value={prompt}
              onChange={handleChange}
              style={inputStyle}
              autoFocus
              placeholder="Type '//' to show syntax..."
            >
              <Mention
                trigger="//"
                data={searchUsers}
                markup={"//__display__"}
                renderSuggestion={(
                  suggestion: SuggestionDataItem,
                  search: string,
                  highlightedDisplay: React.ReactNode,
                  index: number,
                  focused: boolean
                ) => (
                  <div
                    className={`user-suggestion${focused ? " focused" : ""}`}
                    style={
                      focused
                        ? { color: "white", background: "teal", padding: "5px" }
                        : { color: "black", padding: "5px" }
                    }
                  >
                    {highlightedDisplay}
                  </div>
                )}
              />
            </MentionsInput>
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

          <Tooltip label="Options" aria-label="Options" hasArrow>
            <IconButton
              size="lg"
              colorScheme="green"
              aria-label="Options"
              icon={showOptions ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={() => setShowOptions(!showOptions)}
            />
          </Tooltip>
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
              flex={1}
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

            <Button
              leftIcon={<Icon as={SettingsIcon} />}
              colorScheme="green"
              variant="outline"
              onClick={onSettings}
              size="sm"
            >
              Settings
            </Button>

            {/* <Button
              leftIcon={<Icon as={NotAllowedIcon} />}
              colorScheme="red"
              variant="outline"
              onClick={onClear}
              size="sm"
            >
              Clear Chat
            </Button> */}
          </HStack>
        </Box>
      </Collapse>
    </Box>
  );
}

export default Search;
