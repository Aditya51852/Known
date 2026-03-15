const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sqlDb');

// ──────────────────────────────────────────────
// CAR — Main car listing table
// ──────────────────────────────────────────────
const SqlCar = sequelize.define('Car', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  bodyType: {
    type: DataTypes.ENUM('sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'pickup', 'crossover', 'mpv'),
    allowNull: false,
  },
  fuelType: {
    type: DataTypes.ENUM('petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'),
    allowNull: false,
  },
  transmission: {
    type: DataTypes.ENUM('manual', 'automatic', 'cvt', 'dct', 'amt'),
    allowNull: false,
  },
  seating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
  basePrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  year: {
    type: DataTypes.INTEGER,
  },
  mileage: {
    type: DataTypes.STRING(50),       // e.g. "15.5 km/l"
  },
  engineCC: {
    type: DataTypes.INTEGER,           // e.g. 1998
  },
  power: {
    type: DataTypes.STRING(50),       // e.g. "150 bhp"
  },
  torque: {
    type: DataTypes.STRING(50),       // e.g. "250 Nm"
  },
  colors: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('active', 'discontinued', 'upcoming', 'draft'),
    defaultValue: 'active',
  },
}, {
  tableName: 'cars',
  timestamps: true,
  indexes: [
    { fields: ['brand'] },
    { fields: ['bodyType'] },
    { fields: ['fuelType'] },
    { fields: ['transmission'] },
    { fields: ['basePrice'] },
    { fields: ['status'] },
  ],
});

// ──────────────────────────────────────────────
// CAR_VARIANT — Different trims/variants of a car
// ──────────────────────────────────────────────
const SqlCarVariant = sequelize.define('CarVariant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  carId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'cars', key: 'id' },
    onDelete: 'CASCADE',
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,       // e.g. "LXI", "VXI", "ZXI+"
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  fuelType: {
    type: DataTypes.STRING(30),
  },
  transmission: {
    type: DataTypes.STRING(30),
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  tableName: 'car_variants',
  timestamps: true,
});

// ──────────────────────────────────────────────
// CAR_IMAGE — Photos for each car
// ──────────────────────────────────────────────
const SqlCarImage = sequelize.define('CarImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  carId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'cars', key: 'id' },
    onDelete: 'CASCADE',
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  imageType: {
    type: DataTypes.ENUM('exterior', 'interior', 'color', 'feature', 'brochure'),
    defaultValue: 'exterior',
  },
  alt: {
    type: DataTypes.STRING(255),
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'car_images',
  timestamps: true,
});

// ──────────────────────────────────────────────
// CAR_SPEC — Detailed specifications (key-value per category)
// ──────────────────────────────────────────────
const SqlCarSpec = sequelize.define('CarSpec', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  carId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'cars', key: 'id' },
    onDelete: 'CASCADE',
  },
  category: {
    type: DataTypes.ENUM('engine', 'body', 'comfort', 'entertainment', 'features', 'safety', 'warranty'),
    allowNull: false,
  },
  specKey: {
    type: DataTypes.STRING(100),
    allowNull: false,       // e.g. "Displacement", "Boot Space"
  },
  specValue: {
    type: DataTypes.STRING(255),
    allowNull: false,       // e.g. "1197 cc", "268 litres"
  },
}, {
  tableName: 'car_specs',
  timestamps: true,
  indexes: [
    { fields: ['carId', 'category'] },
  ],
});

// ──────────────────────────────────────────────
// CAR_PRICE — Location-based pricing
// ──────────────────────────────────────────────
const SqlCarPrice = sequelize.define('CarPrice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  carId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'cars', key: 'id' },
    onDelete: 'CASCADE',
  },
  variantId: {
    type: DataTypes.UUID,
    references: { model: 'car_variants', key: 'id' },
    onDelete: 'SET NULL',
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING(100),
  },
  exShowroom: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  roadTax: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  insurance: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  registration: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  onRoadPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
}, {
  tableName: 'car_prices',
  timestamps: true,
  indexes: [
    { fields: ['carId', 'city'] },
  ],
});

// ──────────────────────────────────────────────
// Associations
// ──────────────────────────────────────────────
SqlCar.hasMany(SqlCarVariant, { foreignKey: 'carId', as: 'variants' });
SqlCarVariant.belongsTo(SqlCar, { foreignKey: 'carId' });

SqlCar.hasMany(SqlCarImage, { foreignKey: 'carId', as: 'images' });
SqlCarImage.belongsTo(SqlCar, { foreignKey: 'carId' });

SqlCar.hasMany(SqlCarSpec, { foreignKey: 'carId', as: 'specs' });
SqlCarSpec.belongsTo(SqlCar, { foreignKey: 'carId' });

SqlCar.hasMany(SqlCarPrice, { foreignKey: 'carId', as: 'prices' });
SqlCarPrice.belongsTo(SqlCar, { foreignKey: 'carId' });

SqlCarVariant.hasMany(SqlCarPrice, { foreignKey: 'variantId', as: 'prices' });
SqlCarPrice.belongsTo(SqlCarVariant, { foreignKey: 'variantId' });

module.exports = { SqlCar, SqlCarVariant, SqlCarImage, SqlCarSpec, SqlCarPrice };
