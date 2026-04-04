import React from "react"
import * as z from "zod"

import { IconSchema, ImageSchema } from '@/presentation-templates/defaultSchemes';
import { RemoteSvgIcon } from "@/app/hooks/useRemoteSvgIcon";

const layoutId = "bullet-with-icons-title-description"
const layoutName = "Список с иконками, заголовком и описанием"
const layoutDescription = "Макет со списком иконок, заголовками и описаниями для каждого элемента, а также общим заголовком и пояснительным текстом."

const ItemSchema = z
  .object({
    icon: IconSchema,
    title: z.string().min(3).max(40).default("Заголовок элемента"),
    description: z
      .string()
      .min(0)
      .max(160)
      .default(
        "Краткое поддерживающее описание, которое располагается под заголовком иконки."
      ),
  })
  .default({
    icon: {
      __icon_url__:
        "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/graduation-cap-bold.svg",
      __icon_query__: "feature icon",
    },
    title: "Заголовок элемента",
    description: "Краткое поддерживающее описание, которое располагается под заголовком иконки.",
  })

const Schema = z
  .object({
    title: z
      .string()
      .min(3)
      .max(60)
      .default("Наша инфографика"),
    sideHeading: z.string().min(0).max(60).default("Дополнительный заголовок"),
    sideParagraph: z
      .string()
      .min(0)
      .max(300)
      .default(
        "Краткий абзац, описывающий контекст. Старайтесь делать его лаконичным, чтобы он занимал одну или две строки."
      ),
    items: z
      .array(ItemSchema)
      .min(3)
      .max(4)
      .default([
        {
          icon: {
            __icon_url__:
              "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/graduation-cap-bold.svg",
            __icon_query__: "feature icon",
          },
          title: "Первый пункт",
          description:
            "Лаконичный текст под первой иконкой, раскрывающий суть данного пункта.",
        },
        {
          icon: {
            __icon_url__:
              "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/user-bold.svg",
            __icon_query__: "feature icon",
          },
          title: "Второй пункт",
          description:
            "Лаконичный текст под второй иконкой, раскрывающий суть данного пункта.",
        },
        {
          icon: {
            __icon_url__:
              "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/calendar-blank-bold.svg",
            __icon_query__: "feature icon",
          },
          title: "Третий пункт",
          description:
            "Лаконичный текст под третьей иконкой, раскрывающий суть данного пункта.",
        },
        {
          icon: {
            __icon_url__:
              "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/x-bold.svg",
            __icon_query__: "feature icon",
          },
          title: "Четвертый пункт",
          description:
            "Лаконичный текст под четвертой иконкой, раскрывающий суть данного пункта.",
        },
      ]),
    website: z.string().min(6).max(60).default("www.vash-sayt.ru"),
  })
  .default({
    title: "Наша инфографика",
    sideHeading: "Дополнительный заголовок",
    sideParagraph:
      "Краткий абзац, описывающий контекст. Старайтесь делать его лаконичным, чтобы он занимал одну или две строки.",
    items: [
      {
        icon: { __icon_url__: "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/graduation-cap-bold.svg", __icon_query__: "feature icon" },
        title: "Первый пункт",
        description: "Лаконичный текст под первой иконкой, раскрывающий суть данного пункта.",
      },
      {
        icon: { __icon_url__: "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/user-bold.svg", __icon_query__: "feature icon" },
        title: "Второй пункт",
        description: "Лаконичный текст под второй иконкой, раскрывающий суть данного пункта.",
      },
      {
        icon: { __icon_url__: "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/calendar-blank-bold.svg", __icon_query__: "feature icon" },
        title: "Третий пункт",
        description: "Лаконичный текст под третьей иконкой, раскрывающий суть данного пункта.",
      },
      {
        icon: { __icon_url__: "https://presenton-public.s3.ap-southeast-1.amazonaws.com/static/icons/bold/x-bold.svg", __icon_query__: "feature icon" },
        title: "Четвертый пункт",
        description: "Лаконичный текст под четвертой иконкой, раскрывающий суть данного пункта.",
      },
    ],
    website: "www.vash-sayt.ru",
  })

type SlideData = z.infer<typeof Schema>

interface SlideLayoutProps {
  data?: Partial<SlideData>
}

const InfographicFourIcons: React.FC<SlideLayoutProps> = ({ data }) => {
  const slideData = data || {}
  const items = slideData.items || []

  const renderTitle = (title?: string) => {
    if (!title) return null
    const parts = title.split("\n")
    return (
      <>
        {parts.map((p, i) => (
          <div key={i}>{p}</div>
        ))}
      </>
    )
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="w-full rounded-sm max-w-[1280px] shadow-lg max-h-[720px] aspect-video relative z-20 mx-auto overflow-hidden"
        style={{
          fontFamily: "var(--heading-font-family, 'Albert Sans', sans-serif)",
          backgroundColor: "var(--card-background-color, #FFFFFF)",
        }}
      >
        {/* Заголовок + правый абзац */}
        <div className="px-12 pt-8">
          <div className="grid grid-cols-[1.2fr_1fr] gap-10 items-start">
            <div className="text-[56px] leading-[1.05] font-semibold" style={{ color: "var(--text-heading-color, #111827)" }}>
              {renderTitle(slideData.title)}
            </div>
            <div className="mt-2">
              {slideData.sideHeading && (
                <div className="text-[16px] mb-2 font-semibold" style={{ color: "var(--text-heading-color, #111827)" }}>
                  {slideData.sideHeading}
                </div>
              )}
              {slideData.sideParagraph && (
                <div className="text-[14px] leading-[1.6]" style={{ color: "var(--text-body-color, #6B7280)" }}>
                  {slideData.sideParagraph}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ряд иконок */}
        <div className="px-12 pt-12">
          <div className="grid grid-flow-col auto-cols-[260px] gap-8 justify-center">
            {items.slice(0, 4).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="relative">
                  <div
                    className="w-40 h-40 rounded-full flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: 'var(--primary-accent-color, #BFF4FF)' }}
                  >
                    {/* Иконка */}
                    <RemoteSvgIcon
                      url={item.icon.__icon_url__}
                      strokeColor={"currentColor"}
                      className="w-14 h-14"
                      color="var(--text-heading-color, #111827)"
                      title={item.icon.__icon_query__}
                    />
                  </div>
                </div>
                <div className="mt-5 text-[16px] font-semibold" style={{ color: "var(--text-heading-color, #111827)" }}>
                  {item.title}
                </div>
                <div className="mt-2 text-[13px] leading-[1.6] max-w-[260px]" style={{ color: "var(--text-body-color, #6B7280)" }}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Футер */}
        <div className="absolute bottom-8 left-12 right-12 flex items-center">
          <span className="text-[14px]" style={{ color: "var(--text-body-color, #6B7280)" }}>{slideData.website}</span>
          <div className="ml-6 h-[2px] flex-1" style={{ backgroundColor: "var(--text-heading-color, #111827)" }}></div>
        </div>
        <div className="absolute bottom-7 right-6 w-8 h-8 rotate-45" style={{ backgroundColor: "var(--text-heading-color, #111827)" }}></div>
      </div>
    </>
  )
}

export { Schema, layoutId, layoutName, layoutDescription }
export default InfographicFourIcons
