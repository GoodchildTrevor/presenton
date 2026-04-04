import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "modern-team-slide";
export const layoutName = "Современный слайд о команде";
export const layoutDescription =
  "Чистый современный макет слайда о команде, демонстрирующий профессиональные профили сотрудников в сине-белом дизайне.";

const teamMemberSchema = z.object({
  name: z.string().min(2).max(50).meta({
    description: "Полное имя члена команды",
  }),
  position: z.string().min(2).max(50).meta({
    description: "Должность или позиция",
  }),
  description: z.string().min(20).max(120).meta({
    description: "Краткое профессиональное описание члена команды",
  }),
  image: ImageSchema,
  linkedIn: z.string().optional().meta({
    description: "URL профиля LinkedIn (необязательно)",
  }),
});

const modernTeamSlideSchema = z.object({
  title: z.string().min(3).max(20).default("Наша команда").meta({
    description: "Основной заголовок слайда",
  }),
  subtitle: z.string().min(10).max(120).optional().meta({
    description: "Дополнительный подзаголовок с описанием команды",
  }),
  teamMembers: z
    .array(teamMemberSchema)
    .min(2)
    .max(3)
    .default([
      {
        name: "Сара Джонсон",
        position: "CEO и основатель",
        description:
          "Стратегический лидер с 15-летним опытом в технологиях и развитии бизнеса. Бывший вице-президент компании из Fortune 500.",
        image: {
          __image_url__:
            "https://plus.unsplash.com/premium_photo-1661589856899-6dd0871f9db6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnVzaW5lc3N3b21lbnxlbnwwfHwwfHx8MA%3D%3D",
          __image_prompt__: "Professional businesswoman CEO headshot",
        },
      },
      {
        name: "Майкл Чен",
        position: "CTO",
        description:
          "Технический эксперт, специализирующийся на масштабируемой архитектуре и решениях в области ИИ. Доктор компьютерных наук (MIT).",
        image: {
          __image_url__:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          __image_prompt__: "Professional businessman CTO headshot",
        },
      },
      {
        name: "Эмили Родригес",
        position: "Вице-президент по продажам",
        description:
          "Лидер по продажам с проверенным опытом создания высокоэффективных команд и обеспечения роста доходов на рынках B2B.",
        image: {
          __image_url__:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          __image_prompt__: "Professional businesswoman VP headshot",
        },
      },
    ])
    .meta({
      description: "Список членов команды с информацией о них",
    }),
  companyName: z.string().min(2).max(50).default("presenton").meta({
    description: "Название компании, отображаемое в шапке",
  }),
  date: z.string().min(5).max(50).default("13 июня 2038 г.").meta({
    description: "Текущая дата, отображаемая в шапке",
  }),
});

export const Schema = modernTeamSlideSchema;

export type ModernTeamSlideData = z.infer<typeof modernTeamSlideSchema>;

interface ModernTeamSlideLayoutProps {
  data?: Partial<ModernTeamSlideData>;
}

const ModernTeamSlideLayout: React.FC<ModernTeamSlideLayoutProps> = ({
  data: slideData,
}) => {
  return (
    <>
      {/* Импорт шрифта Montserrat */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className="w-full max-w-[1280px] max-h-[720px] aspect-video bg-white mx-auto rounded shadow-lg overflow-hidden relative z-20"
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* Шапка */}
        <div className="absolute top-8 left-10 right-10 flex justify-between items-center text-[#1E4CD9] text-sm font-semibold">
          <span>{slideData?.companyName}</span>
          <span>{slideData?.date}</span>
        </div>

        {/* Основной контент */}
        <div className="relative z-10 flex flex-col items-start justify-center h-full px-16 pt-24 pb-10">
          {/* Заголовок */}
          <h1
            className="text-7xl font-bold text-blue-600 mb-4 leading-tight text-left"
            style={{ letterSpacing: "-0.03em" }}
          >
            {slideData?.title || "Наша команда"}
          </h1>
          {/* Подзаголовок */}
          {slideData?.subtitle && (
            <p className="text-blue-600 text-lg leading-relaxed font-normal mb-12 max-w-lg text-left">
              {slideData?.subtitle}
            </p>
          )}
          {/* Ряд членов команды */}
          <div className="flex flex-row w-full justify-between items-start gap-6 mt-2">
            {slideData?.teamMembers?.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center bg-[#f7f9fc] rounded-lg shadow-md px-6 pt-6 pb-4 w-1/4 min-w-[210px] max-w-[240px] mx-auto"
                style={{ minHeight: 340 }}
              >
                {/* Фото */}
                <div className="relative w-28 h-28 mb-4 rounded overflow-hidden bg-white border-2 border-blue-100 flex items-center justify-center">
                  {member.image?.__image_url__ && (
                    <img
                      src={member.image.__image_url__}
                      alt={member.image.__image_prompt__ || member.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {/* Имя */}
                <div className="text-lg font-bold text-blue-700 mb-1">
                  {member.name}
                </div>
                {/* Бейдж должности */}
                <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-sm mb-2 uppercase tracking-wide">
                  {member.position}
                </div>
                {/* Описание */}
                <div className="text-sm text-gray-700 text-center mb-2 min-h-[48px]">
                  {member.description}
                </div>
                {/* Ссылка LinkedIn */}
                {member.linkedIn && (
                  <a
                    href={member.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-1"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Нижний разделитель */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
      </div>
    </>
  );
};

export default ModernTeamSlideLayout;
