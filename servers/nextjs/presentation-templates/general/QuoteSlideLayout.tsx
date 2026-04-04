import React from 'react'
import * as z from "zod";
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'quote-slide'
export const layoutName = 'Цитата'
export const layoutDescription = 'Макет слайда с заголовком, вдохновляющей цитатой и фоновым изображением с наложением для лучшей читаемости текста.'

const quoteSlideSchema = z.object({
    heading: z.string().min(3).max(60).default('Мудрость дня').meta({
        description: "Основной заголовок слайда",
    }),
    quote: z.string().min(10).max(200).default('Успех — не окончателен, неудачи — не фатальны: значение имеет лишь мужество продолжать путь. Будущее принадлежит тем, кто верит в красоту своей мечты.').meta({
        description: "Основной текст цитаты",
    }),
    author: z.string().min(2).max(50).default('Уинстон Черчилль').meta({
        description: "Автор цитаты",
    }),
    backgroundImage: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80',
        __image_prompt__: 'Inspirational mountain landscape with dramatic sky and clouds'
    }).meta({
        description: "Фоновое изображение для слайда",
    })
})

export const Schema = quoteSlideSchema

export type QuoteSlideData = z.infer<typeof quoteSlideSchema>

interface QuoteSlideLayoutProps {
    data?: Partial<QuoteSlideData>
}

const QuoteSlideLayout: React.FC<QuoteSlideLayoutProps> = ({ data: slideData }) => {
    return (
        <>
            {/* Импорт шрифтов Google Fonts */}
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

                {/* Фоновое изображение */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${slideData?.backgroundImage?.__image_url__ || ''}')`,
                    }}
                />

                {/* Overlay (наложение) - низкая непрозрачность основного акцентного цвета */}
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: 'var(--primary-accent-color, #9333ea)', opacity: 0.3 }}
                ></div>

                {/* Декоративные элементы */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>

                {/* Основной контент */}
                <div className="relative z-10 px-8 sm:px-12 lg:px-20 pt-14 py-12 flex-1 flex flex-col justify-center h-full">
                    <div className="text-center space-y-8 max-w-4xl mx-auto">

                        {/* Заголовок */}
                        <div className="space-y-4">
                            <h1 style={{ color: "var(--text-heading-color, #ffffff)" }} className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                                {slideData?.heading || 'Мудрость дня'}
                            </h1>
                            {/* Акцентная линия */}
                            <div style={{ background: "var(--primary-accent-color, #9333ea)" }} className="w-20 h-1 mx-auto"></div>
                        </div>

                        {/* Секция цитаты */}
                        <div className="space-y-6">
                            {/* Иконка кавычек */}
                            <div className="flex justify-center">
                                <svg
                                    className="w-12 h-12 opacity-80" 
                                    style={{ color: "var(--primary-accent-color, #9333ea)" }}
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>

                            {/* Текст цитаты */}
                            <blockquote style={{ color: "var(--text-body-color, #ffffff)" }} className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed italic">
                                "{slideData?.quote || 'Успех — не окончателен, неудачи — не фатальны: значение имеет лишь мужество продолжать путь. Будущее принадлежит тем, кто верит в красоту своей мечты.'}"
                            </blockquote>

                            {/* Автор */}
                            <div className="flex justify-center items-center space-x-4">
                                <div style={{ background: "var(--primary-accent-color, #9333ea)" }} className="w-16 h-px"></div>
                                <cite className="text-base sm:text-lg font-semibold not-italic" style={{ color: "var(--primary-accent-color, #ffffff)" }}>
                                    {slideData?.author || 'Уинстон Черчилль'}
                                </cite>
                                <div style={{ background: "var(--primary-accent-color, #9333ea)" }} className="w-16 h-px"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нижняя декоративная граница */}
                <div className="absolute bottom-0 left-0 right-0 h-2" style={{ backgroundColor: 'var(--text-heading-color, #111827)' }}></div>
            </div>
        </>
    )
}

export default QuoteSlideLayout
