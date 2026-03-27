import { setLLMConfig } from "@/store/slices/userConfig";
import { store } from "@/store/store";
import { LLMConfig } from "@/types/llm_config";

export const handleSaveLLMConfig = async (llmConfig: LLMConfig) => {
  if (!hasValidLLMConfig(llmConfig)) {
    throw new Error("Provided configuration is not valid");
  }
  await fetch("/api/user-config", {
    method: "POST",
    body: JSON.stringify(llmConfig),
  });

  store.dispatch(setLLMConfig(llmConfig));
};

export const hasValidLLMConfig = (llmConfig: LLMConfig) => {
  if (!llmConfig.LLM) return false;
  if (!llmConfig.DISABLE_IMAGE_GENERATION && !llmConfig.IMAGE_PROVIDER)
    return false;

  const isOllamaConfigValid =
    llmConfig.OLLAMA_MODEL !== "" &&
    llmConfig.OLLAMA_MODEL !== null &&
    llmConfig.OLLAMA_MODEL !== undefined &&
    llmConfig.OLLAMA_URL !== "" &&
    llmConfig.OLLAMA_URL !== null &&
    llmConfig.OLLAMA_URL !== undefined;

  const shouldValidateImages = !llmConfig.DISABLE_IMAGE_GENERATION;

  const isImageConfigValid = () => {
    if (!shouldValidateImages) {
      return true;
    }
    switch (llmConfig.IMAGE_PROVIDER) {
      case "flux":
        return llmConfig.FLUX_URL && llmConfig.FLUX_URL !== "";
      default:
        return false;
    }
  };

  const isLLMConfigValid =
    llmConfig.LLM === "ollama"
      ? isOllamaConfigValid
      : false;

  return isLLMConfigValid && isImageConfigValid();
};
