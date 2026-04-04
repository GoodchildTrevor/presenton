import React from 'react'
import * as z from "zod";

export const layoutId = 'table-info-slide'
export const layoutName = 'Таблица с информацией'
export const layoutDescription = 'Макет слайда с заголовком вверху, структурированной таблицей в центре и пояснительным текстом внизу.'

const tableInfoSlideSchema = z.object({
    title: z.string().min(3).max(40).default('Сравнение рынка').meta({
        description: "Основной заголовок слайда",
    }),
    tableData: z.object({
        headers: z.array(z.string().min(1).max(30)).min(2).max(5).meta({
            description: "Заголовки столбцов таблицы"
        }),
        rows: z.array(z.array(z.string().min(1).max(50))).min(2).max(6).meta({
            description: "Данные строк таблицы — каждая строка должна соответствовать количеству заголовков"
        })
    }).default({
        headers: ['Компания', 'Выручка', 'Рост', 'Доля рынка'],
        rows: [
            ['Компания А', '$2.5M', '15%', '25%'],
            ['Компания Б', '$1.8M', '12%', '18%'],
            ['Компания В', '$3.2M', '20%', '32%'],
            ['Наша компания', '$1.2M', '35%', '12%']
        ]
    }).meta({
        description: "Структура таблицы с заголовками и строками"
    }),
    description: z.string().min(10).max(200).default('Это сравнение демонстрирует нашу конкурентную позицию на рынке. Несмотря на текущую небольшую долю рынка, темпы нашего роста значительно превышают показатели конкурентов.').meta({
        description: "Описательный текст, который отображается под таблицей",
    })
})

export const Schema = tableInfoSlideSchema

export type TableInfoSlideData = z.infer<typeof tableInfoSlideSchema>

interface TableInfoSlideLayoutProps {
    data?: Partial<TableInfoSlideData>
}

const TableInfoSlideLayout: React.FC<TableInfoSlideLayoutProps> = ({ data: slideData }) => {
    const tableHeaders = slideData?.tableData?.headers || ['Компания', 'Выручка', 'Рост', 'Доля рынка']
    const tableRows = slideData?.tableData?.rows || [
        ['Компания А', '$2.5M', '15%', '25%'],
        ['Компания Б', '$1.8M', '12%', '18%'],
        ['Компания В', '$3.2M', '20%', '32%'],
        ['Наша компания', '$1.2M', '35%', '12%']
    ]

    return (
        <>
            {/* Импорт шрифтов Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video bg-white relative z-20 mx-auto overflow-hidden flex flex-col"
                style={{
                    fontFamily: 'var(--heading-font-family, Poppins, Inter, sans-serif)',
                    background: "var(--card-background-color, #ffffff)"
                }}
            >

                {/* Декоративные фоновые элементы */}
                <div className="absolute top-0 left-0 w-64 h-full opacity-10 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 400" fill="none">
                        <path d="M0 100C50 150 100 50 150 100C175 125 200 100 200 100V0H0V100Z" fill="#8b5cf6" opacity="0.3" />
                        <path d="M0 200C75 250 125 150 200 200V150C150 175 100 150 50 175L0 200Z" fill="#8b5cf6" opacity="0.2" />
                        <path d="M0 300C100 350 150 250 200 300V250C125 275 75 250 25 275L0 300Z" fill="#8b5cf6" opacity="0.1" />
                    </svg>
                </div>

                <div className="absolute top-0 right-0 w-64 h-full opacity-10 overflow-hidden transform scale-x-[-1]">
                    <svg className="w-full h-full" viewBox="0 0 200 400" fill="none">
                        <path d="M0 100C50 150 100 50 150 100C175 125 200 100 200 100V0H0V100Z" fill="#8b5cf6" opacity="0.3" />
                        <path d="M0 200C75 250 125 150 200 200V150C150 175 100 150 50 175L0 200Z" fill="#8b5cf6" opacity="0.2" />
                        <path d="M0 300C100 350 150 250 200 300V250C125 275 75 250 25 275L0 300Z" fill="#8b5cf6" opacity="0.1" />
                    </svg>
                </div>

                {/* Основной контент */}
                <div className="relative z-10 px-8 sm:px-12 lg:px-20 pt-12 py-8 flex-1 flex flex-col justify-between">

                    {/* Секция заголовка */}
                    <div className="text-center space-y-4">
                        <h1 style={{ color: "var(--text-heading-color, #111827)" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                            {slideData?.title || 'Сравнение рынка'}
                        </h1>
                        {/* Фиолетовая акцентная линия */}
                        <div style={{ background: "var(--primary-accent-color, #9333ea)" }} className="w-20 h-1 mx-auto"></div>
                    </div>

                    {/* Секция таблицы */}
                    <div className="flex-1 flex items-center justify-center py-8">
                        <div className="w-full max-w-4xl">
                            <div style={{ borderColor: "var(--secondary-accent-color, #e5e7eb)" }} className="bg-white rounded-lg shadow-lg border overflow-hidden">
                                {/* Шапка таблицы */}
                                <div style={{ backgroundColor: "var(--primary-accent-color, #9333ea)" }}>
                                    <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)` }}>
                                        {tableHeaders.map((header, index) => (
                                            <div key={index} className="px-6 py-4 font-semibold text-center text-sm sm:text-base text-white">
                                                {header}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Тело таблицы */}
                                <div className="divide-y divide-gray-200">
                                    {tableRows.map((row, rowIndex) => (
                                        <div
                                            key={rowIndex}
                                            className={`grid gap-px ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'} transition-colors duration-200`}
                                            style={{ gridTemplateColumns: `repeat(${tableHeaders.length}, 1fr)` }}
                                        >
                                            {row.slice(0, tableHeaders.length).map((cell, cellIndex) => (
                                                <div
                                                    key={cellIndex}
                                                    className="px-6 py-4 text-center text-sm sm:text-base"
                                                    style={{
                                                        color: "var(--text-body-color, #4b5563)",
                                                    }}
                                                >
                                                    {cell}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Секция описания */}
                    <div className="text-center space-y-4">
                        <div className="max-w-4xl mx-auto">
                            <p style={{ color: "var(--text-body-color, #4b5563)" }} className="text-sm sm:text-base leading-relaxed">
                                {slideData?.description || 'Это сравнение демонстрирует нашу конкурентную позицию на рынке. Несмотря на текущую небольшую долю рынка, темпы нашего роста значительно превышают показатели конкурентов.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TableInfoSlideLayout
