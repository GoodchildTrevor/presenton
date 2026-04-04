"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Download, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { handleSaveLLMConfig } from "@/utils/storeHelpers";
import LLMProviderSelection from "./LLMSelection";
import {
  checkIfSelectedOllamaModelIsPulled,
  pullOllamaModel,
} from "@/utils/providerUtils";
import { LLMConfig } from "@/types/llm_config";
import { trackEvent, MixpanelEvent } from "@/utils/mixpanel";
import { usePathname } from "next/navigation";

// Интерфейс состояния кнопки
interface ButtonState {
  isLoading: boolean;
  isDisabled: boolean;
  text: string;
  showProgress: boolean;
  progressPercentage?: number;
  status?: string;
}

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const config = useSelector((state: RootState) => state.userConfig);
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(config.llm_config);

  const [downloadingModel, setDownloadingModel] = useState<{
    name: string;
    size: number | null;
    downloaded: number | null;
    status: string;
    done: boolean;
  } | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [buttonState, setButtonState] = useState<ButtonState>({
    isLoading: false,
    isDisabled: false,
    text: "Сохранить конфигурацию",
    showProgress: false
  });

  const downloadProgress = useMemo(() => {
    if (downloadingModel && downloadingModel.downloaded !== null && downloadingModel.size !== null) {
      return Math.round((downloadingModel.downloaded / downloadingModel.size) * 100);
    }
    return 0;
  }, [downloadingModel?.downloaded, downloadingModel?.size]);

  const handleSaveConfig = async () => {
    trackEvent(MixpanelEvent.Home_SaveConfiguration_Button_Clicked, { pathname });
    try {
      setButtonState(prev => ({
        ...prev,
        isLoading: true,
        isDisabled: true,
        text: "Сохранение конфигурации..."
      }));
      
      trackEvent(MixpanelEvent.Home_SaveConfiguration_API_Call);
      await handleSaveLLMConfig(llmConfig);

      if (llmConfig.LLM === "ollama" && llmConfig.OLLAMA_MODEL) {
        trackEvent(MixpanelEvent.Home_CheckOllamaModelPulled_API_Call);
        const isPulled = await checkIfSelectedOllamaModelIsPulled(llmConfig.OLLAMA_MODEL);
        if (!isPulled) {
          setShowDownloadModal(true);
          trackEvent(MixpanelEvent.Home_DownloadOllamaModel_API_Call);
          await handleModelDownload();
        }
      }
      toast.info("Конфигурация успешно сохранена");
      setButtonState(prev => ({
        ...prev,
        isLoading: false,
        isDisabled: false,
        text: "Сохранить конфигурацию"
      }));
      
      trackEvent(MixpanelEvent.Navigation, { from: pathname, to: "/" });
      router.push("/");
    } catch (error) {
      toast.info(error instanceof Error ? error.message : "Не удалось сохранить конфигурацию");
      setButtonState(prev => ({
        ...prev,
        isLoading: false,
        isDisabled: false,
        text: "Сохранить конфигурацию"
      }));
    }
  };

  const handleModelDownload = async () => {
    try {
      await pullOllamaModel(llmConfig.OLLAMA_MODEL!, setDownloadingModel);
    }
    finally {
      setDownloadingModel(null);
      setShowDownloadModal(false);
    }
  };

  useEffect(() => {
    if (downloadingModel && downloadingModel.downloaded !== null && downloadingModel.size !== null) {
      const percentage = Math.round(((downloadingModel.downloaded / downloadingModel.size) * 100));
      setButtonState({
        isLoading: true,
        isDisabled: true,
        text: `Загрузка модели (${percentage}%)`,
        showProgress: true,
        progressPercentage: percentage,
        status: downloadingModel.status
      });
    }

    if (downloadingModel && downloadingModel.done) {
      setTimeout(() => {
        setShowDownloadModal(false);
        setDownloadingModel(null);
        toast.info("Модель успешно загружена!");
      }, 2000);
    }
  }, [downloadingModel]);

  return (
    <div className="h-screen bg-gradient-to-b font-instrument_sans from-gray-50 to-white flex flex-col overflow-hidden">
      <main className="flex-1 container mx-auto px-4 max-w-3xl overflow-hidden flex flex-col">
        {/* Брендированный заголовок */}
        <div className="text-center mb-2 mt-4 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/Logo.png" alt="Presenton Logo" className="h-12" />
          </div>
          <p className="text-gray-600 text-sm">
            Генератор презентаций на базе ИИ с открытым исходным кодом
          </p>
        </div>

        {/* Основная карточка конфигурации */}
        <div className="flex-1 overflow-hidden">
          <LLMProviderSelection
            initialLLMConfig={llmConfig}
            onConfigChange={setLlmConfig}
            buttonState={buttonState}
            setButtonState={setButtonState}
          />
        </div>
      </main>

      {/* Модальное окно прогресса загрузки */}
      {showDownloadModal && downloadingModel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <div className="text-center">
              {/* Иконка */}
              <div className="mb-4">
                {downloadingModel.done ? (
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                ) : (
                  <Download className="w-12 h-12 text-blue-600 mx-auto animate-pulse" />
                )}
              </div>

              {/* Заголовок */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {downloadingModel.done ? "Загрузка завершена!" : "Загрузка модели"}
              </h3>

              {/* Название модели */}
              <p className="text-sm text-gray-600 mb-6">
                {llmConfig.OLLAMA_MODEL}
              </p>

              {/* Прогресс-бар */}
              {downloadProgress > 0 && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Завершено: {downloadProgress}%
                  </p>
                </div>
              )}

              {/* Статус */}
              {downloadingModel.status && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 capitalize">
                    {downloadingModel.status}
                  </span>
                </div>
              )}

              {/* Сообщения статуса */}
              {downloadingModel.status && downloadingModel.status !== "pulled" && (
                <div className="text-xs text-gray-500">
                  {downloadingModel.status === "downloading" && "Загрузка файлов модели..."}
                  {downloadingModel.status === "verifying" && "Проверка целостности..."}
                  {downloadingModel.status === "pulling" && "Получение модели из реестра..."}
                </div>
              )}

              {/* Инфо о загрузке */}
              {downloadingModel.downloaded && downloadingModel.size && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Загружено: {(downloadingModel.downloaded / 1024 / 1024).toFixed(1)} МБ</span>
                    <span>Всего: {(downloadingModel.size / 1024 / 1024).toFixed(1)} МБ</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Фиксированная нижняя кнопка */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <div className="container mx-auto max-w-3xl">
          <button
            onClick={handleSaveConfig}
            disabled={buttonState.isDisabled}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-500 ${buttonState.isDisabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200"
              } text-white`}
          >
            {buttonState.isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {buttonState.text}
              </div>
            ) : (
              buttonState.text
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
