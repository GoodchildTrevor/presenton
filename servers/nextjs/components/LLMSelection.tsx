"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import OllamaConfig from "./OllamaConfig";
import {
  updateLLMConfig,
  changeProvider as changeProviderUtil,
} from "@/utils/providerUtils";
import { IMAGE_PROVIDERS } from "@/utils/providerConstants";
import { LLMConfig } from "@/types/llm_config";

interface ButtonState {
  isLoading: boolean;
  isDisabled: boolean;
  text: string;
  showProgress: boolean;
  progressPercentage?: number;
  status?: string;
}

interface LLMProviderSelectionProps {
  initialLLMConfig: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
  buttonState: ButtonState;
  setButtonState: (
    state: ButtonState | ((prev: ButtonState) => ButtonState)
  ) => void;
}

export default function LLMProviderSelection({
  initialLLMConfig,
  onConfigChange,
  setButtonState,
}: LLMProviderSelectionProps) {
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(initialLLMConfig);
  const [openImageProviderSelect, setOpenImageProviderSelect] = useState(false);
  const isImageGenerationDisabled = llmConfig.DISABLE_IMAGE_GENERATION ?? false;

  useEffect(() => {
    onConfigChange(llmConfig);
  }, [llmConfig]);

  useEffect(() => {
    const needsModelSelection =
      llmConfig.LLM === "ollama" && !llmConfig.OLLAMA_MODEL;

    const needsOllamaUrl = llmConfig.LLM === "ollama" && !llmConfig.OLLAMA_URL;

    const needsFluxUrl =
      !llmConfig.DISABLE_IMAGE_GENERATION &&
      llmConfig.IMAGE_PROVIDER === "flux" &&
      !llmConfig.FLUX_URL;

    setButtonState({
      isLoading: false,
      isDisabled:
        needsModelSelection ||
        needsOllamaUrl ||
        needsFluxUrl,
      text: needsModelSelection
<<<<<<< HEAD
        ? "Пожалуйста, выберите модель"
        : needsOllamaUrl
        ? "Пожалуйста, введите URL Ollama"
        : needsFluxUrl
        ? "Пожалуйста, введите URL FLUX"
        : "Сохранить конфигурацию",
=======
        ? "Выберите модель"
        : needsOllamaUrl
        ? "Введите URL Ollama"
        : needsFluxUrl
        ? "Введите URL FLUX"
        : "Сохранить настройки",
>>>>>>> 6d6c9841b9a778d3f3dd6db5896b2e2b92061975
      showProgress: false,
    });
  }, [llmConfig]);

  const input_field_changed = (new_value: string | boolean, field: string) => {
    const updatedConfig = updateLLMConfig(llmConfig, field, new_value);
    setLlmConfig(updatedConfig);
  };

  const handleProviderChange = (provider: string) => {
    const newConfig = changeProviderUtil(llmConfig, provider);
    setLlmConfig(newConfig);
  };

  useEffect(() => {
    if (!llmConfig.USE_CUSTOM_URL) {
      setLlmConfig({ ...llmConfig, OLLAMA_URL: "http://localhost:11434" });
    } else {
      if (!llmConfig.OLLAMA_URL) {
        setLlmConfig({ ...llmConfig, OLLAMA_URL: "http://localhost:11434" });
      }
    }
  }, [llmConfig.USE_CUSTOM_URL]);

  useEffect(() => {
    setLlmConfig((prevConfig: LLMConfig) => {
      const updates: Partial<LLMConfig> = {};

      if (!prevConfig.DISABLE_IMAGE_GENERATION && !prevConfig.IMAGE_PROVIDER) {
        updates.IMAGE_PROVIDER = "flux";
      }

      if (!prevConfig.OLLAMA_URL) {
        updates.OLLAMA_URL = "http://localhost:11434";
      }

      if (!prevConfig.DISABLE_IMAGE_GENERATION &&
          prevConfig.IMAGE_PROVIDER === "flux" &&
          !prevConfig.FLUX_URL) {
        const fluxUrlFromWindow = (typeof window !== 'undefined' && (window as any).FLUX_URL) || undefined;
        if (fluxUrlFromWindow) {
          updates.FLUX_URL = fluxUrlFromWindow;
        }
      }

      if (Object.keys(updates).length === 0) {
        return prevConfig;
      }

      return { ...prevConfig, ...updates };
    });
  }, []);

  return (
    <div className="h-full flex flex-col mt-10">
      {/* Выбор провайдера - Фиксированный заголовок */}
      <div className="p-2 rounded-2xl border border-gray-200">
        <Tabs
          value={llmConfig.LLM || "ollama"}
          onValueChange={handleProviderChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 bg-transparent h-10">
            <TabsTrigger value="ollama">Ollama</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Прокручиваемый контент */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 custom_scrollbar">
        <Tabs
          value={llmConfig.LLM || "ollama"}
          onValueChange={handleProviderChange}
          className="w-full"
        >
          {/* Контент Ollama */}
          <TabsContent value="ollama" className="mt-6">
            <OllamaConfig
              ollamaModel={llmConfig.OLLAMA_MODEL || ""}
              ollamaUrl={llmConfig.OLLAMA_URL || ""}
              useCustomUrl={llmConfig.USE_CUSTOM_URL || false}
              onInputChange={input_field_changed}
            />
          </TabsContent>
        </Tabs>

        {/* Переключатель генерации изображений */}
        <div className="my-8">
          <div className="flex items-center justify-between mb-4 bg-green-50 p-2 rounded-sm">
            <label className="text-sm font-medium text-gray-700">
              Отключить генерацию изображений
            </label>
            <Switch
              checked={isImageGenerationDisabled}
              onCheckedChange={(checked: boolean) => {
                input_field_changed(checked, "disable_image_generation");
                if (checked) {
                  setOpenImageProviderSelect(false);
                }
              }}
            />
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span className="block w-1 h-1 rounded-full bg-gray-400"></span>
<<<<<<< HEAD
            Если включено, слайды не будут содержать автоматически созданные изображения.
=======
            При включении слайды не будут содержать автоматически сгенерированные изображения.
>>>>>>> 6d6c9841b9a778d3f3dd6db5896b2e2b92061975
          </p>
        </div>

        {!isImageGenerationDisabled && (
          <>
            {/* Выбор провайдера изображений */}
            <div className="my-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
<<<<<<< HEAD
                Выберите провайдера изображений
=======
                Выберите провайдер изображений
>>>>>>> 6d6c9841b9a778d3f3dd6db5896b2e2b92061975
              </label>
              <div className="w-full">
                <Popover
                  open={openImageProviderSelect}
                  onOpenChange={setOpenImageProviderSelect}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openImageProviderSelect}
                      className="w-full h-12 px-4 py-4 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors hover:border-gray-400 justify-between"
                    >
                      <div className="flex gap-3 items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {llmConfig.IMAGE_PROVIDER
                            ? IMAGE_PROVIDERS[llmConfig.IMAGE_PROVIDER]
                                ?.label || llmConfig.IMAGE_PROVIDER
<<<<<<< HEAD
                            : "Выберите провайдера"}
=======
                            : "Выберите провайдер"}
>>>>>>> 6d6c9841b9a778d3f3dd6db5896b2e2b92061975
                        </span>
                      </div>
                      <ChevronsUpDown className="w-4 h-4 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0"
                    align="start"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <Command>
                      <CommandInput placeholder="Поиск провайдера..." />
                      <CommandList>
                        <CommandEmpty>Провайдер не найден.</CommandEmpty>
                        <CommandGroup>
                          {Object.values(IMAGE_PROVIDERS).map(
                            (provider, index) => (
                              <CommandItem
                                key={index}
                                value={provider.value}
                                onSelect={(value: string) => {
                                  input_field_changed(value, "image_provider");
                                  setOpenImageProviderSelect(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    llmConfig.IMAGE_PROVIDER === provider.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                <div className="flex gap-3 items-center">
                                  <div className="flex flex-col space-y-1 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-sm font-medium text-gray-900 capitalize">
                                        {provider.label}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-600 leading-relaxed">
                                      {provider.description}
                                    </span>
                                  </div>
                                </div>
                              </CommandItem>
                            )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Ввод URL FLUX */}
            {llmConfig.IMAGE_PROVIDER === "flux" && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL сервера FLUX
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Введите URL сервера FLUX"
                    className="w-full px-4 py-2.5 outline-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    value={llmConfig.FLUX_URL || ""}
                    onChange={(e) => {
                      input_field_changed(e.target.value, "flux_url");
                    }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  <span className="block w-1 h-1 rounded-full bg-gray-400"></span>
                  URL вашего сервиса генерации изображений FLUX
                </p>
              </div>
            )}
          </>
        )}

        {/* Информация о модели */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                Выбранные модели
              </h3>
              <p className="text-sm text-blue-700">
                Используется{" "}
                {llmConfig.LLM === "ollama"
                  ? llmConfig.OLLAMA_MODEL || "Не выбрано"
                  : "Не выбрано"}{" "}
                для генерации текста{" "}
                {isImageGenerationDisabled ? (
                  "и генерация изображений отключена."
                ) : (
                  <>
                    и{" "}
                    {llmConfig.IMAGE_PROVIDER
                      ? IMAGE_PROVIDERS[llmConfig.IMAGE_PROVIDER]?.label ||
                        llmConfig.IMAGE_PROVIDER
                      : "Не выбрано"}{" "}
                    для изображений
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
