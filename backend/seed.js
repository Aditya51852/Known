require('dotenv').config();
const { connectDB } = require('./db');
const Car = require('./models/Car');

const sampleCars = [
  {
    brand: 'Toyota',
    model: 'Supra GR',
    bodyType: 'Coupe',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seating: 2,
    basePrice: 4500000,
    description: 'The Toyota GR Supra blends a legendary nameplate with modern performance. With its turbocharged inline-6, precise handling, and premium interior, it delivers an engaging drive and everyday usability.',
    images: [
      { url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', type: 'exterior', alt: 'Toyota Supra exterior front' },
      { url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', type: 'exterior', alt: 'Toyota Supra exterior side' },
      { url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop', type: 'interior', alt: 'Toyota Supra interior dashboard' }
    ],
    variants: [
      { name: 'Base', basePrice: 4500000, features: ['LED Headlights', 'Dual Zone AC', 'Touchscreen Infotainment'] },
      { name: 'Premium', basePrice: 5200000, features: ['Premium Audio', 'Leather Seats', 'Sunroof', 'Adaptive Cruise Control'] }
    ],
    details: {
      engine: {
        'Engine Type': 'Inline-6 Turbocharged',
        'Displacement': '2998 cc',
        'Max Power': '340 HP @ 5000-6500 rpm',
        'Max Torque': '500 Nm @ 1600-4500 rpm',
        'Transmission': '8-Speed Automatic',
        'Drivetrain': 'Rear-Wheel Drive'
      },
      body: {
        'Body Type': '2-Door Coupe',
        'Length': '4379 mm',
        'Width': '1854 mm',
        'Height': '1291 mm',
        'Wheelbase': '2470 mm',
        'Ground Clearance': '125 mm',
        'Kerb Weight': '1520 kg'
      },
      comfort: {
        'Seating Capacity': '2 Persons',
        'Seat Material': 'Leather',
        'Front Seats': 'Power Adjustable',
        'Climate Control': 'Dual Zone Automatic',
        'Steering': 'Power Assisted'
      },
      entertainment: {
        'Infotainment Screen': '8.8-inch Touchscreen',
        'Sound System': 'JBL Premium Audio',
        'Speakers': '12 Speakers',
        'Connectivity': 'Apple CarPlay, Android Auto'
      },
      features: {
        'Keyless Entry': 'Yes',
        'Push Button Start': 'Yes',
        'Cruise Control': 'Adaptive',
        'Drive Modes': '4 (Eco, Normal, Sport, Track)'
      },
      safety: {
        'Airbags': '8 Airbags',
        'ABS': 'Yes',
        'EBD': 'Yes',
        'ESP': 'Yes',
        'Traction Control': 'Yes'
      }
    }
  },
  {
    brand: 'Honda',
    model: 'Civic Type R',
    bodyType: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seating: 5,
    basePrice: 3800000,
    description: 'The Honda Civic Type R is a high-performance hot hatch that combines track-ready dynamics with everyday practicality.',
    images: [
      { url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop', type: 'exterior', alt: 'Honda Civic exterior' },
      { url: 'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&h=600&fit=crop', type: 'interior', alt: 'Honda Civic interior' }
    ],
    variants: [
      { name: 'Type R', basePrice: 3800000, features: ['Sport Seats', 'Brembo Brakes', 'Adaptive Suspension', 'Performance Tires'] }
    ],
    details: {
      engine: {
        'Engine Type': 'Inline-4 Turbocharged',
        'Displacement': '1996 cc',
        'Max Power': '320 HP @ 6500 rpm',
        'Max Torque': '400 Nm @ 2500-4500 rpm',
        'Transmission': '6-Speed Manual',
        'Drivetrain': 'Front-Wheel Drive'
      },
      body: {
        'Body Type': '4-Door Sedan',
        'Length': '4560 mm',
        'Width': '1877 mm',
        'Height': '1434 mm',
        'Seating Capacity': '5 Persons'
      },
      comfort: {
        'Seat Material': 'Sport Fabric',
        'Climate Control': 'Automatic',
        'Steering': 'Power Assisted'
      },
      entertainment: {
        'Infotainment Screen': '9-inch Touchscreen',
        'Connectivity': 'Apple CarPlay, Android Auto'
      },
      features: {
        'Keyless Entry': 'Yes',
        'Push Button Start': 'Yes',
        'Drive Modes': '3 (Comfort, Sport, +R)'
      },
      safety: {
        'Airbags': '6 Airbags',
        'ABS': 'Yes',
        'EBD': 'Yes',
        'ESP': 'Yes'
      }
    }
  },
  {
    brand: 'Hyundai',
    model: 'Creta',
    bodyType: 'SUV',
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seating: 5,
    basePrice: 1800000,
    description: 'The Hyundai Creta is a popular compact SUV offering great value, comfort, and features for families.',
    images: [
      { url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', type: 'exterior', alt: 'Hyundai Creta exterior' },
      { url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop', type: 'interior', alt: 'Hyundai Creta interior' }
    ],
    variants: [
      { name: 'E', basePrice: 1800000, features: ['Dual Airbags', 'ABS', 'Rear Parking Sensors'] },
      { name: 'SX', basePrice: 2200000, features: ['Touchscreen', 'Alloy Wheels', 'Leather Seats', 'Sunroof'] }
    ],
    details: {
      engine: {
        'Engine Type': 'Inline-4 Diesel',
        'Displacement': '1493 cc',
        'Max Power': '115 HP @ 4000 rpm',
        'Max Torque': '250 Nm @ 1500-2750 rpm',
        'Transmission': '6-Speed Automatic',
        'Drivetrain': 'Front-Wheel Drive'
      },
      body: {
        'Body Type': 'SUV',
        'Length': '4300 mm',
        'Width': '1790 mm',
        'Height': '1635 mm',
        'Seating Capacity': '5 Persons'
      },
      comfort: {
        'Seat Material': 'Fabric/Leather',
        'Climate Control': 'Automatic',
        'Steering': 'Power Assisted'
      },
      entertainment: {
        'Infotainment Screen': '10.25-inch Touchscreen',
        'Connectivity': 'Apple CarPlay, Android Auto'
      },
      features: {
        'Keyless Entry': 'Yes',
        'Push Button Start': 'Yes',
        'Sunroof': 'Electric (SX variant)'
      },
      safety: {
        'Airbags': '6 Airbags',
        'ABS': 'Yes',
        'EBD': 'Yes',
        'ESP': 'Yes'
      }
    }
  },
  {
    brand: 'Maruti Suzuki',
    model: 'Swift',
    bodyType: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Manual',
    seating: 5,
    basePrice: 600000,
    description: 'The Maruti Suzuki Swift is India\'s favorite hatchback, known for its sporty design and fuel efficiency.',
    images: [
      { url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop', type: 'exterior', alt: 'Maruti Swift exterior' },
      { url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', type: 'interior', alt: 'Maruti Swift interior' }
    ],
    variants: [
      { name: 'LXI', basePrice: 600000, features: ['Power Steering', 'Front Power Windows', 'Central Locking'] },
      { name: 'ZXI', basePrice: 850000, features: ['Touchscreen', 'Alloy Wheels', 'Rear Parking Camera', 'Auto AC'] }
    ],
    details: {
      engine: {
        'Engine Type': 'Inline-4 Petrol',
        'Displacement': '1197 cc',
        'Max Power': '90 HP @ 6000 rpm',
        'Max Torque': '113 Nm @ 4400 rpm',
        'Transmission': '5-Speed Manual',
        'Drivetrain': 'Front-Wheel Drive'
      },
      body: {
        'Body Type': 'Hatchback',
        'Length': '3845 mm',
        'Width': '1735 mm',
        'Height': '1530 mm',
        'Seating Capacity': '5 Persons'
      },
      comfort: {
        'Seat Material': 'Fabric',
        'Climate Control': 'Manual/Auto AC',
        'Steering': 'Power Assisted'
      },
      entertainment: {
        'Infotainment Screen': '7-inch Touchscreen',
        'Connectivity': 'Apple CarPlay, Android Auto'
      },
      features: {
        'Keyless Entry': 'Yes (ZXI)',
        'Push Button Start': 'Yes (ZXI)'
      },
      safety: {
        'Airbags': '2 Airbags',
        'ABS': 'Yes',
        'EBD': 'Yes'
      }
    }
  },
  {
    brand: 'Tata',
    model: 'Nexon EV',
    bodyType: 'SUV',
    fuelType: 'Electric',
    transmission: 'Automatic',
    seating: 5,
    basePrice: 1450000,
    description: 'The Tata Nexon EV is India\'s best-selling electric SUV with impressive range and features.',
    images: [
      { url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=600&fit=crop', type: 'exterior', alt: 'Tata Nexon EV exterior' },
      { url: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop', type: 'interior', alt: 'Tata Nexon EV interior' }
    ],
    variants: [
      { name: 'XZ+', basePrice: 1450000, features: ['Touchscreen', 'Sunroof', 'Wireless Charger', 'Connected Car Tech'] },
      { name: 'XZ+ Lux', basePrice: 1650000, features: ['Ventilated Seats', 'Air Purifier', 'Premium Sound System'] }
    ],
    details: {
      engine: {
        'Engine Type': 'Permanent Magnet Synchronous Motor',
        'Battery Capacity': '30.2 kWh',
        'Max Power': '129 HP',
        'Max Torque': '245 Nm',
        'Transmission': 'Single-Speed Automatic',
        'Drivetrain': 'Front-Wheel Drive',
        'Range': '312 km (ARAI)'
      },
      body: {
        'Body Type': 'SUV',
        'Length': '3993 mm',
        'Width': '1811 mm',
        'Height': '1606 mm',
        'Seating Capacity': '5 Persons'
      },
      comfort: {
        'Seat Material': 'Leatherette',
        'Climate Control': 'Automatic',
        'Steering': 'Power Assisted'
      },
      entertainment: {
        'Infotainment Screen': '7-inch Touchscreen',
        'Connectivity': 'Apple CarPlay, Android Auto, Connected Car'
      },
      features: {
        'Keyless Entry': 'Yes',
        'Push Button Start': 'Yes',
        'Sunroof': 'Electric',
        'Drive Modes': '2 (Drive, Sport)'
      },
      safety: {
        'Airbags': '2 Airbags',
        'ABS': 'Yes',
        'EBD': 'Yes',
        'ESP': 'Yes',
        'Safety Rating': '5 Star Global NCAP'
      }
    }
  }
];

async function seedDatabase() {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing cars
    await Car.deleteMany({});
    console.log('Cleared existing cars');
    
    // Insert sample cars
    const cars = await Car.insertMany(sampleCars);
    console.log(`Inserted ${cars.length} cars successfully`);
    
    cars.forEach(car => {
      console.log(`- ${car.brand} ${car.model} (ID: ${car._id})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
