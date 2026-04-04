import React from 'react'
import * as z from "zod";
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'numbered-bullets-slide'
export const layoutName = 'Нумерованный список'
export const layoutDescription = 'Макет слайда с крупным заголовком, поддерживающим изображением и нумерованным списком с описаниями.'

const numberedBulletsSlideSchema = z.object({
    title: z.string().min(3).max(40).default('Валидация рынка').meta({
        description: "Основной заголовок слайда",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: 'Business people analyzing charts and data on wall'
    }).meta({
        description: "Поддерживающее изображение для слайда",
    }),
    bulletPoints: z.array(z.object({
        title: z.string().min(2).max(80).meta({
            description: "Заголовок пункта",
        }),
        description: z.string().min(10).max(150).meta({
            description: "Описание пункта",
        }),
    })).min(1).max(3).default([
        {
            title: 'Анализ клиентской базы',
            description: 'Опросы показывают, что 78% компаний планируют инвестировать в цифровые решения, при этом 85% предпочитают индивидуальный подход.'
        },
        {
            title: 'Успех пилотной программы',
            description: 'Результаты тестирования подтвердили высокий спрос: уровень удовлетворенности пользователей составил 92% после первого месяца использования.'
        },
        {
            title: 'Стратегическое партнерство',
            description: 'Заключение предварительных соглашений с ключевыми игроками отрасли подтверждает жизнеспособность нашей бизнес-модели.'
        }
    ]).meta({
        description: "Список нумерованных пунктов с описаниями",
    })
})

export const Schema = numberedBulletsSlideSchema

export type NumberedBulletsSlideData = z.infer<typeof numberedBulletsSlideSchema>

interface NumberedBulletsSlideLayoutProps {
    data?: Partial<NumberedBulletsSlideData>
}

const NumberedBulletsSlideLayout: React.FC<NumberedBulletsSlideLayoutProps> = ({ data: slideData }) => {
    const bulletPoints = slideData?.bulletPoints || []

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video bg-white relative z-20 mx-auto overflow-hidden"
                style={{
                    fontFamily: 'var(--heading-font-family, Poppins, Inter, sans-serif)',
                    background: "var(--card-background-color, #ffffff)"
                }}
            >

                {/* Основной контейнер контента */}
                <div className="px-8 sm:px-12 lg:px-20 pt-12 pb-8 h-full">
                    {/* Верхняя секция - Заголовок и Изображение */}
                    <div className="flex items-start justify-between mb-8">
                        {/* Секция заголовка */}
                        <div className="flex-1 pr-8">
                            <h1 style={{ color: "var(--text-heading-color, #111827)" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                {slideData?.title || 'Валидация рынка'}
                            </h1>
                            {/* Акцентная линия */}
                            <div style={{ background: "var(--primary-accent-color, #9333ea)" }} className="w-24 h-1 mb-6"></div>
                        </div>

                        {/* Секция изображения */}
                        <div className="flex-shrink-0 w-80 h-48">
                            <img
                                src={slideData?.image?.__image_url__ || ''}
                                alt={slideData?.image?.__image_prompt__ || slideData?.title || ''}
                                className="w-full h-full object-cover rounded-lg shadow-md" 
                                style={{ background: "var(--tertiary-accent-color, #e5e7eb)" }}
                            />
                        </div>
                    </div>

                    {/* Нумерованный список */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {bulletPoints.map((bullet, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                {/* Номер */}
                                <div className="flex-shrink-0">
                                    <div style={{ color: "var(--text-heading-color, #111827)" }} className="text-4xl sm:text-5xl font-bold opacity-20">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>

                                {/* Контент */}
                                <div className="flex-1 pt-2">
                                    <h3 style={{ color: "var(--text-heading-color, #111827)" }} className="text-xl sm:text-2xl font-bold mb-3">
                                        {bullet.title}
                                    </h3>
                                    <p style={{ color: "var(--text-body-color, #4b5563)" }} className="text-base leading-relaxed">
                                        {bullet.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Декоративный волнообразный узор внизу */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden pointer-events-none">
                        <svg
                            className="w-full h-full opacity-10"
                            viewBox="0 0 1200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0 100C300 150 600 50 900 100C1050 125 1125 100 1200 100V200H0V100Z"
                                fill="url(#wave-gradient)"
                            />
                            <defs>
                                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="var(--primary-accent-color, #9333ea)" />
                                    <stop offset="50%" stopColor="var(--primary-accent-color, #9333ea)" />
                                    <stop offset="100%" stopColor="var(--primary-accent-color, #9333ea)" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NumberedBulletsSlideLayout
