import React from 'react'
// charts removed
import * as z from "zod";

const ImageSchema = z.object({
  __image_url__: z.string().url().default("https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200&auto=format&fit=crop").meta({
    description: "URL изображения",
  }),
  __image_prompt__: z.string().min(10).max(200).default("Elegant abstract green themed background for a presentation slide, minimal shapes, soft lighting").meta({
    description: "Промпт для генерации изображения. Максимум 40 слов",
  }),
})

const IconSchema = z.object({
  __icon_url__: z.string().default("https://static.thenounproject.com/png/1783767-200.png").meta({
    description: "URL иконки",
  }),
  __icon_query__: z.string().min(3).max(40).default("leaf growth").meta({
    description: "Запрос для поиска иконки. Максимум 6 слов",
  }),
})

const layoutId = "header-tagline-cards-grid-slide"
const layoutName = "Описание показателей"
const layoutDescription = "Слайд с заголовком, подзаголовком и сеткой карточек, каждая из которых содержит числовой блок и текст"

const CardSchema = z.object({
  number: z.string().min(1).max(5).default("45").meta({
    description: "Основное число внутри блока. От 1 до 3 цифр",
  }),
  numberSymbol: z.string().min(0).max(3).default("%").meta({
    description: "Необязательный символ рядом с числом",
  }),
  subtitle: z.string().min(8).max(28).default("Заголовок карточки").meta({
    description: "Подзаголовок карточки. До 5 слов",
  }),
  body: z.string().min(20).max(100).default("Краткое описание показателя и его влияния на общие бизнес-результаты.").meta({
    description: "Основной текст карточки. До 100 символов",
  }),
  icon: IconSchema.default({
    __icon_url__: "https://static.thenounproject.com/png/1783767-200.png",
    __icon_query__: "progress indicator",
  }).meta({
    description: "Необязательная иконка для области заголовка карточки",
  }),
})

const Schema = z.object({
  title: z.string().min(12).max(70).default("Достигаем новых высот вместе").meta({
    description: "Основной заголовок. Одна строка до 34 символов или две до 70. Максимум 9 слов",
  }),
  tagline: z.string().min(40).max(120).default("Мы внедряем инновационные решения и стратегии для устойчивого роста и повышения эффективности ключевых бизнес-процессов.").meta({
    description: "Подзаголовок под основным названием. До 20 слов",
  }),
  decorativeLine: ImageSchema.default({
    __image_url__: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='2' viewBox='0 0 220 2'><rect width='220' height='2' rx='1' fill='%230B8E26'/></svg>",
    __image_prompt__: "Thin green horizontal line divider, 220x2, rounded ends",
  }).meta({
    description: "SVG актив декоративной линии",
  }),
  cards: z.array(CardSchema).min(1).max(6).default([
    {
      number: "87",
      numberSymbol: "%",
      subtitle: "Лояльность клиентов",
      body: "Наши клиенты стабильно оценивают качество сервиса и продуктов на высшем уровне.",
      icon: { __icon_url__: "https://static.thenounproject.com/png/1783767-200.png", __icon_query__: "happy customer icon" },
    },
    {
      number: "2.5",
      numberSymbol: "M",
      subtitle: "Активных пользователей",
      body: "Растущая база пользователей, активно взаимодействующих с платформой по всему миру.",
      icon: { __icon_url__: "https://static.thenounproject.com/png/1783767-200.png", __icon_query__: "users group icon" },
    },
    {
      number: "99",
      numberSymbol: "%",
      subtitle: "Доступность системы",
      body: "Поддержание исключительной надежности и производительности ИТ-инфраструктуры.",
      icon: { __icon_url__: "https://static.thenounproject.com/png/1783767-200.png", __icon_query__: "server uptime icon" },
    },
    {
      number: "142",
      numberSymbol: "+",
      subtitle: "Глобальных партнеров",
      body: "Стратегические альянсы, способствующие инновациям и расширению рыночного влияния.",
      icon: { __icon_url__: "https://static.thenounproject.com/png/1783767-200.png", __icon_query__: "handshake deal icon" },
    },
    {
      number: "32",
      numberSymbol: "x",
      subtitle: "Рост выручки",
      body: "Ежегодный рост, подтверждающий сильную позицию на рынке и масштабируемость модели.",
      icon: { __icon_url__: "https://static.thenounproject.com/png/1783767-200.png", __icon_query__: "growth chart icon" },
    },
    {
      number: "500",
      numberSymbol: "K",
      subtitle: "Экологический вклад",
      body: "Стремление к устойчивому развитию через значительное сокращение углеродного следа.",
      icon: { __icon_url__: "https://static.thenounproject.com/png/1783767-200.png", __icon_query__: "leaf sustainability icon" },
    },
  ]).meta({
    description: "Сетка карточек с числом, подзаголовком и текстом (до 100 символов)",
  }),
})

type SlideData = z.infer<typeof Schema>

interface SlideLayoutProps {
  data?: Partial<SlideData>
}

const dynamicSlideLayout: React.FC<SlideLayoutProps> = ({ data: slideData }) => {
  const cards = slideData?.cards || []

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className=" w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden" style={{ fontFamily: "var(--heading-font-family,'Playfair Display', serif)", backgroundColor: 'var(--card-background-color, #FFFFFF)' }}>
        <div className="h-full flex flex-col px-10 pt-6 pb-8">

          <h1 className="mt-4 text-[64px] leading-[1.06] tracking-tight font-semibold" style={{ color: 'var(--text-heading-color, #111827)' }}>
            {slideData?.title || "Достигаем новых высот вместе"}
          </h1>

          <p className="mt-3 text-[16px] " style={{ color: 'var(--text-body-color, #6B7280)' }}>
            {slideData?.tagline || "Мы внедряем инновационные решения и стратегии для устойчивого роста и повышения эффективности."}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-6">
            {cards.map((card, idx) => (
              <div key={idx} className="rounded-md shadow-sm px-5 py-4" style={{ backgroundColor: 'var(--primary-accent-color, #1B8C2D)', color: 'var(--card-background-color, #FFFFFF)' }}>
                <div className="flex items-start gap-4">
                  <div className="flex items-baseline shrink-0">
                    <span className="text-white text-[48px] leading-none" style={{ color: 'var(--text-heading-color, #FFFFFF)' }}>
                      {card.number}
                    </span>
                    <span className="ml-1 text-white text-[24px] leading-none" style={{ color: 'var(--text-body-color, #FFFFFF)' }}>
                      {card.numberSymbol}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white text-[24px]" style={{ color: 'var(--text-heading-color, #FFFFFF)' }}>
                      {card.subtitle}
                    </h3>
                    <p className="mt-1 text-white/95 text-[16px] leading-[1.55]" style={{ color: 'var(--text-body-color, #FFFFFF)' }}  >
                      {card.body}
                    </p>
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
