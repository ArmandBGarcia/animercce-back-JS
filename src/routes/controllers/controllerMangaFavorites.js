const { MangaFavorites, Users } = require("../../db");

// ruta createAnimeFavorites---http://localhost:3000/animeFavorites----//

export const createMangaFavorite = async (obj) => {
  const {
    title,
    image,
    trailer,
    score,
    popularity,
    chapters,
    status,
    synopsis,
    genres,
    price,
    user,
  } = obj;

  const exists = await MangaFavorites.findOne({ where: { title: title } });
  if (exists) return { Info: "Manga already exists" };

  const fv = await MangaFavorites.create({
    title,
    image,
    trailer,
    score,
    popularity,
    chapters,
    status,
    synopsis,
    genres,
    price,
  });

  user.forEach(async (element) => {
    const found = await Users.findByPk(element);
    fv?.addUser([found]);
  });

  return fv;
};

export const deleteMangaFavorites = async (req, res) => {
  try {
    const id = req.params.id;
    await MangaFavorites.destroy({
      where: {
        id,
      },
    });
    res.send({ info: "MangaFavorites deleted!!" });
  } catch (error) {
    res.send({ error: "Can`t delete MangaFavorites" });
  }
};
