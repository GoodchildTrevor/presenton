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
  Russian = "Russian",
  English = "English",
  Spanish = "Spanish",
  French = "French",
  German = "German",
  Portuguese = "Portuguese",
  Italian = "Italian",
  Dutch = "Dutch",
  ChineseSimplified = "Chinese (Simplified)",
  ChineseTraditional = "Chinese (Traditional)",
}

export const LanguageTypeLabels: Record<LanguageType, string> = {
  [LanguageType.Russian]: "Русский",
  [LanguageType.English]: "Английский (English)",
  [LanguageType.Spanish]: "Испанский (Español)",
  [LanguageType.French]: "Французский (Français)",
  [LanguageType.German]: "Немецкий (Deutsch)",
  [LanguageType.Portuguese]: "Португальский (Português)",
  [LanguageType.Italian]: "Итальянский (Italiano)",
  [LanguageType.Dutch]: "Нидерландский (Nederlands)",
  [LanguageType.ChineseSimplified]: "Китайский упрощённый (中文)",
  [LanguageType.ChineseTraditional]: "Китайский традиционный (漢語)",
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
