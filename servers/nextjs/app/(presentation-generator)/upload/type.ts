export interface UploadedFile {
  id: string;
  file: File;
  size: string;
}

export enum ThemeType {
  Light = "Светлая",
  Dark = "Тёмная",
  Custom = "Пользовательская",
  Faint_Yellow = "Бледно-жёлтая",
  Royal_Blue = "Королевский синий",
  Light_Red = "Светло-красная",
  Dark_Pink = "Тёмно-розовая",
}

export enum LanguageType {
  // Основные мировые языки
  English = "Английский (English)",
  Spanish = "Испанский (Español)",
  French = "Французский (Français)",
  German = "Немецкий (Deutsch)",
  Portuguese = "Португальский (Português)",
  Italian = "Итальянский (Italiano)",
  Dutch = "Нидерландский (Nederlands)",
  Russian = "Русский",
  ChineseSimplified = "Китайский упрощённый (中文)",
  ChineseTraditional = "Китайский традиционный (漢語)",
  Japanese = "Японский (日本語)",
  Korean = "Корейский (한국어)",
  Arabic = "Арабский (العربية)",
  Hindi = "Хинди (हिन्दी)",
  Bengali = "Бенгальский (বাংলা)",

  // Европейские языки
  Polish = "Польский (Polski)",
  Czech = "Чешский (Čeština)",
  Slovak = "Словацкий (Slovenčina)",
  Hungarian = "Венгерский (Magyar)",
  Romanian = "Румынский (Română)",
  Bulgarian = "Болгарский (Български)",
  Greek = "Греческий (Ελληνικά)",
  Serbian = "Сербский (Српски)",
  Croatian = "Хорватский (Hrvatski)",
  Bosnian = "Боснийский (Bosanski)",
  Slovenian = "Словенский (Slovenščina)",
  Finnish = "Финский (Suomi)",
  Swedish = "Шведский (Svenska)",
  Danish = "Датский (Dansk)",
  Norwegian = "Норвежский (Norsk)",
  Icelandic = "Исландский (Íslenska)",
  Lithuanian = "Литовский (Lietuvių)",
  Latvian = "Латышский (Latviešu)",
  Estonian = "Эстонский (Eesti)",
  Maltese = "Мальтийский (Malti)",
  Welsh = "Валлийский (Cymraeg)",
  Irish = "Ирландский (Gaeilge)",
  ScottishGaelic = "Шотландский гэльский (Gàidhlig)",
  Ukrainian = "Украинский (Українська)",

  // Ближний Восток и Центральная Азия
  Hebrew = "Иврит (עברית)",
  Persian = "Персидский/Фарси (فارسی)",
  Turkish = "Турецкий (Türkçe)",
  Kurdish = "Курдский (Kurdî)",
  Pashto = "Пушту (پښتو)",
  Dari = "Дари (دری)",
  Uzbek = "Узбекский (Oʻzbek)",
  Kazakh = "Казахский (Қазақша)",
  Tajik = "Таджикский (Тоҷикӣ)",
  Turkmen = "Туркменский (Türkmençe)",
  Azerbaijani = "Азербайджанский (Azərbaycan dili)",

  // Южная Азия
  Urdu = "Урду (اردو)",
  Tamil = "Тамильский (தமிழ்)",
  Telugu = "Телугу (తెలుగు)",
  Marathi = "Маратхи (मраठी)",
  Punjabi = "Панджаби (ਪੰਜਾਬੀ)",
  Gujarati = "Гуджарати (ગુજરાતી)",
  Malayalam = "Малаялам (മലയാളം)",
  Kannada = "Каннада (ಕನ್ನಡ)",
  Odia = "Одия (ଓଡ଼ିଆ)",
  Sinhala = "Сингальский (සිංහල)",
  Nepali = "Непальский (नेपाली)",

  // Восточная и Юго-Восточная Азия
  Thai = "Тайский (ไทย)",
  Vietnamese = "Вьетнамский (Tiếng Việt)",
  Lao = "Лаосский (ລາວ)",
  Khmer = "Кхмерский (ភាសាខ្មែរ)",
  Burmese = "Бирманский (မြန်မာစာ)",
  Tagalog = "Тагальский (Tagalog)",
  Javanese = "Яванский (Basa Jawa)",
  Sundanese = "Сунданский (Basa Sunda)",
  Malay = "Малайский (Bahasa Melayu)",
  Mongolian = "Монгольский (Монгол)",

  // Африканские языки
  Swahili = "Суахили (Kiswahili)",
  Hausa = "Хауса (Hausa)",
  Yoruba = "Йоруба (Yorùbá)",
  Igbo = "Игбо (Igbo)",
  Amharic = "Амхарский (አማርኛ)",
  Zulu = "Зулу (isiZulu)",
  Xhosa = "Коса (isiXhosa)",
  Shona = "Шона (ChiShona)",
  Somali = "Сомалийский (Soomaaliga)",

  // Коренные и редкие языки
  Basque = "Баскский (Euskara)",
  Catalan = "Каталанский (Català)",
  Galician = "Галисийский (Galego)",
  Quechua = "Кечуа (Runasimi)",
  Nahuatl = "Науатль (Nāhuatl)",
  Hawaiian = "Гавайский (ʻŌlelo Hawaiʻi)",
  Maori = "Маори (Te Reo Māori)",
  Tahitian = "Таитянский (Reo Tahiti)",
  Samoan = "Самоанский (Gagana Samoa)",
}

export interface PresentationConfig {
  slides: string | null;
  language: LanguageType | null;
  prompt: string;
  tone: ToneType;
  verbosity: VerbosityType;
  instructions: string;
  includeTableOfContents: boolean;
  includeTitleSlide: boolean;
  webSearch: boolean;
}

export enum ToneType {
  Default = "По умолчанию",
  Casual = "Повседневный",
  Professional = "Деловой",
  Funny = "Юмористический",
  Educational = "Обучающий",
  Sales_Pitch = "Продающая презентация",
}

export enum VerbosityType {
  Concise = "Кратко",
  Standard = "Стандартно",
  Text_Heavy = "Много текста",
}
