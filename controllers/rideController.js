import Driver from '../models/Driver.js';
import VehicleType from '../models/VehicleType.js';
import { haversineDistance } from '../utils/haversine.js';

export async function getAvailableRides(req, res) {
    const { pickupLocation, distanceInKm, radiusInKm = 15 } = req.body;

    if (
        !pickupLocation ||
        typeof pickupLocation.lat !== 'number' ||
        typeof pickupLocation.lng !== 'number' ||
        typeof distanceInKm !== 'number'
    ) {
        return res.status(400).json({ error: 'pickupLocation and valid distanceInKm are required' });
    }

    try {
        console.log('📥 Incoming request body:', req.body);

        const vehicleTypes = await VehicleType.find({});
        const drivers = await Driver.find({});

        const nearbyDrivers = drivers.filter(driver => {
            const distance = haversineDistance(pickupLocation, driver.coordinates);
            return distance <= radiusInKm;
        });

        if (nearbyDrivers.length === 0) {
            return res.status(404).json({ message: 'No rides available nearby at this moment' });
        }

        const grouped = {};
        for (const driver of nearbyDrivers) {
            const vehicle = vehicleTypes.find(v => v.name === driver.vehicleType);
            if (!vehicle) continue;

            // ➕ Calculate distance from driver to pickup point
            const distanceToPickup = haversineDistance(driver.coordinates, pickupLocation);

            // ➕ Estimate time to reach pickup point
            const etaToPickupMin = Math.round((distanceToPickup / vehicle.averageSpeed) * 60); // in minutes

            if (!grouped[vehicle.name]) {
                const price = vehicle.baseFare + vehicle.farePerKm * distanceInKm;
                const time = (distanceInKm / vehicle.averageSpeed) * 60;

                grouped[vehicle.name] = {
                    type: vehicle.name,
                    estimatedTimeInMin: Math.round(time),
                    estimatedPrice: `₹${price.toFixed(2)}`,
                    capacity: vehicle.capacity,
                    iconUrl: vehicle.iconUrl,
                    nearbyDrivers: []
                };
            }

            grouped[vehicle.name].nearbyDrivers.push({
                name: driver.name,
                lat: driver.coordinates.lat,
                lng: driver.coordinates.lng,
                estimatedTimeToPickupInMin: etaToPickupMin // 🆕 ETA added here
            });
        }

        res.json(Object.values(grouped));
    } catch (err) {
        console.error('❌ Server error while fetching rides:', err.message);
        res.status(500).json({ error: 'Failed to fetch ride options' });
    }
}
