import React from 'react'
import * as z from "zod";

export const layoutId = 'table-of-contents-slide'
export const layoutName = 'Содержание'
export const layoutDescription = 'Профессиональный макет оглавления с нумерованными разделами и номерами страниц. Рекомендуется использовать сразу после вступительного слайда.'

const tableOfContentsSlideSchema = z.object({
    sections: z.array(z.object({
        number: z.number().min(1).meta({
            description: "Номер раздела"
        }),
        title: z.string().min(1).max(80).meta({
            description: "Название раздела"
        }),
        pageNumber: z.string().min(1).max(10).meta({
            description: "Номер страницы для этого раздела"
        })
    })).default([
        { number: 1, title: "Проблема", pageNumber: "03" },
        { number: 2, title: "Решение", pageNumber: "04" },
        { number: 3, title: "Обзор продукта", pageNumber: "05" },
        { number: 4, title: "Объем рынка", pageNumber: "06" },
        { number: 5, title: "Валидация рынка", pageNumber: "07" },
        { number: 6, title: "Успехи компании", pageNumber: "08" },
        { number: 7, title: "Эффективность продукта", pageNumber: "09" },
        { number: 8, title: "Бизнес-модель", pageNumber: "10" },
        { number: 9, title: "Конкурентное преимущество", pageNumber: "11" },
        { number: 10, title: "Команда", pageNumber: "12" }
    ]).meta({
        description: "Список разделов содержания",
    })
})

export const Schema = tableOfContentsSlideSchema

export type TableOfContentsSlideData = z.infer<typeof tableOfContentsSlideSchema>

interface TableOfContentsSlideLayoutProps {
    data?: Partial<TableOfContentsSlideData>
}

const TableOfContentsSlideLayout: React.FC<TableOfContentsSlideLayoutProps> = ({ data: slideData }) => {
    const sections = slideData?.sections || []
    const midPoint = Math.ceil(sections.length / 2)
    const leftSections = sections.slice(0, midPoint)
    const rightSections = sections.slice(midPoint)

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full rounded-sm max-w-[1280px] shadow-lg px-8 sm:px-12 lg:px-20 py-8 sm:py-12 lg:py-16 max-h-[720px] aspect-video bg-white relative z-20 mx-auto"
                style={{
                    fontFamily: 'var(--heading-font-family, Poppins, Inter, sans-serif)',
                    background: "var(--card-background-color, #ffffff)"
                }}
            >

                {/* Заголовок */}
                <div className="text-center mb-8 sm:mb-12 mt-6">
                    <h1 style={{ color: "var(--text-heading-color, #111827)" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                        Содержание
                    </h1>
                    {/* Декоративная волна */}
                    <div className="flex justify-center">
                        <svg width="80" height="20" viewBox="0 0 80 20" className="text-purple-600" style={{ color: "var(--primary-accent-color, #9333ea)" }}>
                            <path
                                d="M0 10 Q20 0 40 10 T80 10"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                            />
                        </svg>
                    </div>
                </div>

                {/* Сетка контента */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                    {/* Левая колонка */}
                    <div className="space-y-4 sm:space-y-6">
                        {leftSections.map((section) => (
                            <div key={section.number} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    {/* Блок с номером */}
                                    <div 
                                        style={{ background: "var(--primary-accent-color, #9333ea)", color: "#ffffff" }} 
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl group-hover:opacity-90 transition-opacity"
                                    >
                                        {section.number}
                                    </div>
                                    {/* Название раздела */}
                                    <span style={{ color: "var(--text-heading-color, #111827)" }} className="text-lg sm:text-xl font-medium group-hover:text-purple-600 transition-colors">
                                        {section.title}
                                    </span>
                                </div>
                                {/* Номер страницы */}
                                <div className="text-right">
                                    <span style={{ color: "var(--text-body-color, #4b5563)" }} className="text-lg sm:text-xl">
                                        {section.pageNumber}
                                    </span>
                                    {/* Пунктир */}
                                    <div style={{ color: "var(--text-body-color, #4b5563)", opacity: 0.3 }} className="text-sm mt-1">
                                        .....
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Правая колонка */}
                    <div className="space-y-4 sm:space-y-6">
                        {rightSections.map((section) => (
                            <div key={section.number} className="flex items-center justify-between group">
                                <div className="flex items-center space-x-4">
                                    {/* Блок с номером */}
                                    <div 
                                        style={{ background: "var(--primary-accent-color, #9333ea)", color: "#ffffff" }} 
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl group-hover:opacity-90 transition-opacity"
                                    >
                                        {section.number}
                                    </div>
                                    {/* Название раздела */}
                                    <span style={{ color: "var(--text-heading-color, #111827)" }} className="text-lg sm:text-xl font-medium group-hover:text-purple-600 transition-colors">
                                        {section.title}
                                    </span>
                                </div>
                                {/* Номер страницы */}
                                <div className="text-right">
                                    <span style={{ color: "var(--text-body-color, #4b5563)" }} className="text-lg sm:text-xl">
                                        {section.pageNumber}
                                    </span>
                                    {/* Пунктир */}
                                    <div style={{ color: "var(--text-body-color, #4b5563)", opacity: 0.3 }} className="text-sm mt-1">
                                        .....
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

export default TableOfContentsSlideLayout
