import React from 'react'
import * as z from "zod";
import { ImageSchema } from '@/presentation-templates/defaultSchemes';

export const layoutId = 'basic-info-slide'
export const layoutName = 'Основная информация'
export const layoutDescription = 'Чистый макет слайда с заголовком, описанием и поддерживающим изображением.'

const basicInfoSlideSchema = z.object({
    title: z.string().min(3).max(40).default('Обзор продукта').meta({
        description: "Основной заголовок слайда",
    }),
    description: z.string().min(10).max(150).default('Наш продукт предлагает настраиваемые дашборды для отчетности в реальном времени и принятия решений на основе данных. Он интегрируется со сторонними инструментами для оптимизации операций.').meta({
        description: "Основной текст описания",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: 'Business team in meeting room discussing product features and solutions'
    }).meta({
        description: "Поддерживающее изображение для слайда",
    })
})

export const Schema = basicInfoSlideSchema

export type BasicInfoSlideData = z.infer<typeof basicInfoSlideSchema>

interface BasicInfoSlideLayoutProps {
    data?: Partial<BasicInfoSlideData>
}

const BasicInfoSlideLayout: React.FC<BasicInfoSlideLayoutProps> = ({ data: slideData }) => {


    return (
        <>
            {/* Импорт шрифтов Google */}
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video bg-white relative z-20 mx-auto overflow-hidden"
                style={{
                    fontFamily: 'var(--heading-font-family,Inter)',
                    background: "var(--card-background-color,#ffffff)"
                }}
            >


                {/* Основной контент */}
                <div className="relative z-10 flex h-full px-8 sm:px-12 lg:px-20 pb-8">
                    {/* Левая секция - Изображение */}
                    <div className="flex-1 flex items-center justify-center pr-8">
                        <div className="w-full max-w-lg h-80 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={slideData?.image?.__image_url__ || ''}
                                alt={slideData?.image?.__image_prompt__ || slideData?.title || ''}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Правая секция - Контент */}
                    <div className="flex-1 flex flex-col justify-center pl-8 space-y-6">
                        {/* Заголовок */}
                        <h1 style={{ color: "var(--text-heading-color,#111827)" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {slideData?.title || 'Обзор продукта'}
                        </h1>

                        {/* Пурпурная акцентная линия */}
                        <div style={{ background: "var(--text-heading-color,#9333ea)" }} className="w-20 h-1 bg-purple-600"></div>

                        {/* Описание */}
                        <p style={{ color: "var(--text-body-color,#4b5563)" }} className="text-base sm:text-lg text-gray-700 leading-relaxed">
                            {slideData?.description || 'Наш продукт предлагает настраиваемые дашборды для отчетности в реальном времени и принятия решений на основе данных. Он интегрируется со сторонними инструментами для оптимизации операций.'}
                        </p>


                    </div>
                </div>
            </div>
        </>
    )
}

export default BasicInfoSlideLayout
