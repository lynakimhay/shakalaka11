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

export const movieService = {
  async getMovies(filters?: any) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.search) where.title = { contains: filters.search, mode: "insensitive" };

    const rows = await prisma.movie.findMany({ where, orderBy: { id: "desc" } });
    return rows.map(mapDbMovieToDto);
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