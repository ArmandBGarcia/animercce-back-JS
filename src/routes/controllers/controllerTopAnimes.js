const { TopAnimes } = require("../../db");

//ruta top animes http://localhost:3000/topAnimes

export const getTopAnimes = async (req, res) => {
  try {
    const topAnimesDB = await TopAnimes.findAll();

    res.json({ topAnimesDB });
  } catch (error) {}
};
