import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, X, Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const helpQuestions = [
  {
    id: 1,
    category: "Изображения",
    question: "Как изменить изображение?",
    answer:
      "Нажмите на любое изображение, чтобы открыть панель инструментов. Вы увидите варианты: Редактировать, Настроить положение и изменить способ вписывания изображения. Опция Редактировать позволяет заменить или изменить текущее изображение.",
  },
  {
    id: 2,
    category: "Изображения",
    question: "Можно ли создать изображение с помощью ИИ?",
    answer:
      "Да! Нажмите на любое изображение и выберите Редактировать в панели инструментов. В открывшейся боковой панели перейдите на вкладку Генерация ИИ. Введите описание нужного изображения, и ИИ создаст его по вашему запросу.",
  },
  {
    id: 3,
    category: "Изображения",
    question: "Как загрузить своё изображение?",
    answer:
      "Нажмите на изображение, затем выберите Редактировать. В боковой панели нажмите вкладку Загрузить. Выберите файл на вашем устройстве. После загрузки его можно применить к дизайну.",
  },
  {
    id: 11,
    category: "ИИ-запросы",
    question: "Можно ли изменить макет слайда через запрос?",
    answer:
      "Да! Нажмите на иконку WandSparkles в левом верхнем углу слайда — появится поле для ввода запроса. Опишите требуемый макет, и ИИ изменит слайд соответственно.",
  },
  {
    id: 12,
    category: "ИИ-запросы",
    question: "Можно ли изменить изображение слайда через запрос?",
    answer:
      "Да! Нажмите на иконку WandSparkles в левом верхнем углу слайда — появится поле для ввода. Опишите желаемое изображение, и ИИ обновит его согласно описанию.",
  },
  {
    id: 14,
    category: "ИИ-запросы",
    question: "Можно ли изменить содержимое слайда через запрос?",
    answer:
      "Да! Нажмите на иконку WandSparkles в левом верхнем углу слайда и введите описание нужного содержимого. ИИ обновит текст и контент слайда по вашему описанию.",
  },
  {
    id: 4,
    category: "Текст",
    question: "Как форматировать и выделять текст?",
    answer:
      "Выделите любой текст — появится панель форматирования. Доступны: Жирный, Курсив, Подчёркивание, Зачёркивание и другие опции.",
  },
  {
    id: 5,
    category: "Иконки",
    question: "Как изменить иконку?",
    answer:
      "Нажмите на любую иконку для её изменения. В панели выбора иконок можно просматривать коллекцию или использовать поиск. Доступны тысячи иконок в разных стилях.",
  },
  {
    id: 16,
    category: "Макет",
    question: "Можно ли изменить порядок слайдов?",
    answer:
      "Конечно! В боковой панели можно перетаскивать слайды и размещать их в нужном порядке.",
  },
  {
    id: 15,
    category: "Макет",
    question: "Можно ли добавить новый слайд между существующими?",
    answer:
      "Да! Нажмите на иконку плюса под нужным слайдом — отобразятся все доступные макеты, выберите подходящий.",
  },
  {
    id: 6,
    category: "Макет",
    question: "Можно ли добавить секции на слайд?",
    answer:
      "Конечно! Наведите курсор ниже любого текстового блока — появится иконка +. Нажмите, чтобы добавить секцию ниже. Также можно использовать меню Вставка для добавления конкретных типов секций.",
  },
  {
    id: 8,
    category: "Экспорт",
    question: "Как скачать или экспортировать презентацию?",
    answer:
      "Нажмите кнопку Экспорт в правом верхнем меню. Доступны форматы: PDF и PowerPoint.",
  },
];

const Help = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState(helpQuestions);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(helpQuestions.map((q) => q.category)));
    setCategories(["Все", ...uniqueCategories]);
  }, []);

  useEffect(() => {
    let results = helpQuestions;
    if (selectedCategory !== "Все") {
      results = results.filter((q) => q.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (q) => q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)
      );
    }
    setFilteredQuestions(results);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".help-button")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const modalClass = isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none";

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="help-button hidden fixed bottom-6 right-6 h-12 w-12 z-50 bg-emerald-600 hover:bg-emerald-700 rounded-full md:flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl"
        aria-label="Центр помощи"
      >
        {isOpen ? <X className="text-white h-5 w-5" /> : <HelpCircle className="text-white h-5 w-5" />}
      </button>

      <div
        className={`fixed bottom-20 right-6 z-50 max-w-md w-full transition-all duration-300 transform ${modalClass}`}
        ref={modalRef}
      >
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-emerald-600 text-white px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-medium">Центр помощи</h2>
            <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-700 p-1 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по темам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="px-6 pb-3 flex gap-2 overflow-x-auto hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="max-h-96 overflow-y-auto px-6 pb-6">
            {filteredQuestions.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredQuestions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 last:border-b-0">
                    <AccordionTrigger className="hover:no-underline py-3 px-1 text-left flex">
                      <div className="flex-1 pr-2">
                        <span className="text-gray-900 font-medium text-sm md:text-base">{faq.question}</span>
                        <span className="block text-xs text-emerald-600 mt-0.5">{faq.category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-3">
                      <div className="text-sm text-gray-600 leading-relaxed rounded bg-gray-50 p-3">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>Ничего не найдено по запросу "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("Все"); }}
                  className="mt-2 text-emerald-600 hover:underline text-sm"
                >
                  Сбросить поиск
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 text-center">
            Остались вопросы?{" "}
            <a href="/contact" className="text-emerald-600 hover:underline">Написать в поддержку</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
