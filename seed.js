import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VehicleType from './models/VehicleType.js';
import Driver from './models/Driver.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Driver.deleteMany({});
        await VehicleType.deleteMany({});

        await VehicleType.insertMany([
            {
                name: 'Auto',
                averageSpeed: 18,
                baseFare: 25,
                farePerKm: 7,
                capacity: '2-3',
                iconUrl: 'https://example.com/icons/auto.png'
            },
            {
                name: 'Bike',
                averageSpeed: 35,
                baseFare: 20,
                farePerKm: 6,
                capacity: '1',
                iconUrl: 'https://example.com/icons/bike.png'
            },
            {
                name: 'Car',
                averageSpeed: 25,
                baseFare: 30,
                farePerKm: 9,
                capacity: '3-4',
                iconUrl: 'https://example.com/icons/car.png'
            }
        ]);
        console.log('✅ Vehicle types seeded');

        await Driver.insertMany([
            { name: 'Driver A1', vehicleType: 'Auto', coordinates: { lat: 12.9345, lng: 77.6100 } },
            { name: 'Driver A2', vehicleType: 'Auto', coordinates: { lat: 12.9348, lng: 77.6110 } },
            { name: 'Driver B1', vehicleType: 'Bike', coordinates: { lat: 12.9350, lng: 77.6123 } },
            { name: 'Driver B2', vehicleType: 'Bike', coordinates: { lat: 12.9342, lng: 77.6130 } },
            { name: 'Driver C1', vehicleType: 'Car', coordinates: { lat: 12.9330, lng: 77.6145 } },
            { name: 'Driver C2', vehicleType: 'Car', coordinates: { lat: 12.9331, lng: 77.6152 } }
        ]);
        console.log('✅ Drivers seeded');

        mongoose.disconnect();
        console.log('🌱 Seeding complete');
    } catch (err) {
        console.error('❌ Error during seeding:', err);
        mongoose.disconnect();
    }
};

seedData();
