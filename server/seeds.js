const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Destination = require('./models/Destination');
const Review = require('./models/Review');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const destinations = [
  {
    name: 'Bora Bora',
    description: 'Bora Bora is a small South Pacific island northwest of Tahiti in French Polynesia. Surrounded by sand-fringed motus (islets) and a turquoise lagoon protected by a coral reef, it’s known for its scuba diving.',
    location: {
      city: 'Bora Bora',
      country: 'French Polynesia',
      coordinates: { lat: -16.5004, lng: -151.7415 }
    },
    category: 'beach',
    images: [
      'https://images.unsplash.com/photo-1500930287596-c1ecaa373bb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
  },
  {
    name: 'Swiss Alps',
    description: 'The Swiss Alps are the alpine region of Switzerland. Due to their central location within the entire Alpine range, they are also known as the Central Alps.',
    location: {
      city: 'Zermatt',
      country: 'Switzerland',
      coordinates: { lat: 46.0207, lng: 7.7491 }
    },
    category: 'mountain',
    images: [
      'https://images.unsplash.com/photo-1531210483974-4f8c1f33fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
  },
  {
    name: 'Kyoto Temples',
    description: 'Kyoto, once the capital of Japan, is a city on the island of Honshu. It is famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.',
    location: {
      city: 'Kyoto',
      country: 'Japan',
      coordinates: { lat: 35.0116, lng: 135.7681 }
    },
    category: 'heritage',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Destination.deleteMany();
    await Review.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?u=admin'
    });

    const sampleDestinations = destinations.map((d) => {
      return { ...d, createdBy: adminUser._id };
    });

    await Destination.insertMany(sampleDestinations);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
