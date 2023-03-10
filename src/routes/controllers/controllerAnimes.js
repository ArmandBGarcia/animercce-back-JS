import axios from "axios";
import db from "..";

// ruta animesDB---http://localhost:3000/animes--//

export const getAllAnimes = async (req, res) => {
  try {
    const animesDB = await db.Animes.findAll();
    res.json({ animesDB });
  } catch (error) {}
};

//ruta name y episodes ---http://localhost:3000/animes/name?name={name}

export const forNameAndEpisodes = async (req, res) => {
  const { name } = req.query;
  try {
    let animeInfo = [];

    const info = await axios.get(`https://api.jikan.moe/v4/anime?q=${name}`);
    info.data.data.map((a) => {
      animeInfo.push({
        id: a.mal_id,
        title: a.title,
        image: a.images.jpg.image_url,
        trailer: a.url,
        type: a.type,
        release: a.string,
        rating: a.score === null ? 2.34 : a.score,
        description: a.synopsis,
        popularity: a.popularity,
        producers: a.producers.map((p) => p.name),
        genres: a.genres.map((g) => g.name),
        price: a.score + 20,
      });
    });
    res.send(animeInfo);
  } catch (error) {}
};

export const getAnimeById = async (req, res) => {
  const { id } = req.params;
  try {
    const animeById = await db.Animes.findOne({ where: { id: id } });
    res.send(animeById);
  } catch (err) {
    throw new Error(err);
  }
};

export const deleteAnime = async (req, res) => {
  try {
    const id = req.params.id;
    await db.Anime.destroy({
      where: {
        id,
      },
    });
    res.send({ info: "Anime deleted!!" });
  } catch (error) {
    res.send({ error: "Can`t delete Anime" });
  }
};
