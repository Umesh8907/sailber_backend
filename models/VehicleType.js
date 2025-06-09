import mongoose from 'mongoose';

const VehicleTypeSchema = new mongoose.Schema({
    name: { type: String, enum: ['Auto', 'Bike', 'Car'], required: true },
    averageSpeed: { type: Number, required: true },
    baseFare: { type: Number, required: true },
    farePerKm: { type: Number, required: true },
    capacity: { type: String, required: true },
    iconUrl: { type: String, default: null }
});

export default mongoose.model('VehicleType', VehicleTypeSchema);
