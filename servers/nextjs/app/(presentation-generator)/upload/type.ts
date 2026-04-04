export interface UploadedFile {
  id: string;
  file: File;
  size: string;
}

export enum ThemeType {
  Light = "Light",
  Dark = "Dark",
  Custom = "Custom",
  Faint_Yellow = "Faint Yellow",
  Royal_Blue = "Royal Blue",
  Light_Red = "Light Red",
  Dark_Pink = "Dark Pink",
}

export const ThemeTypeLabels: Record<ThemeType, string> = {
  [ThemeType.Light]: "Светлая",
  [ThemeType.Dark]: "Тёмная",
  [ThemeType.Custom]: "Пользовательская",
  [ThemeType.Faint_Yellow]: "Бледно-жёлтая",
  [ThemeType.Royal_Blue]: "Королевский синий",
  [ThemeType.Light_Red]: "Светло-красная",
  [ThemeType.Dark_Pink]: "Тёмно-розовая",
};

export enum LanguageType {
  // Major world languages
  English = "English",
  Spanish = "Spanish",
  French = "French",
  German = "German",
  Portuguese = "Portuguese",
  Italian = "Italian",
  Dutch = "Dutch",
  Russian = "Russian",
  ChineseSimplified = "Chinese (Simplified)",
  ChineseTraditional = "Chinese (Traditional)",
  Japanese = "Japanese",
  Korean = "Korean",
  Arabic = "Arabic",
  Hindi = "Hindi",
  Bengali = "Bengali",

  // European languages
  Polish = "Polish",
  Czech = "Czech",
  Slovak = "Slovak",
  Hungarian = "Hungarian",
  Romanian = "Romanian",
  Bulgarian = "Bulgarian",
  Greek = "Greek",
  Serbian = "Serbian",
  Croatian = "Croatian",
  Bosnian = "Bosnian",
  Slovenian = "Slovenian",
  Finnish = "Finnish",
  Swedish = "Swedish",
  Danish = "Danish",
  Norwegian = "Norwegian",
  Icelandic = "Icelandic",
  Lithuanian = "Lithuanian",
  Latvian = "Latvian",
  Estonian = "Estonian",
  Maltese = "Maltese",
  Welsh = "Welsh",
  Irish = "Irish",
  ScottishGaelic = "Scottish Gaelic",
  Ukrainian = "Ukrainian",

  // Middle East & Central Asia
  Hebrew = "Hebrew",
  Persian = "Persian",
  Turkish = "Turkish",
  Kurdish = "Kurdish",
  Pashto = "Pashto",
  Dari = "Dari",
  Uzbek = "Uzbek",
  Kazakh = "Kazakh",
  Tajik = "Tajik",
  Turkmen = "Turkmen",
  Azerbaijani = "Azerbaijani",

  // South Asia
  Urdu = "Urdu",
  Tamil = "Tamil",
  Telugu = "Telugu",
  Marathi = "Marathi",
  Punjabi = "Punjabi",
  Gujarati = "Gujarati",
  Malayalam = "Malayalam",
  Kannada = "Kannada",
  Odia = "Odia",
  Sinhala = "Sinhala",
  Nepali = "Nepali",

  // East & Southeast Asia
  Thai = "Thai",
  Vietnamese = "Vietnamese",
  Lao = "Lao",
  Khmer = "Khmer",
  Burmese = "Burmese",
  Tagalog = "Tagalog",
  Javanese = "Javanese",
  Sundanese = "Sundanese",
  Malay = "Malay",
  Mongolian = "Mongolian",

  // African languages
  Swahili = "Swahili",
  Hausa = "Hausa",
  Yoruba = "Yoruba",
  Igbo = "Igbo",
  Amharic = "Amharic",
  Zulu = "Zulu",
  Xhosa = "Xhosa",
  Shona = "Shona",
  Somali = "Somali",

  // Indigenous & rare languages
  Basque = "Basque",
  Catalan = "Catalan",
  Galician = "Galician",
  Quechua = "Quechua",
  Nahuatl = "Nahuatl",
  Hawaiian = "Hawaiian",
  Maori = "Maori",
  Tahitian = "Tahitian",
  Samoan = "Samoan",
}

export const LanguageTypeLabels: Record<LanguageType, string> = {
  [LanguageType.English]: "Английский (English)",
  [LanguageType.Spanish]: "Испанский (Español)",
  [LanguageType.French]: "Французский (Français)",
  [LanguageType.German]: "Немецкий (Deutsch)",
  [LanguageType.Portuguese]: "Португальский (Português)",
  [LanguageType.Italian]: "Итальянский (Italiano)",
  [LanguageType.Dutch]: "Нидерландский (Nederlands)",
  [LanguageType.Russian]: "Русский",
  [LanguageType.ChineseSimplified]: "Китайский упрощённый (中文)",
  [LanguageType.ChineseTraditional]: "Китайский традиционный (漢語)",
  [LanguageType.Japanese]: "Японский (日本語)",
  [LanguageType.Korean]: "Корейский (한국어)",
  [LanguageType.Arabic]: "Арабский (العربية)",
  [LanguageType.Hindi]: "Хинди (हिन्दी)",
  [LanguageType.Bengali]: "Бенгальский (বাংলা)",
  [LanguageType.Polish]: "Польский (Polski)",
  [LanguageType.Czech]: "Чешский (Čeština)",
  [LanguageType.Slovak]: "Словацкий (Slovenčina)",
  [LanguageType.Hungarian]: "Венгерский (Magyar)",
  [LanguageType.Romanian]: "Румынский (Română)",
  [LanguageType.Bulgarian]: "Болгарский (Български)",
  [LanguageType.Greek]: "Греческий (Ελληνικά)",
  [LanguageType.Serbian]: "Сербский (Српски)",
  [LanguageType.Croatian]: "Хорватский (Hrvatski)",
  [LanguageType.Bosnian]: "Боснийский (Bosanski)",
  [LanguageType.Slovenian]: "Словенский (Slovenščina)",
  [LanguageType.Finnish]: "Финский (Suomi)",
  [LanguageType.Swedish]: "Шведский (Svenska)",
  [LanguageType.Danish]: "Датский (Dansk)",
  [LanguageType.Norwegian]: "Норвежский (Norsk)",
  [LanguageType.Icelandic]: "Исландский (Íslenska)",
  [LanguageType.Lithuanian]: "Литовский (Lietuvių)",
  [LanguageType.Latvian]: "Латышский (Latviešu)",
  [LanguageType.Estonian]: "Эстонский (Eesti)",
  [LanguageType.Maltese]: "Мальтийский (Malti)",
  [LanguageType.Welsh]: "Валлийский (Cymraeg)",
  [LanguageType.Irish]: "Ирландский (Gaeilge)",
  [LanguageType.ScottishGaelic]: "Шотландский гэльский (Gàidhlig)",
  [LanguageType.Ukrainian]: "Украинский (Українська)",
  [LanguageType.Hebrew]: "Иврит (עברית)",
  [LanguageType.Persian]: "Персидский/Фарси (فارسی)",
  [LanguageType.Turkish]: "Турецкий (Türkçe)",
  [LanguageType.Kurdish]: "Курдский (Kurdî)",
  [LanguageType.Pashto]: "Пушту (پښتو)",
  [LanguageType.Dari]: "Дари (دری)",
  [LanguageType.Uzbek]: "Узбекский (Oʻzbek)",
  [LanguageType.Kazakh]: "Казахский (Қазақша)",
  [LanguageType.Tajik]: "Таджикский (Тоҷикӣ)",
  [LanguageType.Turkmen]: "Туркменский (Türkmençe)",
  [LanguageType.Azerbaijani]: "Азербайджанский (Azərbaycan dili)",
  [LanguageType.Urdu]: "Урду (اردو)",
  [LanguageType.Tamil]: "Тамильский (தமிழ்)",
  [LanguageType.Telugu]: "Телугу (తెలుగు)",
  [LanguageType.Marathi]: "Маратхи (मराठी)",
  [LanguageType.Punjabi]: "Панджаби (ਪੰਜਾਬੀ)",
  [LanguageType.Gujarati]: "Гуджарати (ગુજરાતી)",
  [LanguageType.Malayalam]: "Малаялам (മലയാളം)",
  [LanguageType.Kannada]: "Каннада (ಕನ್ನಡ)",
  [LanguageType.Odia]: "Одия (ଓଡ଼ିଆ)",
  [LanguageType.Sinhala]: "Сингальский (සිංහල)",
  [LanguageType.Nepali]: "Непальский (नेपाली)",
  [LanguageType.Thai]: "Тайский (ไทย)",
  [LanguageType.Vietnamese]: "Вьетнамский (Tiếng Việt)",
  [LanguageType.Lao]: "Лаосский (ລາວ)",
  [LanguageType.Khmer]: "Кхмерский (ភាសាខ្មែរ)",
  [LanguageType.Burmese]: "Бирманский (မြန်မာစာ)",
  [LanguageType.Tagalog]: "Тагальский (Tagalog)",
  [LanguageType.Javanese]: "Яванский (Basa Jawa)",
  [LanguageType.Sundanese]: "Сунданский (Basa Sunda)",
  [LanguageType.Malay]: "Малайский (Bahasa Melayu)",
  [LanguageType.Mongolian]: "Монгольский (Монгол)",
  [LanguageType.Swahili]: "Суахили (Kiswahili)",
  [LanguageType.Hausa]: "Хауса (Hausa)",
  [LanguageType.Yoruba]: "Йоруба (Yorùbá)",
  [LanguageType.Igbo]: "Игбо (Igbo)",
  [LanguageType.Amharic]: "Амхарский (አማርኛ)",
  [LanguageType.Zulu]: "Зулу (isiZulu)",
  [LanguageType.Xhosa]: "Коса (isiXhosa)",
  [LanguageType.Shona]: "Шона (ChiShona)",
  [LanguageType.Somali]: "Сомалийский (Soomaaliga)",
  [LanguageType.Basque]: "Баскский (Euskara)",
  [LanguageType.Catalan]: "Каталанский (Català)",
  [LanguageType.Galician]: "Галисийский (Galego)",
  [LanguageType.Quechua]: "Кечуа (Runasimi)",
  [LanguageType.Nahuatl]: "Науатль (Nāhuatl)",
  [LanguageType.Hawaiian]: "Гавайский (ʻŌlelo Hawaiʻi)",
  [LanguageType.Maori]: "Маори (Te Reo Māori)",
  [LanguageType.Tahitian]: "Таитянский (Reo Tahiti)",
  [LanguageType.Samoan]: "Самоанский (Gagana Samoa)",
};

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
  Default = "default",
  Casual = "casual",
  Professional = "professional",
  Funny = "funny",
  Educational = "educational",
  Sales_Pitch = "sales_pitch",
}

export const ToneTypeLabels: Record<ToneType, string> = {
  [ToneType.Default]: "По умолчанию",
  [ToneType.Casual]: "Повседневный",
  [ToneType.Professional]: "Деловой",
  [ToneType.Funny]: "Юмористический",
  [ToneType.Educational]: "Обучающий",
  [ToneType.Sales_Pitch]: "Продающая презентация",
};

export enum VerbosityType {
  Concise = "concise",
  Standard = "standard",
  Text_Heavy = "text-heavy",
}

export const VerbosityTypeLabels: Record<VerbosityType, string> = {
  [VerbosityType.Concise]: "Кратко",
  [VerbosityType.Standard]: "Стандартно",
  [VerbosityType.Text_Heavy]: "Много текста",
};
