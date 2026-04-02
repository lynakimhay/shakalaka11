import { Movie, HeroContent } from '@/src/types';


export const INITIAL_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Ocean Waves',
    duration: '1h 20m',
    type: 'Documentary',
    subtitle: 'EN',
    videoUrl: 'https://v1.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4',
    posterUrl: 'https://picsum.photos/seed/ocean/400/600',
    year: '2023'
  },
  {
    id: '2',
    title: 'City Lights',
    duration: '2h 15m',
    type: 'Drama',
    subtitle: 'Both',
    videoUrl: 'https://v1.pexels.com/video-files/4434242/4434242-uhd_2560_1440_24fps.mp4',
    posterUrl: 'https://picsum.photos/seed/city/400/600',
    year: '2022'
  },
  {
    id: '3',
    title: 'Mountain Peak',
    duration: '1h 45m',
    type: 'Action',
    subtitle: 'KH',
    videoUrl: 'https://v1.pexels.com/video-files/5198159/5198159-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://picsum.photos/seed/mountain/400/600',
    year: '2024'
  },
  {
    id: '4',
    title: 'Forest Run',
    duration: '1h 30m',
    type: 'Adventure',
    subtitle: 'EN',
    videoUrl: 'https://v1.pexels.com/video-files/3209298/3209298-uhd_2560_1440_25fps.mp4',
    posterUrl: 'https://picsum.photos/seed/forest/400/600',
    year: '2021'
  },
  {
    id: '5',
    title: 'Deep Space',
    duration: '2h 45m',
    type: 'Sci-Fi',
    subtitle: 'EN',
    videoUrl: 'https://v1.pexels.com/video-files/1851190/1851190-uhd_2560_1440_24fps.mp4',
    posterUrl: 'https://picsum.photos/seed/space/400/600',
    year: '2024'
  },
  {
    id: '6',
    title: 'Neon Nights',
    duration: '1h 55m',
    type: 'Thriller',
    subtitle: 'Both',
    videoUrl: 'https://v1.pexels.com/video-files/852421/852421-hd_1920_1080_24fps.mp4',
    posterUrl: 'https://picsum.photos/seed/neon/400/600',
    year: '2023'
  }
];

export const INITIAL_HERO: HeroContent = {
  title: 'Welcome to CineManage!',
  subtitle: 'Explore our free movies and TV, plus discover what\'s trending across your favorite streaming services.',
  imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop',
  buttonText: 'Explore Collection'
};

export const MOVIE_TYPES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Documentary',
  'Adventure',
  'Animation'
];
