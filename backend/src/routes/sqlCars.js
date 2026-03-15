const express = require('express');
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const { SqlCar, SqlCarVariant, SqlCarImage, SqlCarSpec, SqlCarPrice } = require('../models/sql/CarModels');

const router = express.Router();

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/cars/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'car-' + uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  },
});

// Include specs grouped by category
function groupSpecs(specs) {
  const grouped = {};
  for (const s of specs) {
    if (!grouped[s.category]) grouped[s.category] = {};
    grouped[s.category][s.specKey] = s.specValue;
  }
  return grouped;
}

// ──────────────────────────────────────────────
// GET /api/sql-cars — List cars with filters
// ──────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.brand) where.brand = req.query.brand;
    if (req.query.type) where.bodyType = req.query.type;
    if (req.query.fuelType) where.fuelType = req.query.fuelType;
    if (req.query.transmission) where.transmission = req.query.transmission;
    if (req.query.seating) where.seating = +req.query.seating;
    if (req.query.status) where.status = req.query.status;
    if (req.query.priceMin || req.query.priceMax) {
      where.basePrice = {};
      if (req.query.priceMin) where.basePrice[Op.gte] = +req.query.priceMin;
      if (req.query.priceMax) where.basePrice[Op.lte] = +req.query.priceMax;
    }
    if (req.query.q) {
      where[Op.or] = [
        { brand: { [Op.iLike]: `%${req.query.q}%` } },
        { model: { [Op.iLike]: `%${req.query.q}%` } },
        { description: { [Op.iLike]: `%${req.query.q}%` } },
      ];
    }

    const page = +(req.query.page || 1);
    const limit = +(req.query.limit || 50);

    const { count, rows } = await SqlCar.findAndCountAll({
      where,
      include: [
        { model: SqlCarImage, as: 'images', attributes: ['id', 'url', 'imageType', 'alt', 'sortOrder'] },
        { model: SqlCarVariant, as: 'variants', attributes: ['id', 'name', 'price', 'fuelType', 'transmission', 'features'] },
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
      distinct: true,
    });

    res.json({ cars: rows, total: count, page, pages: Math.ceil(count / limit) });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// GET /api/sql-cars/:id — Full car details
// ──────────────────────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id, {
      include: [
        { model: SqlCarImage, as: 'images', order: [['sortOrder', 'ASC']] },
        { model: SqlCarVariant, as: 'variants', include: [{ model: SqlCarPrice, as: 'prices' }] },
        { model: SqlCarSpec, as: 'specs' },
        { model: SqlCarPrice, as: 'prices' },
      ],
    });
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    const result = car.toJSON();
    result.details = groupSpecs(result.specs || []);
    res.json(result);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// POST /api/sql-cars — Create a new car (full upload)
// Body: { brand, model, bodyType, fuelType, transmission, seating, basePrice, description, year,
//         mileage, engineCC, power, torque, colors, variants[], specs[], prices[] }
// ──────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const {
      brand, model, bodyType, fuelType, transmission, seating,
      basePrice, description, year, mileage, engineCC, power,
      torque, colors, status,
      variants = [],
      specs = [],
      prices = [],
    } = req.body;

    if (!brand || !model || !bodyType || !fuelType || !transmission || !basePrice) {
      return res.status(400).json({ error: { message: 'brand, model, bodyType, fuelType, transmission, basePrice are required' } });
    }

    // Create main car record
    const car = await SqlCar.create({
      brand, model, bodyType, fuelType, transmission,
      seating: seating || 5, basePrice, description,
      year, mileage, engineCC, power, torque,
      colors: colors || [], status: status || 'active',
    });

    // Create variants
    if (variants.length > 0) {
      await SqlCarVariant.bulkCreate(
        variants.map(v => ({ ...v, carId: car.id }))
      );
    }

    // Create specs
    if (specs.length > 0) {
      await SqlCarSpec.bulkCreate(
        specs.map(s => ({ ...s, carId: car.id }))
      );
    }

    // Create location prices
    if (prices.length > 0) {
      await SqlCarPrice.bulkCreate(
        prices.map(p => ({ ...p, carId: car.id }))
      );
    }

    // Re-fetch with associations
    const fullCar = await SqlCar.findByPk(car.id, {
      include: [
        { model: SqlCarVariant, as: 'variants' },
        { model: SqlCarSpec, as: 'specs' },
        { model: SqlCarPrice, as: 'prices' },
        { model: SqlCarImage, as: 'images' },
      ],
    });

    res.status(201).json(fullCar);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// PATCH /api/sql-cars/:id — Update car
// ──────────────────────────────────────────────
router.patch('/:id', async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    const allowedFields = ['brand', 'model', 'bodyType', 'fuelType', 'transmission', 'seating',
      'basePrice', 'description', 'year', 'mileage', 'engineCC', 'power', 'torque', 'colors', 'status'];
    const update = {};
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) update[f] = req.body[f];
    }

    await car.update(update);

    // If variants are provided, replace all
    if (req.body.variants) {
      await SqlCarVariant.destroy({ where: { carId: car.id } });
      if (req.body.variants.length > 0) {
        await SqlCarVariant.bulkCreate(req.body.variants.map(v => ({ ...v, carId: car.id })));
      }
    }

    // If specs are provided, replace all
    if (req.body.specs) {
      await SqlCarSpec.destroy({ where: { carId: car.id } });
      if (req.body.specs.length > 0) {
        await SqlCarSpec.bulkCreate(req.body.specs.map(s => ({ ...s, carId: car.id })));
      }
    }

    // If prices are provided, replace all
    if (req.body.prices) {
      await SqlCarPrice.destroy({ where: { carId: car.id } });
      if (req.body.prices.length > 0) {
        await SqlCarPrice.bulkCreate(req.body.prices.map(p => ({ ...p, carId: car.id })));
      }
    }

    const fullCar = await SqlCar.findByPk(car.id, {
      include: [
        { model: SqlCarVariant, as: 'variants' },
        { model: SqlCarSpec, as: 'specs' },
        { model: SqlCarPrice, as: 'prices' },
        { model: SqlCarImage, as: 'images' },
      ],
    });
    res.json(fullCar);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// DELETE /api/sql-cars/:id — Delete car
// ──────────────────────────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });
    await car.destroy(); // cascades to variants, images, specs, prices
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// POST /api/sql-cars/:id/images — Upload images
// ──────────────────────────────────────────────
router.post('/:id/images', upload.array('images', 10), async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    const existingCount = await SqlCarImage.count({ where: { carId: car.id } });

    const images = await SqlCarImage.bulkCreate(
      req.files.map((file, i) => ({
        carId: car.id,
        url: `/uploads/cars/${file.filename}`,
        imageType: req.body.type || 'exterior',
        alt: req.body.alt || `${car.brand} ${car.model}`,
        sortOrder: existingCount + i,
      }))
    );

    res.status(201).json({ success: true, images });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// DELETE /api/sql-cars/:carId/images/:imageId — Delete image
// ──────────────────────────────────────────────
router.delete('/:carId/images/:imageId', async (req, res, next) => {
  try {
    const image = await SqlCarImage.findOne({
      where: { id: req.params.imageId, carId: req.params.carId },
    });
    if (!image) return res.status(404).json({ error: { message: 'Image not found' } });
    await image.destroy();
    res.json({ success: true });
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// POST /api/sql-cars/:id/specs — Add specifications
// Body: [{ category, specKey, specValue }, ...]
// ──────────────────────────────────────────────
router.post('/:id/specs', async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    const specs = Array.isArray(req.body) ? req.body : req.body.specs || [];
    if (specs.length === 0) return res.status(400).json({ error: { message: 'specs array required' } });

    const created = await SqlCarSpec.bulkCreate(
      specs.map(s => ({ ...s, carId: car.id }))
    );
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// POST /api/sql-cars/:id/variants — Add variants
// Body: [{ name, price, fuelType, transmission, features }, ...]
// ──────────────────────────────────────────────
router.post('/:id/variants', async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    const variants = Array.isArray(req.body) ? req.body : req.body.variants || [];
    if (variants.length === 0) return res.status(400).json({ error: { message: 'variants array required' } });

    const created = await SqlCarVariant.bulkCreate(
      variants.map(v => ({ ...v, carId: car.id }))
    );
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// POST /api/sql-cars/:id/prices — Add location prices
// Body: [{ city, state, exShowroom, roadTax, insurance, registration, onRoadPrice, variantId? }, ...]
// ──────────────────────────────────────────────
router.post('/:id/prices', async (req, res, next) => {
  try {
    const car = await SqlCar.findByPk(req.params.id);
    if (!car) return res.status(404).json({ error: { message: 'Car not found' } });

    const prices = Array.isArray(req.body) ? req.body : req.body.prices || [];
    if (prices.length === 0) return res.status(400).json({ error: { message: 'prices array required' } });

    const created = await SqlCarPrice.bulkCreate(
      prices.map(p => ({ ...p, carId: car.id }))
    );
    res.status(201).json(created);
  } catch (e) { next(e); }
});

// ──────────────────────────────────────────────
// GET /api/sql-cars/brands/list — Get distinct brands
// ──────────────────────────────────────────────
router.get('/brands/list', async (req, res, next) => {
  try {
    const brands = await SqlCar.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('brand')), 'brand']],
      where: { status: 'active' },
      order: [['brand', 'ASC']],
      raw: true,
    });
    res.json(brands.map(b => b.brand));
  } catch (e) { next(e); }
});

module.exports = router;
