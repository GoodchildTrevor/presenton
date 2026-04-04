import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "market-size-pitchdeck-slide";
export const layoutName = "Слайд размера рынка";
export const layoutDescription =
  "Профессиональный макет слайда для презентации статистики объема рынка, включая TAM, SAM и SOM, с картой мира и ключевыми показателями.";

const marketSizeSlideSchema = z.object({
  title: z.string().min(3).max(15).default("Объем рынка").meta({
    description: "Основной заголовок слайда",
  }),
  companyName: z.string().min(2).max(50).default("Название компании").meta({
    description: "Название компании, отображаемое в шапке",
  }),
  date: z.string().min(5).max(50).default("13 июня 2038 г.").meta({
    description: "Дата, отображаемая в шапке",
  }),
  mapImage: ImageSchema.default({
    __image_url__:
      "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg",
    __image_prompt__: "World map with location pins or points",
  }),
  marketStats: z
    .array(
      z.object({
        label: z.string().min(3).max(30),
        value: z.string().min(3).max(30),
        description: z.string().min(3).max(130),
      }),
    )
    .min(1)
    .max(3)
    .default([
      {
        label: "Весь объем рынка (TAM)",
        value: "1.4 Миллиарда",
        description:
          "Общий объем целевого рынка — это максимально возможная выручка, которую компания может получить, если захватит 100% рынка.",
      },
      {
        label: "Доступный объем рынка (SAM)",
        value: "194 Миллиона",
        description:
          "Доля TAM, на которую компания может претендовать с учетом географии, технологий и специфики продукта.",
      },
      {
        label: "Реально достижимый рынок (SOM)",
        value: "167 Миллиона",
        description:
          "Доля SAM, которую компания планирует и способна реально занять в краткосрочной и среднесрочной перспективе.",
      },
    ])
    .meta({
      description:
        "Статистика рынка, включая TAM, SAM и SOM с названиями, значениями и описаниями.",
    }),
  description: z
    .string()
    .default(
      "Объем рынка — это совокупный показатель всех продаж и потенциальных клиентов. Данные показатели помогают компаниям оценить потенциал бизнеса в будущем. Это критически важно для новых компаний при оценке востребованности их услуг инвесторами и стейкхолдерами.",
    )
    .meta({
      description: "Основной текст описания для слайда",
    }),
});

export const Schema = marketSizeSlideSchema;
export type MarketSizeSlideData = z.infer<typeof marketSizeSlideSchema>;

interface MarketSizeSlideProps {
  data?: Partial<MarketSizeSlideData>;
}

const MarketSizeSlideLayout: React.FC<MarketSizeSlideProps> = ({
  data: slideData,
}) => {
  const stats = slideData?.marketStats || [];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video bg-white relative z-20 mx-auto overflow-hidden"
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* Шапка */}
        <div className="absolute top-8 left-10 right-10 flex justify-between items-center text-[#1E4CD9] text-sm font-semibold">
          <span>{slideData?.companyName || "Rimberio"}</span>
          <span>{slideData?.date || "13 июня 2038 г."}</span>
        </div>

        {/* Контент */}
        <div className="flex h-full px-16 pb-16">
          {/* Левая часть: Заголовок и Карта */}
          <div className="flex flex-col items-center justify-center w-[48%] pr-8 h-full">
            <div className="flex flex-col items-left justify-center h-full w-full">
              <h1
                className="text-6xl font-bold text-blue-600 mb-8 leading-tight text-left"
                style={{ marginTop: "112px" }}
              >
                {slideData?.title || "Объем рынка"}
              </h1>
              <div className="w-full bg-[#CBE3CC] rounded-md mb-8 flex items-center justify-center">
                {slideData?.mapImage?.__image_url__ && (
                  <img
                    src={slideData?.mapImage?.__image_url__}
                    alt="Карта мира"
                    className="w-full object-contain rounded-md"
                    style={{ maxHeight: 220 }}
                  />
                )}
              </div>
              {slideData?.description && (
                <p className="text-blue-600 text-sm leading-relaxed font-normal mb-12 max-w-lg text-left">
                  {slideData?.description}
                </p>
              )}
            </div>
          </div>

          {/* Правая часть: Статистика */}
          <div className="flex flex-col items-start justify-center w-[52%] gap-8">
            <div className="absolute top-36 right-10 w-[42%] space-y-10">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="space-y-2">
                    <div className="bg-[#1E4CD9] text-white text-sm font-semibold px-3 py-1 inline-block rounded-sm">
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#1E4CD9]">
                      {stat.value}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketSizeSlideLayout;
