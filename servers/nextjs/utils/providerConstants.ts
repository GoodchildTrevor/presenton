export interface ModelOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  size: string;
}

export interface ImageProviderOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  requiresApiKey?: boolean;
  apiKeyField?: string;
  apiKeyFieldLabel?: string;
}

export interface LLMProviderOption {
  value: string;
  label: string;
  description?: string;
  model_value?: string;
  model_label?: string;
}

export const IMAGE_PROVIDERS: Record<string, ImageProviderOption> = {
  flux: {
    value: "flux",
    label: "FLUX",
    description: "FLUX image generation model",
    icon: "/icons/flux.png",
    requiresApiKey: false,
    apiKeyField: "FLUX_URL",
    apiKeyFieldLabel: "FLUX Server URL",
  },
};

export const LLM_PROVIDERS: Record<string, LLMProviderOption> = {
  ollama: {
    value: "ollama",
    label: "Ollama",
    description: "Ollama's primary text generation model",
  },
};
