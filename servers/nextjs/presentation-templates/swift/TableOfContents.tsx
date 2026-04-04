import React from "react"
import * as z from "zod"

const layoutId = "SwiftTableOfContents"
const layoutName = "Содержание"
const layoutDescription = "Swift: Оглавление с поддержкой до 10 пунктов (заголовок + описание)"

const ToCItemSchema = z
  .object({
    title: z.string().min(3).max(40).default("Введение"),
    description: z
      .string()
      .min(0)
      .max(60)
      .default("Краткий обзор раздела."),
  })
  .default({ title: "Введение", description: "Краткий обзор раздела." })

const Schema = z
  .object({
    title: z
      .string()
      .min(3)
      .max(60)
      .default("Содержание"),
    items: z
      .array(ToCItemSchema)
      .min(1)
      .max(10)
      .default([
        { title: "Введение", description: "Краткое описание нашей компании и целей." },
        { title: "Наша команда", description: "Руководство и ключевые участники." },
        { title: "Таймлайн", description: "План реализации и основные этапы." },
        { title: "Рекомендации", description: "Ключевые предложения на основе требований." },
        { title: "Решение", description: "Что мы предлагаем и почему это работает." },
        { title: "Рынок", description: "Аудитория, сегменты и объем возможностей." },
        { title: "Бизнес-модель", description: "Как мы создаем и получаем ценность." },
        { title: "Заключение", description: "Заключительные мысли и следующие шаги." },
      ]),
    website: z.string().min(6).max(60).default("www.vash-sayt.ru"),
  })
  .default({
    title: "Содержание",
    items: [
      { title: "Введение", description: "Краткое описание нашей компании и целей." },
      { title: "Наша команда", description: "Руководство и ключевые участники." },
      { title: "Таймлайн", description: "План реализации и основные этапы." },
      { title: "Рекомендации", description: "Ключевые предложения на основе требований." },
      { title: "Решение", description: "Что мы предлагаем и почему это работает." },
      { title: "Рынок", description: "Аудитория, сегменты и объем возможностей." },
      { title: "Бизнес-модель", description: "Как мы создаем и получаем ценность." },
      { title: "Заключение", description: "Заключительные мысли и следующие шаги." },
    ],
    website: "www.vash-sayt.ru",
  })

type SlideData = z.infer<typeof Schema>

interface SlideLayoutProps {
  data?: Partial<SlideData>
}

const TableOfContents: React.FC<SlideLayoutProps> = ({ data: slideData }) => {
  const items = slideData?.items || []
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className=" w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden"
        style={{
          fontFamily: "var(--heading-font-family, Albert Sans)",
          backgroundColor: "var(--card-background-color, #FFFFFF)",
        }}
      >


        <div className="px-12 pt-10">
          <h1 className="text-[48px] leading-[1.1] font-semibold" style={{ color: "var(--text-heading-color, #111827)" }}>
            {slideData?.title || "Содержание"}
          </h1>
        </div>

        {/* Список пунктов */}
        <div className="px-12 pt-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-w-[1180px]">
            {items.slice(0, 10).map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-start gap-6">
                  <div className="flex-none">
                    <div
                      className="leading-none font-semibold"
                      style={{
                        fontSize: 48,
                        color: "var(--text-heading-color, #BFF4FF)",
                        opacity: 0.8
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="text-[22px] leading-[1.2] font-semibold" style={{ color: "var(--text-heading-color, #111827)" }}>
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="mt-2 text-[14px] leading-[1.6]" style={{ color: "var(--text-body-color, #6B7280)" }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 h-px" style={{ backgroundColor: "rgba(59,130,246,0.15)" }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Футер */}
        <div className="absolute bottom-8 left-12 right-12 flex items-center">
          <span className="text-[14px]" style={{ color: "var(--text-body-color, #6B7280)" }}>
            {slideData?.website}
          </span>
          <div className="ml-6 h-[2px] flex-1" style={{ backgroundColor: "var(--text-heading-color, #111827)" }}></div>
        </div>
        <div className="absolute bottom-7 right-6 w-8 h-8 rotate-45" style={{ backgroundColor: "var(--text-heading-color, #111827)" }}></div>
      </div>
    </>
  )
}

export { Schema, layoutId, layoutName, layoutDescription }
export default TableOfContents
