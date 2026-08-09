import { NextRequest, NextResponse } from 'next/server';
import { movieService } from '@/src/services/movie.service';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') ?? undefined;
    const search = url.searchParams.get('search') ?? undefined;
    const limitParam = url.searchParams.get('limit');
    const pageParam = url.searchParams.get('page');
    const limit = limitParam ? Number(limitParam) : undefined;
    const page = pageParam ? Number(pageParam) : undefined;

    // Paginated response when `page` is present (admin library).
    if (pageParam !== null && Number.isFinite(page) && page! > 0) {
      const result = await movieService.getMoviesPage({
        type,
        search,
        page,
        limit: Number.isFinite(limit) && limit! > 0 ? limit : 15,
      });
      return NextResponse.json(result, { status: 200 });
    }

    // Flat array for home feed / legacy callers (optional limit only).
    const movies = await movieService.getMovies({
      type,
      search,
      limit: Number.isFinite(limit) && limit! > 0 ? limit : undefined,
    });
    return NextResponse.json(movies, { status: 200 });
  } catch (err) {
    console.error('GET /api/movies error:', err);
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      {
        error: dev ? String(err) : 'Failed to fetch movies',
        details: dev
          ? {
              message: err instanceof Error ? err.message : 'Unknown error',
              type: typeof err,
              stack: err instanceof Error ? err.stack : undefined,
            }
          : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ['title', 'duration', 'type', 'subtitle'];
    for (const key of required) {
      if (!body || typeof body[key] !== 'string' || !body[key].trim()) {
        return NextResponse.json(
          { error: `Missing or invalid field: ${key}` },
          { status: 400 }
        );
      }
    }

    if (body.year && typeof body.year === 'string' && body.year.trim()) {
      body.year = Number(body.year);
    }

    const movie = await movieService.createMovie(body);
    return NextResponse.json(movie, { status: 201 });
  } catch (err) {
    console.error('POST /api/movies error:', err);
    const dev = process.env.NODE_ENV !== 'production';
    return NextResponse.json(
      { error: dev ? String(err) : 'Failed to create movie' },
      { status: 500 }
    );
  }
}
