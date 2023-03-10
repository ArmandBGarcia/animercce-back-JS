// ruta createAnimeFavorites---http://localhost:3000/animeFavorites----//

const { AnimeFavorites, Users } = require("../../db");

export const createAnimeFavorite = async (obj) => {
  const {
    title,
    image,
    trailer,
    release,
    rating,
    description,
    producers,
    popularity,
    genres,
    price,
    user,
  } = obj;

  const exists = await AnimeFavorites.findOne({ where: { title: title } });
  if (exists) return { Info: "Anime already exists" };

  const fv = await AnimeFavorites.create({
    title,
    image,
    trailer,
    release,
    rating,
    description,
    producers,
    popularity,
    genres,
    price,
  });

  user.forEach(async (element) => {
    const found = await Users.findByPk(element);
    fv?.addUser([found]);
  });

  return fv;
};
export const deleteAnimeFavorites = async (req, res) => {
  try {
    const id = req.params.id;
    await AnimeFavorites.destroy({
      where: {
        id,
      },
    });
    res.send({ info: "AnimeFavorites deleted!!" });
  } catch (error) {
    res.send({ error: "Can`t delete AnimeFavorites" });
  }
};
