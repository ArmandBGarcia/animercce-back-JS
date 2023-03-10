const { Genres } = require("../../db");

export const getAllGenres = async (req, res) => {
  try {
    const genresDB = await Genres.findAll();
    res.json({ genresDB });
  } catch (error) {}
};
