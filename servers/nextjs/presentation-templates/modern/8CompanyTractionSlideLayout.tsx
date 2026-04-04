import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as z from "zod";

export const layoutId = "company-traction-slide";
export const layoutName = "Слайд трекшена компании";
export const layoutDescription =
  "Макет слайда для представления данных о трекшене компании, включая статистику роста по годам, визуализацию в виде графика и ключевые показатели.";

const growthStatsSchema = z
  .object({
    year: z.string(),
  })
  .catchall(z.number())
  .meta({
    description:
      "Статистика роста за конкретный год. Ключи — названия метрик, значения — числа.",
  });

const tractionSchema = z.object({
  companyName: z.string().min(2).max(50).default("Название компании").meta({
    description: "Название компании в шапке",
  }),
  date: z.string().min(5).max(50).default("13 июня 2038 г.").meta({
    description: "Текущая дата в шапке",
  }),
  title: z.string().default("Трекшен компании").meta({
    description: "Основной заголовок слайда",
  }),
  description: z
    .string()
    .min(3)
    .max(200)
    .default(
      "Трекшен — это период, когда компания ощущает импульс развития. Если этот импульс не использовать, продажи могут снизиться, а клиентская база — сократиться. Как правило, успех оценивается по объему выручки и количеству новых клиентов.",
    )
    .meta({
      description: "Основной текст, описывающий трекшен и динамику роста.",
    }),
  growthStats: z
    .array(growthStatsSchema)
    .min(1)
    .max(20)
    .default([
      growthStatsSchema.parse({
        year: "2020",
        искусственныйИнтеллект: 5,
        интернетВещей: 10,
        прочее: 8,
      }),
      growthStatsSchema.parse({
        year: "2021",
        искусственныйИнтеллект: 10,
        интернетВещей: 20,
        прочее: 15,
      }),
      growthStatsSchema.parse({
        year: "2022",
        искусственныйИнтеллект: 20,
        интернетВещей: 30,
        прочее: 22,
      }),
      growthStatsSchema.parse({
        year: "2023",
        искусственныйИнтеллект: 28,
        интернетВещей: 38,
        прочее: 29,
      }),
      growthStatsSchema.parse({
        year: "2024",
        искусственныйИнтеллект: 35,
        интернетВещей: 45,
        прочее: 34,
      }),
      growthStatsSchema.parse({
        year: "2025",
        искусственныйИнтеллект: 45,
        интернетВещей: 53,
        прочее: 42,
      }),
      growthStatsSchema.parse({
        year: "2026",
        искусственныйИнтеллект: 55,
        интернетВещей: 65,
        прочее: 52,
      }),
    ])
    .meta({
      description: "Данные роста для графика. Каждый объект содержит год и числовые метрики.",
    }),
});

export const Schema = tractionSchema;
export type CompanyTractionData = z.infer<typeof tractionSchema>;

interface Props {
  data?: Partial<CompanyTractionData>;
}

const defaultColors = [
  "#1E4CD9",
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#a21caf",
  "#6366f1",
  "#f43f5e",
  "#fbbf24",
  "#14b8a6",
];

function getSeriesKeys(
  growthStats: Array<Record<string, string | number>>,
): string[] {
  if (!growthStats.length) return [];
  const first = growthStats[0];
  return Object.keys(first).filter(
    (key) => key !== "year" && typeof first[key] === "number",
  );
}

// Форматирование ключей для отображения (CamelCase -> Слова с пробелами)
const formatLabel = (key: string) => 
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

function computeStats(
  growthStats: Array<Record<string, string | number>>,
  seriesKeys: string[],
) {
  if (!growthStats.length) return [];
  const first = growthStats[0];
  const last = growthStats[growthStats.length - 1];
  
  // Берем максимум 3 метрики для правой колонки, чтобы не перегружать интерфейс
  return seriesKeys.slice(0, 3).map((key) => {
    const start = typeof first[key] === "number" ? (first[key] as number) : 0;
    const end = typeof last[key] === "number" ? (last[key] as number) : 0;
    const growth = start === 0 ? 0 : ((end - start) / Math.abs(start)) * 100;
    const label = formatLabel(key);
    
    return {
      label: label,
      value: `${growth >= 0 ? "+" : ""}${Math.round(growth)}%`,
      description: `Рост показателя "${label}" за период.`,
    };
  });
}

const CompanyTractionSlideLayout: React.FC<Props> = ({ data }) => {
  const growthStats = data?.growthStats || [];
  const seriesKeys = getSeriesKeys(growthStats);
  const stats = computeStats(growthStats, seriesKeys);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="w-full max-w-[1280px] max-h-[720px] aspect-video bg-white mx-auto rounded shadow-lg overflow-hidden relative z-20"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {/* Header */}
        <div className="absolute top-8 left-10 right-10 flex justify-between items-center text-[#1E4CD9] text-sm font-semibold">
          <span>{data?.companyName}</span>
          <span>{data?.date}</span>
        </div>

        {/* Main Content */}
        <div className="px-16 py-16 flex h-full gap-8">
          {/* Left Column */}
          <div className="flex-1 pr-12 flex flex-col justify-center">
            <h1 className="text-6xl font-bold text-blue-600 mb-4 leading-tight text-left">
              {data?.title}
            </h1>
            <div className="bg-white rounded-lg shadow p-4 mb-8">
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthStats}>
                    <CartesianGrid stroke="#e5eafe" />
                    <XAxis
                      dataKey="year"
                      stroke="#1E4CD9"
                      tick={{ fill: "#1E4CD9", fontWeight: 600 }}
                    />
                    <YAxis
                      stroke="#1E4CD9"
                      tick={{ fill: "#1E4CD9", fontWeight: 600 }}
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
                    {seriesKeys.map((key, idx) => (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={defaultColors[idx % defaultColors.length]}
                        strokeWidth={3}
                        name={formatLabel(key)}
                        dot={{
                          r: 4,
                          fill: defaultColors[idx % defaultColors.length],
                        }}
                        activeDot={{
                          r: 6,
                          fill: defaultColors[idx % defaultColors.length],
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col items-start justify-center w-[52%] gap-8">
            <p className="text-blue-600 text-base leading-relaxed font-normal mb-6 max-w-xl text-left">
              {data?.description}
            </p>
            <div className="flex flex-row w-full gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex-1 bg-[#f5f8ff] rounded-lg shadow-sm px-5 py-4 flex flex-col items-start"
                >
                  <div className="bg-[#1E4CD9] text-white text-[10px] font-semibold px-2 py-1 rounded-sm mb-2 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-2xl font-bold text-[#1E4CD9] mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-700 leading-snug">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
      </div>
    </>
  );
};

export default CompanyTractionSlideLayout;
