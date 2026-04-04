import React from 'react'
import * as z from "zod";
import { IconSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from '@/app/hooks/useRemoteSvgIcon';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";

export const layoutId = 'chart-with-bullets-slide'
export const layoutName = 'График со списком'
export const layoutDescription = 'Макет слайда с заголовком, описанием, графиком слева и блоками с иконками справа. Выбирайте этот вариант только при наличии данных для графика.'

const barPieLineAreaChartDataSchema = z.object({
    type: z.union([z.literal('bar'), z.literal('pie'), z.literal('line'), z.literal('area')]),
    data: z.array(z.object({
        name: z.string().meta({ description: "Название точки данных" }),
        value: z.number().meta({ description: "Значение точки данных" }),
    })).min(2).max(5)
})

const scatterChartDataSchema = z.object({
    type: z.literal('scatter'),
    data: z.array(z.object({
        x: z.number().meta({ description: "Координата X" }),
        y: z.number().meta({ description: "Координата Y" }),
    })).min(2).max(20)
})

const chartWithBulletsSlideSchema = z.object({
    title: z.string().min(3).max(40).default('Объем рынка').meta({
        description: "Основной заголовок слайда",
    }),
    description: z.string().min(10).max(150).default('Бизнес сталкивается с проблемами из-за устаревших технологий и растущих затрат, что ограничивает эффективность и рост.').meta({
        description: "Текст описания под заголовком",
    }),
    chartData: z.union([barPieLineAreaChartDataSchema, scatterChartDataSchema]).default({
        type: 'scatter',
        data: [
            { x: 5, y: 5 },
            { x: 10, y: 12 },
            { x: 15, y: 18 },
            { x: 20, y: 23 },
            { x: 25, y: 26 },
        ]
    }
    ),
    color: z.string().default('#3b82f6').meta({
        description: "Основной цвет элементов графика",
    }),
    showLegend: z.boolean().default(false).meta({
        description: "Показывать ли легенду графика",
    }),
    showTooltip: z.boolean().default(true).meta({
        description: "Показывать ли всплывающую подсказку",
    }),
    bulletPoints: z.array(z.object({
        title: z.string().min(2).max(80).meta({
            description: "Заголовок пункта списка",
        }),
        description: z.string().min(10).max(150).meta({
            description: "Описание пункта списка",
        }),
        icon: IconSchema,
    })).min(1).max(3).default([
        {
            title: 'Общий объем целевого рынка',
            description: 'Компании могут использовать TAM для планирования будущего расширения и инвестиций.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/chart-line-up-bold.svg',
                __icon_query__: 'target market scope'
            }
        },
        {
            title: 'Объем доступного рынка',
            description: 'Указывает на более измеримые сегменты рынка для усилий по продажам.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/chart-line-up-bold.svg',
                __icon_query__: 'pie chart analysis'
            }
        },
        {
            title: 'Объем реально достижимого рынка',
            description: 'Помогает компаниям планировать стратегии развития в соответствии с рынком.',
            icon: {
                __icon_url__: 'https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/chart-line-up-bold.svg',
                __icon_query__: 'trending up growth'
            }
        }
    ]).meta({
        description: "Список пунктов с цветными блоками и иконками",
    })
})

export const Schema = chartWithBulletsSlideSchema

export type ChartWithBulletsSlideData = z.infer<typeof chartWithBulletsSlideSchema>

interface ChartWithBulletsSlideLayoutProps {
    data?: Partial<ChartWithBulletsSlideData>
}

const chartConfig = {
    value: {
        label: "Значение",
    },
    name: {
        label: "Наименование",
    },
};

const ChartWithBulletsSlideLayout: React.FC<ChartWithBulletsSlideLayoutProps> = ({ data: slideData }) => {
    const chartData = slideData?.chartData?.data || [];
    const chartType = slideData?.chartData?.type;
    const color = slideData?.color || 'var(--primary-accent-color,#9333ea)';
    const xAxis = chartType === 'scatter' ? 'x' : 'name';
    const yAxis = chartType === 'scatter' ? 'y' : 'value';
    const showLegend = slideData?.showLegend || false;
    const showTooltip = slideData?.showTooltip || true;
    const bulletPoints = slideData?.bulletPoints || []

    const renderChart = () => {
        const renderPieLabel = (props: any) => {
            const { name, percent, x, y, textAnchor } = props;
            return (
                <text x={x} y={y} textAnchor={textAnchor} fill="var(--text-body-color,#4b5563)" fontSize={12}>
                    {`${name} ${(percent * 100).toFixed(0)}%`}
                </text>
            );
        };
        const commonProps = {
            data: chartData,
            margin: { top: 20, right: 30, left: 40, bottom: 60 },
        };

        switch (chartType) {
            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke={color} opacity={0.2} />
                        <XAxis dataKey={xAxis} tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        <YAxis tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                        <Bar dataKey={yAxis} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );

            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke={color} opacity={0.2} />
                        <XAxis dataKey={xAxis} tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        <YAxis tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                        <Line
                            type="monotone"
                            dataKey={yAxis}
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                );

            case 'area':
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke={color} opacity={0.2} />
                        <XAxis dataKey={xAxis} tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        <YAxis tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                        <Area
                            type="monotone"
                            dataKey={yAxis}
                            stroke={color}
                            fill={color}
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                );

            case 'pie':
                return (
                    <PieChart margin={{ top: 20, right: 30, left: 40, bottom: 60 }}>
                        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="40%"
                            outerRadius={70}
                            fill={color}
                            dataKey={yAxis}
                            label={renderPieLabel}
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={color} />
                            ))}
                        </Pie>
                    </PieChart>
                );

            case 'scatter':
                return (
                    <ScatterChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke={color} opacity={0.2} />
                        <XAxis dataKey={xAxis} type="number" tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        <YAxis dataKey={yAxis} type="number" tick={{ fill: 'var(--text-body-color,#4b5563)', fontWeight: 600 }} />
                        {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                        <Scatter dataKey="y" fill={color} />
                    </ScatterChart>
                );

            default:
                return <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">Тип графика не поддерживается</div>;
        }
    };

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
                {/* Основной контент */}
                <div className="flex h-full px-8 sm:px-12 lg:px-20 pt-8 pb-8">
                    {/* Левая секция - Заголовок, Описание, График */}
                    <div className="flex-1 flex flex-col pr-8">
                        <h1 style={{ color: "var(--text-heading-color,#111827)" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            {slideData?.title}
                        </h1>

                        <p style={{ color: "var(--text-body-color,#4b5563)" }} className="text-base text-gray-700 leading-relaxed mb-8">
                            {slideData?.description}
                        </p>

                        <div className="flex-1 rounded-lg shadow-sm border border-gray-100 p-4" style={{ background: 'var(--primary-accent-color,#F5F8FE)' }}>
                            <ChartContainer config={chartConfig} className="h-full w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    {renderChart()}
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Правая секция - Пункты списка */}
                    <div className="flex-shrink-0 w-80 flex flex-col justify-center space-y-4">
                        {bulletPoints.map((bullet, index) => (
                            <div
                                key={index}
                                className="rounded-2xl p-6 text-white"
                                style={{
                                    backgroundColor: 'var(--primary-accent-color,#9333ea)'
                                }}
                            >
                                <div className="flex items-center space-x-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/20">
                                        <RemoteSvgIcon
                                            url={bullet.icon.__icon_url__}
                                            strokeColor={"currentColor"}
                                            className="w-5 h-5"
                                            color="white"
                                            title={bullet.icon.__icon_query__}
                                        />
                                    </div>
                                    <h3 style={{ color: "var(--text-heading-color,#ffffff)" }} className="text-lg font-semibold">
                                        {bullet.title}
                                    </h3>
                                </div>

                                <p style={{ color: "var(--text-body-color,#ffffff)" }} className="text-sm leading-relaxed opacity-90">
                                    {bullet.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChartWithBulletsSlideLayout;
