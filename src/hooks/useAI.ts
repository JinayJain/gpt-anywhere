import { Configuration, OpenAIApi } from "openai";
import React, { useMemo } from "react";

const useAI = (apiKey: string) => {
  const api = useMemo(() => {
    if (!apiKey) {
      return;
    }

    const config = new Configuration({
      apiKey,
    });

    return new OpenAIApi(config);
  }, [apiKey]);

  return api;
};

export default useAI;
