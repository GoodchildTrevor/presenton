export interface LLMConfig {
  LLM?: string;

  // Ollama
  OLLAMA_URL?: string;
  OLLAMA_MODEL?: string;

  // Image providers
  DISABLE_IMAGE_GENERATION?: boolean;
  IMAGE_PROVIDER?: string;

  // FLUX
  FLUX_URL?: string;

  // Other Configs
  TOOL_CALLS?: boolean;
  DISABLE_THINKING?: boolean;
  EXTENDED_REASONING?: boolean;
  WEB_GROUNDING?: boolean;

  // Only used in UI settings
  USE_CUSTOM_URL?: boolean;
}
