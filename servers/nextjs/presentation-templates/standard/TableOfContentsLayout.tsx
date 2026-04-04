import React from "react"
import * as z from "zod"

const layoutId = "table-of-contents-layout"
const layoutName = "Содержание"
const layoutDescription = "Заголовок с брендированным маркером, названием, необязательным описанием и списком оглавления в две колонки"

const ToCItemSchema = z
  .object({
    title: z.string().min(4).max(50).default("Введение").meta({
      description: "Название раздела. Макс. 50 символов",
    }),
  })
  .default({
    title: "Введение",
  })

const Schema = z
  .object({
    topBar: z
      .object({
        marker: z.string().min(1).max(3).default("2").meta({
          description: "Числовой маркер в верхней панели. До 3 цифр",
        }),
      })
      .default({ marker: "2" }),

    title: z
      .string()
      .min(12)
      .max(68)
      .default("Содержание")
      .meta({ description: "Основной заголовок слайда. Макс. 10 слов" }),

    description: z
      .string()
      .min(0)
      .max(200)
      .default(
        "Используйте этот раздел для быстрой навигации по разделам презентации."
      )
      .meta({ description: "Вводный абзац. Необязательно. Макс. 35 слов" }),

    items: z
      .array(ToCItemSchema)
      .min(3)
      .max(10)
      .default([
        { title: "Введение" },
        { title: "Постановка проблемы" },
        { title: "Решение" },
        { title: "Рынок" },
        { title: "Бизнес-модель" },
        { title: "План развития" },
        { title: "Команда" },
        { title: "Стратегия выхода на рынок" },
        { title: "Финансовые показатели" },
        { title: "Запрос инвестиций" },
      ])
      .meta({ description: "Список разделов (от 3 до 10)" }),
  })
  .default({
    topBar: { marker: "2" },
    title: "Содержание",
    description:
      "Используйте этот раздел для быстрой навигации по разделам презентации.",
    items: [
      { title: "Введение" },
      { title: "Постановка проблемы" },
      { title: "Решение" },
      { title: "Рынок" },
      { title: "Бизнес-модель" },
      { title: "План развития" },
      { title: "Команда" },
      { title: "Стратегия выхода на рынок" },
      { title: "Финансовые показатели" },
      { title: "Запрос инвестиций" },
    ],
  })

type SlideData = z.infer<typeof Schema>

interface SlideLayoutProps {
  data?: Partial<SlideData>
}

const dynamicSlideLayout: React.FC<SlideLayoutProps> = ({ data: slideData }) => {
  const items = slideData?.items || []

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className=" w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden"
        style={{
          fontFamily: "var(--heading-font-family, Playfair Display)",
          backgroundColor: "var(--card-background-color, #FFFFFF)",
        }}
      >

        <div className="px-12 pt-10">
          <h1
            className="text-[64px] leading-[1.05] tracking-tight font-semibold mt-2"
            style={{ color: "var(--text-heading-color, #111827)" }}
          >
            {slideData?.title || "Содержание"}
          </h1>
          {slideData?.description && (
            <p
              className="mt-5 text-[16px] leading-[1.6] max-w-[1020px] "
              style={{ color: "var(--text-body-color, #6B7280)" }}
            >
              {slideData?.description}
            </p>
          )}
        </div>

        <div className="px-10 mt-10">
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-sm border shadow-[0_8px_24px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-4"
                style={{
                  backgroundColor: "var(--primary-accent-color, #FFFFFF)",
                  borderColor: "rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] font-semibold"
                  style={{
                    border: "2px solid var(--primary-accent-color, #1B8C2D)",
                    color: "var(--text-heading-color, #111827)",
                  }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[18px] leading-tight font-semibold truncate"
                    style={{ color: "var(--text-heading-color, #111827)" }}
                  >
                    {item.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export { Schema, layoutId, layoutName, layoutDescription }
export default dynamicSlideLayout
