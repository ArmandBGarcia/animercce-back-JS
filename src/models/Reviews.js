const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Reviews",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      AnimeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Animes",
          key: "id",
        },
      },
      MangaId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "Mangas",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
