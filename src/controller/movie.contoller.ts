import { movieService } from "@/src/services/movie.service";

export const movieController = {
  async getMovies(query: any) {
    return await movieService.getMovies(query);
  },

  async getMovieById(id: number) {
    return await movieService.getMovieById(id);
  },

  async createMovie(body: any) {
    try {
      console.log('controller.createMovie body:', body);
      const result = await movieService.createMovie(body);
      console.log('controller.createMovie result:', result);
      return result;
    } catch (err) {
      console.error('controller.createMovie error:', err);
      throw err;
    }
  },

  async updateMovie(id: number, body: any) {
    return await movieService.updateMovie(id, body);
  },

  async deleteMovie(id: number) {
    return await movieService.deleteMovie(id);
  },
};