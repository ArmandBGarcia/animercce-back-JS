const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "Cart",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.FLOAT,
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
