import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { API_KEY_FILE } from "../util/consts";

function Settings() {
  const toast = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const populateApiKey = async () => {
      if (!exists(API_KEY_FILE, { dir: BaseDirectory.AppData })) return;

      const key = await readTextFile(API_KEY_FILE, {
        dir: BaseDirectory.AppData,
      });

      setApiKey(key);
    };

    populateApiKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey) return;

    await writeTextFile("api-key.txt", apiKey, {
      dir: BaseDirectory.AppData,
    });

    toast({
      title: "Saved",
      description: "Your API key has been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Heading size="md" color="whiteAlpha.400" fontWeight="normal">
        GPT Anywhere
      </Heading>
      <Heading>Settings</Heading>

      <Stack mt={4} spacing={4}>
        <FormControl>
          <FormLabel>OpenAI API Key</FormLabel>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey || ""}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <FormHelperText>
            You can generate an API key on{" "}
            <Link
              href="https://platform.openai.com/account/api-keys"
              isExternal
              color="blue.400"
            >
              OpenAI's website
            </Link>
          </FormHelperText>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          alignSelf="flex-end"
          onClick={handleSave}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
}

export default Settings;
