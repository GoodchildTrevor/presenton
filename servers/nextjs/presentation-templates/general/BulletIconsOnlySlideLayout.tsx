import React from 'react'
import * as z from "zod";
import { ImageSchema, IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';

export const layoutId = 'bullet-icons-only-slide'
export const layoutName = 'Только пункты с иконками'
export const layoutDescription = 'Макет слайда с заголовком, сеткой пунктов (заголовок и описание) с иконками и поддерживающим изображением.'

const bulletIconsOnlySlideSchema = z.object({
    title: z.string().min(3).max(40).default('Решения').meta({
        description: "Основной заголовок слайда",
    }),
    image: ImageSchema.default({
        __image_url__: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        __image_prompt__: 'Business professionals collaborating and discussing solutions'
    }).meta({
        description: "Поддерживающее изображение для слайда",
    }),
    bulletPoints: z.array(z.object({
        title: z.string().min(2).max(80).meta({
            description: "Заголовок пункта",
        }),
        subtitle: z.string().min(5).max(150).optional().meta({
            description: "Дополнительный короткий подзаголовок или краткое пояснение",
        }),
        icon: IconSchema,
    })).min(2).max(4).default([
        {
            title: 'Индивидуальное ПО',
            subtitle: 'Мы создаем специализированное программное обеспечение для оптимизации процессов.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/code-bold.svg',
                __icon_query__: 'code software development'
            }
        },
        {
            title: 'Цифровой консалтинг',
            subtitle: 'Наши эксперты помогают организациям внедрять новейшие технологии.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/users-four-bold.svg',
                __icon_query__: 'users consulting team'
            }
        },
        {
            title: 'Сервисы поддержки',
            subtitle: 'Мы обеспечиваем постоянную поддержку для поддержания эффективности бизнеса.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/headphones-bold.svg',
                __icon_query__: 'headphones support service'
            }
        },
        {
            title: 'Масштабируемый маркетинг',
            subtitle: 'Стратегии на основе данных помогают расширить охват и вовлеченность.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/code-bold.svg',
                __icon_query__: 'trending up marketing growth'
            }
        }
    ]).meta({
        description: "Список пунктов с иконками и подзаголовками",
    })
})

export const Schema = bulletIconsOnlySlideSchema

export type BulletIconsOnlySlideData = z.infer<typeof bulletIconsOnlySlideSchema>

interface BulletIconsOnlySlideLayoutProps {
    data?: Partial<BulletIconsOnlySlideData>
}

const BulletIconsOnlySlideLayout: React.FC<BulletIconsOnlySlideLayoutProps> = ({ data: slideData }) => {
    const bulletPoints = slideData?.bulletPoints || []

    // Функция для определения классов сетки в зависимости от количества пунктов
    const getGridClasses = (count: number) => {
        if (count <= 2) {
            return 'grid-cols-1 gap-6'
        } else if (count <= 4) {
            return 'grid-cols-2 gap-6'
        } else {
            return 'grid-cols-2 lg:grid-cols-3 gap-6'
        }
    }

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div
                className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video bg-white relative z-20 mx-auto overflow-hidden"
                style={{
                    fontFamily: 'var(--heading-font-family, Inter, sans-serif)',
                    background: "var(--card-background-color,#ffffff)"
                }}
            >
                {/* Декоративные волнообразные узоры */}
                <div className="absolute top-0 left-0 w-32 h-full opacity-10 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 100 400" fill="none">
                        <path d="M0 100C25 150 50 50 75 100C87.5 125 100 100 100 100V0H0V100Z" fill="#8b5cf6" opacity="0.4" />
                        <path d="M0 200C37.5 250 62.5 150 100 200V150C75 175 50 150 25 175L0 200Z" fill="#8b5cf6" opacity="0.3" />
                    </svg>
                </div>

                <div className="absolute bottom-0 left-0 w-48 h-32 opacity-10 overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 100" fill="none">
                        <path d="M0 50C50 25 100 75 150 50C175 37.5 200 50 200 50V100H0V50Z" fill="#8b5cf6" opacity="0.2" />
                    </svg>
                </div>

                {/* Основной контент */}
                <div className="relative z-10 flex h-full px-8 sm:px-12 lg:px-20 pt-12 pb-8">
                    {/* Левая секция - Заголовок и пункты */}
                    <div className="flex-1 flex flex-col pr-8">
                        {/* Заголовок */}
                        <h1 style={{ color: "var(--text-heading-color,#111827)" }} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8">
                            {slideData?.title || 'Решения'}
                        </h1>

                        {/* Сетка пунктов */}
                        <div className={`grid ${getGridClasses(bulletPoints.length)} flex-1 content-center`}>
                            {bulletPoints.map((bullet, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start space-x-4 p-4 rounded-lg`}
                                >
                                    {/* Иконка */}
                                    <div style={{ background: "var(--primary-accent-color,#9333ea)" }} className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                                        <RemoteSvgIcon
                                            url={bullet.icon.__icon_url__}
                                            strokeColor={"currentColor"}
                                            className="w-6 h-6"
                                            color="var(--text-heading-color,#ffffff)"
                                            title={bullet.icon.__icon_query__}
                                        />
                                    </div>

                                    {/* Текст */}
                                    <div className="flex-1">
                                        <h3 style={{ color: "var(--text-heading-color,#111827)" }} className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                                            {bullet.title}
                                        </h3>
                                        {bullet.subtitle && (
                                            <p style={{ color: "var(--text-body-color,#4b5563)" }} className="text-sm text-gray-700 leading-relaxed">
                                                {bullet.subtitle}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Правая секция - Изображение */}
                    <div className="flex-shrink-0 w-96 flex items-center justify-center relative">
                        {/* Декоративные элементы */}
                        <div style={{ color: "var(--primary-accent-color,#9333ea)" }} className="absolute top-8 right-8 opacity-60">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M16 0l4.12 8.38L28 12l-7.88 3.62L16 24l-4.12-8.38L4 12l7.88-3.62L16 0z" />
                            </svg>
                        </div>

                        <div className="absolute top-16 left-8 opacity-20">
                            <svg width="80" height="20" viewBox="0 0 80 20" style={{ color: "var(--primary-accent-color,#9333ea)" }}>
                                <path
                                    d="M0 10 Q20 0 40 10 T80 10"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    fill="none"
                                />
                            </svg>
                        </div>

                        {/* Основное изображение */}
                        <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={slideData?.image?.__image_url__ || ''}
                                alt={slideData?.image?.__image_prompt__ || slideData?.title || ''}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BulletIconsOnlySlideLayout;
