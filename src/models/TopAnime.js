const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "TopAnimes",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      trailer: {
        type: DataTypes.STRING,
      },
      release: {
        type: DataTypes.DATEONLY,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      description: {
        type: DataTypes.TEXT,
      },
      producers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      popularity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      genres: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
