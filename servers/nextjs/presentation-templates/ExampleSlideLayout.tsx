import * as z from "zod";
import { ImageSchema, IconSchema } from "@/presentation-templates/defaultSchemes";

export const Schema = z.object({
  title: z.string().min(5).max(50).default("Ежеквартальный обзор бизнеса").meta({
    description: "Основной заголовок слайда",
  }),

  subtitle: z
    .string()
    .min(3)
    .max(100)
    .optional()
    .default("Итоги деятельности за 1 квартал 2024 г.")
    .meta({
      description: "Дополнительный подзаголовок",
    }),

  metrics: z
    .array(
      z.object({
        label: z.string().min(2).max(20),
        value: z.string().min(1).max(10),
        trend: z.enum(["up", "down", "stable"]),
      })
    )
    .default([
      { label: "Выручка", value: "$2.4M", trend: "up" },
      { label: "Рост", value: "15%", trend: "up" },
    ])
    .meta({
      description: "Ключевые показатели эффективности (KPI)",
    }),

  chartImage: ImageSchema.default({
    __image_url__: "https://example.com/quarterly-chart.png",
    __image_prompt__: "Quarterly performance chart showing upward trend",
  }).meta({
    description: "Основной график производительности",
  }),

  trendIcon: IconSchema.default({
    __icon_url__: "/static/icons/placeholder.svg",
    __icon_query__: "upward trend arrow icon",
  }).meta({
    description: "Иконка индикатора тренда",
  }),
});

type SchemaType = z.infer<typeof Schema>;

export default function ExampleSlideLayout({ data }: { data: SchemaType }) {
  const { title, subtitle, metrics, chartImage, trendIcon } = data;
  return (
    <div className="aspect-video max-w-[1280px] w-full bg-white p-8 flex flex-col">
      <header className="slide-header mb-8">
        {title && <h1 className="text-4xl font-bold text-gray-900">{title}</h1>}
        {subtitle && <p className="text-xl text-gray-600 mt-2">{subtitle}</p>}
      </header>

      <main className="slide-content flex-1 flex items-start">
        {chartImage?.__image_url__ && (
          <div className="chart-section flex-1 bg-gray-100 rounded-xl p-4">
            <img
              src={chartImage.__image_url__}
              alt={chartImage.__image_prompt__}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}

        {metrics && metrics.length > 0 && (
          <div className="metrics-section w-1/3 ml-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Ключевые показатели</h2>
            <div className="space-y-4">
              {metrics.map((metric, index) => (
                <div
                  key={index}
                  className="metric-item p-4 bg-gray-50 border border-gray-100 rounded-lg shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-600">{metric.label}</span>
                    {trendIcon?.__icon_url__ && (
                      <img
                        src={trendIcon.__icon_url__}
                        alt={metric.trend}
                        className="w-6 h-6 opacity-70"
                      />
                    )}
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
