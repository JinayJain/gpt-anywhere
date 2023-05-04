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
import store from "../util/store";
import { STORE_KEY } from "../util/consts";

const inputStyle = {
  border: "1px solid #ccc",
  borderRadius: "5px",
  padding: "8px",
  // fontSize: "16px",
  // outline: "none",
  backgroundColor: "black",
  width: "100%",
  input: {
    padding: "8px",
  },
};

const mentionStyle = {
  backgroundColor: "#d4eaff",
  color: "black",
};
const mentionStyle2 = {
  backgroundColor: "#7463e6",
  color: "black",
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
  const [listUsers, setListUsers] = useState<User[]>([]);
  const [listFiles, setListFiles] = useState<File[]>([]);

  const inputRef = useRef<any>(null);

  const temperatureLabel = TEMPERATURE_GRADES.find(
    (grade) => grade.value <= temperature
  )?.label;

  interface UserOrg {
    division?: {
      organizationId?: string;
    };
  }

  // fetch user
  async function fetchUsers() {
    const tokenAPINgepet = await store.get(STORE_KEY.API_KEY);
    const user: UserOrg | null = await store.get(STORE_KEY.USER);
    if (!user || !user.division) {
      console.error("Error: User or user division is null");
      setListUsers([]);
      return;
    }

    // Construct the URL
    const url = `https://ngepet.c4budiman.com/v1/organizations/${user?.division?.organizationId}/users`;

    try {
      // Perform the GET request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenAPINgepet,
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Parse and return the JSON response
      const data = await response.json();
      setListUsers(
        data?.data?.docs?.map((user: { name: String; id: String }) => {
          return { id: user?.id, display: user?.name };
        }) ?? []
      );
      // return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      setListUsers([]);
      throw error;
    }
  }
  // fetch files
  async function fetchFiles() {
    const tokenAPINgepet = await store.get(STORE_KEY.API_KEY);
    const user: UserOrg | null = await store.get(STORE_KEY.USER);
    if (!user || !user.division) {
      console.error("Error: User or user division is null");
      setListUsers([]);
      return;
    }
    console.log(user)

    // Construct the URL
    const url = `https://ngepet.c4budiman.com/v1/organizations/${user.division.organizationId}/connections`;

    try {
      // Perform the GET request
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokenAPINgepet,
        },
      });

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      // Parse and return the JSON response
      const data = await response.json();
      const connection_id = data?.data?.docs?.[0]?.connectionId;
      // console.log("connection_id", connection_id);
      if (connection_id) {
        const url2 = `https://ngepet.c4budiman.com/v1/organizations/${user.division.organizationId}/connections/${connection_id}/documents`;
        // Perform the GET request
        const response2 = await fetch(url2, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokenAPINgepet,
          },
        });
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        // Parse and return the JSON response
        const data2 = await response2.json();
        // console.log("data2", data2);
        setListFiles(
          data2?.data?.docs?.map((user: { name: String; id: String }) => {
            return { id: user?.id, display: user?.name };
          }) ?? []
        );
        // return data;
      } else {
        setListFiles([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setListFiles([]);
      throw error;
    }
  }

  const files = [
    { id: "123232", display: "File Gdrive" },
    { id: "4343423423", display: "File 2" },
    { id: "5454545", display: "File 3" },
  ];

  const [valueInput, setValueInput] = useState<string>();
  interface User {
    id: string | number;
    display: string;
    [key: string]: any;
  }
  interface File {
    id: string | number;
    display: string;
    [key: string]: any;
  }

  const searchUsers = (
    query: string,
    callback: (users: User[]) => void
  ): void => {
    const filteredUsers = listUsers.filter((user) =>
      user.display.toLowerCase().includes(query.toLowerCase())
    );
    callback(filteredUsers);
  };

  const searchFiles = (
    query: string,
    callback: (files: File[]) => void
  ): void => {
    const filteredFiles = listFiles.filter((file) =>
      file.display.toLowerCase().includes(query.toLowerCase())
    );
    callback(filteredFiles);
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

  // console.log("Value changedaa:", valueInput);

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

  const inputRef2 = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef2.current) {
      inputRef2.current.style.setProperty("height", "auto", "important");
    }
    fetchUsers();
    fetchFiles();
  }, []);

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
              placeholder="Type # or @ to show syntax..."
              // onFocus={fetchUsers}
              // onSubmit={(e) => {
              //   e.preventDefault();
              //   onGenerate(prompt.trim(), temperature);
              //   setPrompt("");
              // }}
            >
              <Mention
                trigger="@"
                data={searchUsers}
                markup={"@(__display__[__id__])"}
                style={mentionStyle}
                displayTransform={(id, display) => `@${display}`}
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
              <Mention
                trigger="#"
                data={searchFiles}
                markup={"#(__display__[__id__])"}
                style={mentionStyle2}
                displayTransform={(id, display) => `#${display}`}
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
            {/* <Icon as={CiTempHigh} />
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
            </Text> */}

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
