// src/services/movieService.ts
import prisma from '@/src/lib/prisma';
import { Prisma } from '@prisma/client';

const ALLOWED_FIELDS = [
  "title",
  "duration",
  "type",
  "subtitle",
  "poster",
  "posterUrl",
  "videoUrl",
  "year",
];

function pickAllowed(data: any) {
  const out: any = {};
  for (const k of ALLOWED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(data, k)) {
      out[k] = data[k];
    }
  }
  if (Object.prototype.hasOwnProperty.call(out, "posterUrl")) {
    out.poster = out.posterUrl;
    delete out.posterUrl;
  }
  if (out.poster === undefined) delete out.poster;
  return out;
}

function mapDbMovieToDto(m: any) {
  if (!m) return m;
  const dto: any = {
    ...m,
    posterUrl: m.poster ?? m.posterUrl ?? undefined,
    poster: m.poster ?? undefined, // Keep original poster field
    videoUrl: m.videoUrl ?? undefined,
  };
  if (typeof dto.id === "number") dto.id = String(dto.id);
  if (dto.year !== undefined && dto.year !== null) dto.year = String(dto.year);
  return dto;
}

function buildMovieWhere(filters?: {
  type?: string;
  search?: string;
}) {
  const where: Prisma.MovieWhereInput = {};
  if (filters?.type) where.type = filters.type;
  if (filters?.search) {
    where.title = { contains: filters.search, mode: "insensitive" };
  }
  return where;
}

export const movieService = {
  /** Flat list (home feed). Optional limit only — no pagination meta. */
  async getMovies(filters?: { type?: string; search?: string; limit?: number }) {
    const where = buildMovieWhere(filters);
    const take =
      typeof filters?.limit === "number" && filters.limit > 0
        ? filters.limit
        : undefined;

    const rows = await prisma.movie.findMany({
      where,
      orderBy: { id: "desc" },
      ...(take ? { take } : {}),
    });
    return rows.map(mapDbMovieToDto);
  },

  /** Paginated list for admin — only fetches one page from the DB. */
  async getMoviesPage(filters?: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const where = buildMovieWhere(filters);
    const limit =
      typeof filters?.limit === "number" && filters.limit > 0
        ? Math.min(filters.limit, 100)
        : 15;
    const page =
      typeof filters?.page === "number" && filters.page > 0
        ? Math.floor(filters.page)
        : 1;
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        orderBy: { id: "desc" },
        skip,
        take: limit,
      }),
      prisma.movie.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
      items: rows.map(mapDbMovieToDto),
      total,
      page,
      limit,
      totalPages,
    };
  },

  /** Lightweight aggregates for admin dashboard (no full movie payload). */
  async getMovieStats() {
    const [total, withPoster, withVideo, byTypeRows, recent] =
      await Promise.all([
        prisma.movie.count(),
        prisma.movie.count({
          where: {
            OR: [
              { poster: { not: null } },
              { posterUrl: { not: null } },
            ],
          },
        }),
        prisma.movie.count({
          where: { videoUrl: { not: null } },
        }),
        prisma.movie.groupBy({
          by: ["type"],
          _count: { _all: true },
        }),
        prisma.movie.findMany({
          orderBy: { id: "desc" },
          take: 8,
        }),
      ]);

    const byType = byTypeRows
      .map((r) => ({
        type: r.type,
        count: r._count._all,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      withPoster,
      withVideo,
      missingPoster: Math.max(0, total - withPoster),
      posterPct: total ? Math.round((withPoster / total) * 100) : 0,
      videoPct: total ? Math.round((withVideo / total) * 100) : 0,
      byType,
      maxType: Math.max(...byType.map((t) => t.count), 1),
      topType: byType[0]?.type ?? "—",
      recent: recent.map(mapDbMovieToDto),
    };
  },

  async getMovieById(id: number) {
    const row = await prisma.movie.findUnique({ where: { id: id as any } });
    return mapDbMovieToDto(row);
  },

  async createMovie(data: any) {
    const payload = pickAllowed(data);
    if (payload.year !== undefined && payload.year !== null) payload.year = Number(payload.year);

    const created = await prisma.movie.create({ data: payload });
    return mapDbMovieToDto(created);
  },

  async updateMovie(id: number, data: any) {
    const payload = pickAllowed(data);
    if (payload.year !== undefined && payload.year !== null) payload.year = Number(payload.year);

    try {
      const updated = await prisma.movie.update({ where: { id: id as any }, data: payload });
      return mapDbMovieToDto(updated);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return null;
      }
      throw err;
    }
  },

  async deleteMovie(id: number) {
    try {
      await prisma.movie.delete({ where: { id: id as any } });
      return true;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return false;
      }
      throw err;
    }
  },
};