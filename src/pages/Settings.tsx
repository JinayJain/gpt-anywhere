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
import { STORE_KEY } from "../util/consts";
import store from "../util/store";

function Settings() {
  const toast = useToast();
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const populateApiKey = async () => {
      const key: string | null = await store.get(STORE_KEY.API_KEY);

      if (key) {
        setApiKey(key);
      }
    };

    populateApiKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey) return;

    await store.set(STORE_KEY.API_KEY, apiKey);
    await store.save();

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
