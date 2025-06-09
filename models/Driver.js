import mongoose from 'mongoose';

const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    vehicleType: {
        type: String,
        enum: ['Auto', 'Bike', 'Car'],
        required: true
    },
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }
});

export default mongoose.model('Driver', DriverSchema);
