require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Anime,
  AnimeFavorite,
  Cart,
  Genres,
  GenresManga,
  Manga,
  MangaFavorites,
  Purchases,
  Reviews,
  Sales,
  TopAnime,
  Users,
  Winning,
} = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Anime.belongsToMany(Genres, { through: "anime_genre" });
Anime.belongsToMany(Purchases, { through: "purchase_anime" });
Anime.hasMany(Cart, { foreignKey: "AnimeId" });
Anime.hasMany(Reviews, { foreignKey: "AnimeId" });

AnimeFavorite.belongsToMany(Users, { through: "anime_favorite" });

Cart.belongsTo(Anime, { foreignKey: "AnimeId" });
Cart.belongsTo(Manga, { foreignKey: "MangaId" });
Cart.belongsTo(Users);

Genres.belongsToMany(Anime, { through: "anime_genre" });

Manga.belongsToMany(Purchases, { through: "purchase_manga" });
Manga.hasMany(Cart, { foreignKey: "MangaId" });
Manga.hasMany(Reviews, { foreignKey: "MangaId" });

MangaFavorites.belongsToMany(Users, { through: "manga_favorite" });

Purchases.belongsToMany(Manga, { through: "purchase_manga" });
Purchases.belongsToMany(Anime, { through: "purchase_anime" });
Purchases.belongsTo(Users, { foreignKey: "userId" });

Reviews.belongsTo(Anime, { foreignKey: "AnimeId" });
Reviews.belongsTo(Manga, { foreignKey: "MangaId" });
Reviews.belongsTo(Users);

Users.belongsToMany(AnimeFavorite, { through: "anime_favorite" });
Users.belongsToMany(MangaFavorites, { through: "manga_favorite" });
Users.hasMany(Purchases);

Users.hasMany(Cart);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
