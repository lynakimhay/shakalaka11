import { NextResponse } from 'next/server';
import { movieService } from '@/src/services/movie.service';

export async function GET() {
  try {
    const stats = await movieService.getMovieStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (err) {
    console.error('GET /api/movies/stats error:', err);
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: dev ? String(err) : 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
