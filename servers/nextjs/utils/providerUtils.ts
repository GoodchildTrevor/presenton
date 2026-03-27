import { LLMConfig } from "@/types/llm_config";

export interface OllamaModel {
  label: string;
  value: string;
  size: string;
}

export interface DownloadingModel {
  name: string;
  size: number | null;
  downloaded: number | null;
  status: string;
  done: boolean;
}

export interface OllamaModelsResult {
  models: OllamaModel[];
  updatedConfig?: LLMConfig;
}

/**
 * Updates LLM configuration based on field changes
 */
export const updateLLMConfig = (
  currentConfig: LLMConfig,
  field: string,
  value: string | boolean
): LLMConfig => {
  const fieldMappings: Record<string, keyof LLMConfig> = {
    ollama_url: "OLLAMA_URL",
    ollama_model: "OLLAMA_MODEL",
    image_provider: "IMAGE_PROVIDER",
    disable_image_generation: "DISABLE_IMAGE_GENERATION",
    use_custom_url: "USE_CUSTOM_URL",
    tool_calls: "TOOL_CALLS",
    disable_thinking: "DISABLE_THINKING",
    extended_reasoning: "EXTENDED_REASONING",
    web_grounding: "WEB_GROUNDING",
    flux_url: "FLUX_URL",
  };

  const configKey = fieldMappings[field];
  if (configKey) {
    return { ...currentConfig, [configKey]: value };
  }

  return currentConfig;
};

/**
 * Changes the provider and sets appropriate defaults
 */
export const changeProvider = (
  currentConfig: LLMConfig,
  provider: string
): LLMConfig => {
  const newConfig = { ...currentConfig, LLM: provider };

  // Auto Select appropriate image provider based on the text models
  if (provider === "ollama") {
    newConfig.IMAGE_PROVIDER = "flux"; // default for ollama
  }

  return newConfig;
};


export const checkIfSelectedOllamaModelIsPulled = async (ollamaModel: string) => {
  try {
    const response = await fetch('/api/v1/ppt/ollama/models/available');
    const models = await response.json();
    const pulledModels = models.map((model: any) => model.name);
    return pulledModels.includes(ollamaModel);
  } catch (error) {
    console.error('Error checking if selected Ollama model is pulled:', error);
    return false;
  }
}


/**
 * Resets downloading model state
 */
export const resetDownloadingModel = (): DownloadingModel => ({
  name: "",
  size: null,
  downloaded: null,
  status: "",
  done: false,
});

/**
 * Pulls Ollama model with progress tracking
 * Returns a promise that resolves with the final downloading model state
 */
export const pullOllamaModel = async (
  model: string,
  onProgress?: (model: DownloadingModel) => void
): Promise<DownloadingModel> => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/v1/ppt/ollama/model/pull?model=${model}`
        );
        if (response.status === 200) {
          const data = await response.json();
          if (data.done && data.status !== "error") {
            clearInterval(interval);
            onProgress?.(data);
            resolve(data);
          } else if (data.status === "error") {
            clearInterval(interval);
            const resetData = resetDownloadingModel();
            onProgress?.(resetData);
            reject(new Error("Error occurred while pulling model"));
          } else {
            onProgress?.(data);
          }
        } else {
          clearInterval(interval);
          const resetData = resetDownloadingModel();
          onProgress?.(resetData);
          if (response.status === 403) {
            reject(new Error("Request to Ollama Not Authorized"));
          }
          reject(new Error("Error occurred while pulling model"));
        }
      } catch (error) {
        clearInterval(interval);
        const resetData = resetDownloadingModel();
        onProgress?.(resetData);
        reject(error);
      }
    }, 1000);
  });
};