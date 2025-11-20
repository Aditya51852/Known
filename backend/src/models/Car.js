const mongoose = require('mongoose');

const CarImageSchema = new mongoose.Schema({ url: String, type: { type: String }, alt: String }, { _id: false });
const CarVariantSchema = new mongoose.Schema({ name: String, basePrice: Number, features: [String] }, { _id: false });
const CarDetailsSectionSchema = new mongoose.Schema({}, { strict: false, _id: false });

const CarSchema = new mongoose.Schema(
  {
    brand: { type: String, index: true },
    model: { type: String, index: true },
    bodyType: { type: String, index: true },
    fuelType: { type: String, index: true },
    transmission: { type: String, index: true },
    seating: { type: Number, index: true },
    basePrice: { type: Number, index: true },
    description: { type: String },
    images: [CarImageSchema],
    variants: [CarVariantSchema],
    details: {
      engine: CarDetailsSectionSchema,
      body: CarDetailsSectionSchema,
      comfort: CarDetailsSectionSchema,
      entertainment: CarDetailsSectionSchema,
      features: CarDetailsSectionSchema,
      safety: CarDetailsSectionSchema
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', CarSchema);
