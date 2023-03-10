require("dotenv").config();
import axios from "axios";
const { GenresManga, Manga } = require("../../db");

export const getMangas = async () => {
  const mangasDb = await Manga.findAll();
  if (!mangasDb.length) {
    const url = "https://api.jikan.moe/v4/manga/";
    const url2 = "https://api.jikan.moe/v4/manga?page=2";
    const url3 = "https://api.jikan.moe/v4/manga?page=3";
    const url4 = "https://api.jikan.moe/v4/manga?page=4";

    const response = await axios.get(url);
    const response2 = await axios.get(url2);
    const response3 = await axios.get(url3);
    const response4 = await axios.get(url4);

    //it's necesary call to the API four times to get all the 100 mangas information

    const callOne = response.data.data.map((d) => {
      return {
        title: d.titles
          .filter((d) => d.type === "Default")
          .map((d) => d.title)
          .join(" "),
        image: d.images.jpg.large_image_url,
        score: d.score !== null ? d.score : 5,
        popularity: d.popularity,
        chapters: d.chapters !== null ? d.chapters : 100,
        status: d.status,
        synopsis: d.synopsis,
        genres: d.genres.map((d) => d.name).join(", "),
        price: 4.99,
      };
    });

    const callTwo = response2.data.data.map((d) => {
      return {
        title: d.titles
          .filter((d) => d.type === "Default")
          .map((d) => d.title)
          .join(" "),
        image: d.images.jpg.large_image_url,
        score: d.score !== null ? d.score : 5,
        popularity: d.popularity,
        chapters: d.chapters !== null ? d.chapters : 100,
        status: d.status,
        synopsis: d.synopsis,
        genres: d.genres.map((d) => d.name).join(", "),
        price: 4.99,
      };
    });

    const callTree = response3.data.data.map((d) => {
      return {
        title: d.titles
          .filter((d) => d.type === "Default")
          .map((d) => d.title)
          .join(" "),
        image: d.images.jpg.large_image_url,
        score: d.score !== null ? d.score : 5,
        popularity: d.popularity,
        chapters: d.chapters !== null ? d.chapters : 100,
        status: d.status,
        synopsis: d.synopsis,
        genres: d.genres.map((d) => d.name).join(", "),
        price: 4.99,
      };
    });

    const callFour = response4.data.data.map((d) => {
      return {
        // id: d.mal_id,
        title: d.titles
          .filter((d) => d.type === "Default")
          .map((d) => d.title)
          .join(" "),
        image: d.images.jpg.large_image_url,
        score: d.score !== null ? d.score : 5.0,
        popularity: d.popularity,
        chapters: d.chapters !== null ? d.chapters : 100,
        status: d.status,
        synopsis: d.synopsis,
        genres: d.genres.map((d) => d.name).join(", "),
        price: 4.99,
      };
    });

    let allMangas = [...callOne, ...callTwo, ...callTree, ...callFour];

    //mangas are created into de DB
    const mangas = await Manga.bulkCreate(allMangas);

    return mangas;
  }
  //if the information already exists  whitin the DB then returns it
  else return mangasDb;
};

export const getMangaGenres = async () => {
  const url = "https://api.jikan.moe/v4/genres/manga";
  const genres = GenresManga.findAll();
  //if genres it doesn't exists in DB it serach them and then it create into DB, else return only the DB genres
  if (!genres.length) {
    const response = await axios(url);
    const genre = response.data.data.map((d) => {
      return {
        id: d.mal_id,
        name: d.name,
      };
    });
    await GenresManga.bulkCreate(genre);
    return genre;
  } else return genres;
};

export const getMangaById = async (id) => {
  const url = `https://api.jikan.moe/v4/manga/${id}`;

  if (id.length > 10) {
    const mangaDb = await Manga.findByPk(id);
    return mangaDb;
  } else {
    const response = await axios.get(url);
    const d = response.data.data;
    const manga = {
      id: d.mal_id,
      title: d.titles
        .filter((d) => d.type === "Default")
        .map((d) => d.title)
        .join(" "),
      image: d.images.jpg.large_image_url,
      score: d.score !== null ? d.score : 5,
      popularity: d.popularity,
      chapters: d.chapters !== null ? d.chapters : 100,
      status: d.status,
      synopsis: d.synopsis,
      genres: d.genres.map((d) => d.name).join(", "),
      price: 4.99,
    };
    return manga;
  }
};

//this function brings 25 top mangas
export const getTopManga = async () => {
  const url = "https://api.jikan.moe/v4/top/manga";
  const response = await axios.get(url);
  return response.data.data.map((d) => {
    return {
      id: d.mal_id,
      title: d.titles
        .filter((d) => d.type === "Default")
        .map((d) => d.title)
        .join(" "),
      image: d.images.jpg.large_image_url,
      score: d.score !== null ? d.score : 5,
      popularity: d.popularity,
      chapters: d.chapters !== null ? d.chapters : 100,

      status: d.status,
      synopsis: d.synopsis,
      genres: d.genres.map((d) => d.name).join(", "),
      price: 4.99,
    };
  });
};

//this function brings 10 manga news
export const getMangaNews = async (id = 1) => {
  const url = `https://api.jikan.moe/v4/manga/${id}/news`;
  const response = await axios.get(url);

  const news = response.data.data.map((d) => {
    return {
      title: d.title,
      date: d.date,
      author: d.author_username,
      image: d.images.jpg.image_url,
      comment: d.excerpt,
    };
  });

  return news;
};

export const getMangaRecomendations = async () => {
  const url = "https://api.jikan.moe/v4/manga/1/recommendations";
  const response = await axios.get(url);
  const recomendations = response.data.data.map((d) => {
    return {
      title: d.entry.title,
      image: d.entry.images.jpg.large_image_url,
      votes: d.votes,
    };
  });
  return recomendations;
};

//Brings the first ten mangas with the name
export const searchByName = async (name) => {
  const url = `https://api.jikan.moe/v4/manga?q=${name}&limit=10`;
  // const mangasDb = await db.Manga.findAll({
  //   where: {
  //     name,
  //   },
  // });
  // if (!mangasDb) {
  const response = await axios.get(url);
  const mangas = response.data.data.map((d) => {
    return {
      id: d.mal_id,
      title: d.titles
        .filter((d) => d.type === "Default")
        .map((d) => d.title)
        .join(" "),
      image: d.images.jpg.large_image_url,
      score: d.score !== null ? d.score : 5,
      popularity: d.popularity,
      chapters: d.chapters !== null ? d.chapters : 100,
      status: d.status,
      synopsis: d.synopsis,
      genres: d.genres.map((d) => d.name).join(", "),
      price: 4.99,
    };
  });
  return mangas;
  // } else {
  //   return mangasDb;
  // }
};

export const createManga = async (obj) => {};

export const deleteManga = async (req, res) => {
  try {
    const id = req.params.id;
    await Manga.destroy({
      where: {
        id,
      },
    });
    res.send({ info: "Manga deleted!!" });
  } catch (error) {
    res.send({ error: "Can`t delete Manga" });
  }
};
