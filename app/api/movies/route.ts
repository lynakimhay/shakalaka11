import { NextRequest, NextResponse } from 'next/server';
import { movieService } from '@/src/services/movie.service';

export async function GET(req: NextRequest) {
  try {
    console.log('API: Starting GET /api/movies');
    const url = new URL(req.url);
    const type = url.searchParams.get('type') ?? undefined;
    const search = url.searchParams.get('search') ?? undefined;
    
    console.log('API: Filters:', { type, search });

    const movies = await movieService.getMovies({ type, search });
    console.log('API: Movies fetched:', movies?.length || 0);
    return NextResponse.json(movies, { status: 200 });
  } catch (err) {
    console.error('GET /api/movies error:', err);
    console.error('Error type:', typeof err);
    console.error('Error message:', err instanceof Error ? err.message : 'No message');
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack available');
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ 
      error: dev ? String(err) : 'Failed to fetch movies',
      details: dev ? {
        message: err instanceof Error ? err.message : 'Unknown error',
        type: typeof err,
        stack: err instanceof Error ? err.stack : undefined
      } : undefined
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('API: Starting POST /api/movies');
    const body = await req.json();

    // Basic validation
    const required = ['title', 'duration', 'type', 'subtitle'];
    for (const key of required) {
      if (!body || typeof body[key] !== 'string' || !body[key].trim()) {
        return NextResponse.json({ error: `Missing or invalid field: ${key}` }, { status: 400 });
      }
    }

    // Normalize year if provided as string
    if (body.year && typeof body.year === 'string' && body.year.trim()) {
      body.year = Number(body.year);
    }

    const movie = await movieService.createMovie(body);
    return NextResponse.json(movie, { status: 201 });
  } catch (err) {
    console.error('POST /api/movies error:', err);
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ error: dev ? String(err) : 'Failed to create movie' }, { status: 500 });
  }
}