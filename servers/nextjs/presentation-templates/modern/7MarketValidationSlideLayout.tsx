import React from "react";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody } from "@/components/ui/table";
import { ChartContainer } from "@/components/ui/chart";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

export const layoutId = "market-validation-slide";
export const layoutName = "Слайд валидации рынка";
export const layoutDescription =
  "Макет слайда, предназначенный для представления данных о валидации рынка, включая гибкие метрики, сравнения и декоративное изображение.";

const marketValidationSchema = z.object({
  companyName: z.string().min(2).max(50).default("Название компании").meta({
    description: "Название компании, отображаемое в шапке",
  }),
  date: z.string().min(5).max(50).default("13 июня 2038 г.").meta({
    description: "Дата, отображаемая в шапке",
  }),
  title: z.string().min(3).max(20).default("Валидация рынка").meta({
    description: "Заголовок слайда",
  }),
  description: z
    .string()
    .min(50)
    .max(400)
    .default(
      "Это этап тестирования рынка, предназначенный для подтверждения того, что продукты компании востребованы и могут эффективно использоваться широким кругом потребителей. Для стартапов мы можем использовать данные, полученные аналогичными продуктами других компаний.",
    )
    .meta({
      description: "Основное описание слайда, объясняющее суть валидации рынка",
    }),
  comparisonData: z
    .array(
      z.object({
        label: z.string().min(2).max(50).meta({
          description: "Название сравниваемого объекта (компания, продукт и т.д.)",
        }),
        metricLabel: z.string().min(2).max(50).meta({
          description: "Название метрики (например, Пользователи, Доход и т.д.)",
        }),
        value: z.number().min(0).meta({
          description: "Числовое значение метрики",
        }),
      }),
    )
    .min(2)
    .max(5)
    .default([
      { label: "ООО 'Вектор'", metricLabel: "Выручка (тыс. $)", value: 2650 },
      { label: "Солфорд и Ко", metricLabel: "Выручка (тыс. $)", value: 1850 },
      { label: "Лицерия Групп", metricLabel: "Выручка (тыс. $)", value: 1010 },
    ])
    .meta({
      description: "Данные для сравнения, позволяющие использовать гибкие метрики и подписи",
    }),
  image: ImageSchema.optional().meta({
    description: "Необязательное декоративное изображение",
  }),
});

export const Schema = marketValidationSchema;

export type MarketValidationSlideData = z.infer<typeof marketValidationSchema>;

interface MarketValidationSlideLayoutProps {
  data?: Partial<MarketValidationSlideData>;
}

const MarketValidationSlideLayout: React.FC<
  MarketValidationSlideLayoutProps
> = ({ data: slideData }) => {
  const comparisonData = slideData?.comparisonData || [];

  // Палитра цветов для диаграммы (оттенки синего)
  const chartColors = ["#2563eb", "#1e40af", "#60a5fa", "#93c5fd", "#dbeafe"];

  // Определяем название метрики (берем из первой строки данных)
  const metricLabel =
    comparisonData.length > 0 ? comparisonData[0].metricLabel : "Показатель";

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="w-full max-w-[1280px] max-h-[720px] aspect-video bg-white mx-auto rounded shadow-lg overflow-hidden relative z-20"
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* Шапка */}
        <div className="absolute top-8 left-10 right-10 flex justify-between items-center text-[#1E4CD9] text-sm font-semibold">
          <span>{slideData?.companyName}</span>
          <span>{slideData?.date}</span>
        </div>

        {/* Основной контент */}
        <div className="px-16 py-16 flex h-full gap-8">
          {/* Левая колонка */}
          <div className="flex-1 pr-12 flex flex-col justify-center">
            <h1 className="text-6xl font-bold text-blue-600 mb-8 leading-tight text-left">
              {slideData?.title}
            </h1>
            <p className="text-blue-600 text-sm leading-relaxed font-normal mb-12 max-w-lg text-left">
              {slideData?.description}
            </p>
          </div>

          {/* Правая колонка — График сверху, Таблица снизу */}
          <div className="flex-1 flex flex-col justify-center items-center gap-6">
            {/* Гистограмма */}
            <Card className="w-full p-4 flex flex-col items-center">
              <div className="w-full h-64">
                <ChartContainer
                  config={{
                    value: { label: metricLabel, color: "#2563eb" },
                  }}
                >
                  <BarChart
                    data={comparisonData}
                    layout="vertical"
                    margin={{ left: 32, right: 16, top: 16, bottom: 16 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="label"
                      type="category"
                      width={120}
                      tick={{ fill: "#1e40af", fontWeight: 600, fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      name={metricLabel}
                      radius={[8, 8, 8, 8]}
                    >
                      {comparisonData.map((entry, idx) => (
                        <Cell
                          key={entry.label}
                          fill={chartColors[idx % chartColors.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </div>
            </Card>

            {/* Таблица данных */}
            <Card className="w-full overflow-hidden">
              <Table>
                <TableHeader>
                  <tr className="bg-slate-50">
                    <th className="text-left px-4 py-2 text-blue-700 font-bold">
                      Наименование
                    </th>
                    <th className="text-left px-4 py-2 text-blue-700 font-bold">
                      {metricLabel}
                    </th>
                  </tr>
                </TableHeader>
                <TableBody>
                  {comparisonData.map((entry) => (
                    <tr key={entry.label} className="border-t">
                      <td className="px-4 py-2 text-sm text-slate-700">{entry.label}</td>
                      <td className="px-4 py-2 text-sm font-semibold text-slate-900">
                        {entry.value.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
      </div>
    </>
  );
};

export default MarketValidationSlideLayout;
