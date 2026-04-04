import React from "react";
import * as z from "zod";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const layoutId = "business-model-slide";
export const layoutName = "Слайд бизнес-модели";
export const layoutDescription =
  "Слайд презентации бизнес-модели, отображающий метрики CAC и стратегию монетизации.";

const businessModelSchema = z.object({
  companyName: z.string().min(2).max(50).default("Название компании").meta({
    description: "Название компании, отображаемое в заголовке",
  }),
  date: z.string().min(5).max(50).default("13 июня 2038 г.").meta({
    description: "Текущая дата, отображаемая в заголовке",
  }),
  title: z.string().min(3).max(20).default("Бизнес-модель"),
  description: z
    .string()
    .default(
      "Опишите, как вы монетизируете продукт, кто ваши клиенты, каковы каналы сбыта или структура комиссий. Цель — дать представление о том, как этот бизнес будет поддерживать ваш продукт или услугу, и объяснить, как компания будет зарабатывать деньги и достигать своих целей. Это можно показать с помощью графиков, статистики или диаграмм. Используйте показатели пожизненной ценности клиента (LTV) и стоимости привлечения клиента (CAC) для более наглядной картины.",
    )
    .meta({
      description:
        "Описание бизнес-модели, стратегии монетизации и затрат на привлечение клиентов.",
    }),
  cacChart: z
    .array(
      z.object({
        label: z.string().min(3).max(20),
        percentage: z.number().min(0).max(100),
      }),
    )
    .min(2)
    .max(5)
    .default([
      { label: "Интернет вещей", percentage: 70 },
      { label: "ИИ", percentage: 60 },
      { label: "Блокчейн", percentage: 50 },
      { label: "Облака", percentage: 40 },
      { label: "Кибербезопасность", percentage: 30 },
    ])
    .meta({
      description:
        "Массив объектов, представляющих стоимость привлечения клиентов (CAC) для различных сегментов бизнеса или каналов. Каждый объект должен включать 'label' (название сегмента) и 'percentage' (значение CAC в процентах от 0 до 100). Эти данные визуализируются на гистограмме.",
    }),
});

export const Schema = businessModelSchema;
export type BusinessModelData = z.infer<typeof businessModelSchema>;

interface Props {
  data?: Partial<BusinessModelData>;
}

const BusinessModelSlide: React.FC<Props> = ({ data }) => {
  const hasChart =
    data?.cacChart && Array.isArray(data.cacChart) && data.cacChart.length > 0;
  const cacChartData = hasChart ? data.cacChart : [];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video bg-white mx-auto relative z-20 overflow-hidden"
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* Шапка */}
        <div className="absolute top-8 left-10 right-10 flex justify-between items-center text-[#1E4CD9] text-sm font-semibold">
          <span>{data?.companyName}</span>
          <span>{data?.date}</span>
        </div>

        {/* Основной контент */}
        <div className="px-16 py-16 flex h-full gap-8">
          {/* Левая колонка - График и заголовок */}
          <div className="flex-1 pr-12 flex flex-col justify-center">
            <h1 className="text-6xl font-bold text-blue-600 mb-4 leading-tight text-left">
              {data?.title}
            </h1>
            {hasChart && (
              <div className="bg-white rounded-lg shadow p-4 mb-8">
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={cacChartData}
                      margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid stroke="#e5eafe" />
                      <XAxis
                        dataKey="label"
                        tick={{ fill: "#1E4CD9", fontWeight: 600, fontSize: 12 }}
                      />
                      <YAxis
                        tick={{ fill: "#1E4CD9", fontWeight: 600 }}
                        domain={[0, 100]}
                        ticks={[0, 20, 40, 60, 80, 100]}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1E4CD9",
                          border: "none",
                          color: "#fff",
                        }}
                        labelStyle={{ color: "#fff" }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend
                        wrapperStyle={{ color: "#1E4CD9", fontWeight: 600 }}
                        iconType="circle"
                      />
                      <Bar
                        dataKey="percentage"
                        fill="#3b82f6"
                        name="CAC %"
                        maxBarSize={48}
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - Описание */}
          <div className="flex flex-col items-start justify-center w-[52%] gap-8">
            <p className="text-blue-600 text-base leading-relaxed font-normal mb-6 max-w-xl text-left">
              {data?.description}
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
      </div>
    </>
  );
};

export default BusinessModelSlide;
