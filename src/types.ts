export type SubtitleLanguage = 'EN' | 'KH' | 'Both';

export interface Movie {
  id: string;
  title: string;
  duration: string;
  type: string;
  subtitle: SubtitleLanguage;
  videoUrl: string;
  posterUrl?: string;
  year?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imagePosition: 'left' | 'right';
  page: 'home' | 'on-demand' | 'discover';
}
