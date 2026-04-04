import React from 'react'
// charts trimmed to donut only (inline SVG)
import * as z from "zod";


const ImageSchema = z.object({
    __image_url__: z.string().url().default("https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop").meta({
        description: "URL изображения",
    }),
    __image_prompt__: z.string().min(10).max(150).default("Abstract light background for slide header area").meta({
        description: "Промпт для генерации изображения. Максимум 30 слов",
    }),
})

const IconSchema = z.object({
    __icon_url__: z.string().url().default("https://cdn.jsdelivr.net/gh/tabler/tabler-icons/icons/placeholder.svg").meta({
        description: "URL иконки",
    }),
    __icon_query__: z.string().min(3).max(30).default("progress ring placeholder").meta({
        description: "Запрос для поиска иконки. Максимум 3 слова",
    }),
})

const layoutId = "visual-metrics"
const layoutName = "Визуальные показатели"
const layoutDescription = "Слайд с заголовком, текстовым блоком и сеткой карточек, содержащих круговые диаграммы и описания"

const CardSchema = z.object({
    title: z.string().min(6).max(18).default("Исследования").meta({
        description: "Заголовок карточки. До 3 слов",
    }),
    value: z.number().min(0).max(9999).default(67).meta({
        description: "Числовое значение для отображения",
    }),
    unit: z.string().min(0).max(2).default("K").meta({
        description: "Единица измерения (например, %, K, M)",
    }),
    description: z.string().min(1).max(50).default("Анализ рыночных тенденций и потребительского спроса").meta({
        description: "Поддерживающий текст. До 50 символов",
    }),
}).default({
    title: "Исследования",
    value: 67,
    unit: "K",
    description: "Анализ рыночных тенденций и потребительского спроса",
})

const Schema = z.object({
    topBar: z.object({
        marker: z.string().min(1).max(3).default("2").meta({
            description: "Числовой маркер в верхней панели. До 3 цифр",
        }),
    }).default({
        marker: "2",
    }),
    title: z.string().min(20).max(68).default("Наша стратегия развития и стремление к совершенству").meta({
        description: "Основной заголовок слайда. До 10 слов",
    }),
    description: z.string().min(70).max(200).default("Мы внедряем передовые технологии и инновационные подходы для достижения максимальной эффективности. Наша команда сфокусирована на создании устойчивых решений для бизнеса будущего.").meta({
        description: "Вступительный абзац. До 35 слов",
    }),
    cards: z.array(CardSchema).min(1).max(4).default([
        {
            title: "R&D отдел",
            value: 67,
            unit: "K",
            description: "Инвестиции в разработку новых продуктов",
        },
        {
            title: "Разработка",
            value: 80,
            unit: "%",
            description: "Доля завершенных этапов проекта",
        },
        {
            title: "Аналитика",
            description: "Точность прогнозирования бизнес-метрик",
            value: 92,
            unit: "%",
        },
        { 
            title: "Операции", 
            value: 45, 
            unit: "M", 
            description: "Общий объем обработанных данных за год" 
        },
    ]).meta({
        description: "Сетка карточек с заголовком, метрикой и текстом",
    }),
    chartPalette: z.array(z.string().min(4).max(20)).min(2).max(6).default(["var(--primary-accent-color, #1B8C2D)", "var(--tertiary-accent-color, #E5E7EB)", "#f59e0b", "#3b82f6"]).meta({
        description: "Палитра для графиков",
    }),
}).default({
    topBar: { marker: "2" },
    title: "Наша стратегия развития и стремление к совершенству",
    description: "Мы внедряем передовые технологии и инновационные подходы для достижения максимальной эффективности. Наша команда сфокусирована на создании устойчивых решений для бизнеса будущего.",
    cards: [
        { title: "R&D отдел", value: 67, unit: "K", description: "Инвестиции в разработку новых продуктов" },
        { title: "Операции", value: 42, unit: "M", description: "Общий объем обработанных данных" },
        { title: "Эффективность", value: 89, unit: "%", description: "Оптимизация внутренних процессов" },
        { title: "Разработка", value: 80, unit: "K", description: "Количество активных строк кода" },
    ],
    chartPalette: ["var(--primary-accent-color, #1B8C2D)", "var(--tertiary-accent-color, #E5E7EB)", "#f59e0b", "#3b82f6"],
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
            <div className=" w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden" style={{ fontFamily: "var(--heading-font-family, 'Playfair Display', serif)", backgroundColor: 'var(--card-background-color, #FFFFFF)' }}>

                <div className="px-12 pt-12">
                    <h1 className="text-[64px] leading-[1.05] tracking-tight font-semibold mt-2" style={{ color: 'var(--text-heading-color, #111827)' }}>
                        {slideData?.title}
                    </h1>
                    <p className="mt-5 text-[16px] leading-[1.6] max-w-[1020px] " style={{ color: 'var(--text-body-color, #6B7280)' }}>
                        {slideData?.description}
                    </p>
                </div>

                <div className="px-10 mt-10">
                    <div className="grid grid-cols-4 gap-8">
                        {cards.map((card, idx) => {
                            const radius = 80
                            const circumference = 2 * Math.PI * radius
                            const dasharray = circumference
                            return (
                                <div key={idx} className="rounded-xl border shadow-[0_24px_60px_rgba(0,0,0,0.08)]" style={{ backgroundColor: 'var(--card-background-color, #FFFFFF)', borderColor: 'rgba(0,0,0,0.06)' }}>
                                    <div className="px-8 pt-8 pb-7 flex flex-col items-center text-center h-full">
                                        <h3 className="text-[20px] leading-tight font-semibold min-h-[3rem] flex items-center" style={{ color: 'var(--text-heading-color, #111827)' }}>{card.title}</h3>
                                        <div className="mt-6 relative w-[160px] h-[160px]">
                                            <svg viewBox="0 0 200 200" className="w-full h-full">
                                                <circle cx="100" cy="100" r="80" fill="none" stroke="var(--tertiary-accent-color, #E5E7EB)" strokeWidth="16"></circle>
                                                <circle
                                                    cx="100"
                                                    cy="100"
                                                    r="80"
                                                    fill="none"
                                                    stroke={'var(--primary-accent-color, #1B8C2D)'}
                                                    strokeWidth="16"
                                                    strokeLinecap="round"
                                                    strokeDasharray={dasharray}
                                                    strokeDashoffset={0}
                                                    transform="rotate(-90 100 100)"
                                                ></circle>
                                                <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="10"></circle>
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-[28px] font-extrabold " style={{ color: 'var(--text-heading-color, #111827)' }}>{card.value}{card.unit}</span>
                                            </div>
                                        </div>
                                        <p className="mt-6 text-[14px] leading-[1.5] " style={{ color: 'var(--text-body-color, #6B7280)' }}>
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export { Schema, layoutId, layoutName, layoutDescription }
export default dynamicSlideLayout
