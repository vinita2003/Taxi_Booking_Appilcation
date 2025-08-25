import { RiderRideHistory } from "../../../models/rider-ride-history-model.js";

export const storeRideDetailsPickAndDropLocation = async(req, res, next) =>{
    console.log("Storing ride details for pickup and drop location", req.body);
    try{
    const {pickupLongitude, pickupLatitude, dropLongitude, dropLatitude} = req.body;
    const distance = calculateDistance(
      pickupLatitude,
      pickupLongitude,
      dropLatitude,
      dropLongitude
    );

        const fareRates = {
            hatchback: 10, 
      sedan: 15,   
      suv: 20,     
      
        }

     const carTypeAmountDetails = Object.keys(fareRates).map((carType) => ({
      carType,
      amount: Math.round(distance * fareRates[carType]),
    }));

    const rideHistory = await RiderRideHistory.create({
        pickupLongitude, pickupLatitude, dropLongitude, dropLatitude, rider: req.user._id, distance
    })
    console.log("Ride history created:", rideHistory);
    res.status(201).json({
        success : true,
        rideHistory,
        carTypeAmountDetails
        
    })
}catch(error){
    next(error);
}
}

export const storeRideDetailsCarTypeOrDriverRating = async(req, res, next) => {
    try{
        const updateRideDetails = await RiderRideHistory.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new : true}

        );
        if(!updateRideDetails){
            return res.status(404).json({message: 'Ride not found'});
        }
        res.status(200).json({
            success: true,
            updateRideDetails
        })
    }catch(error){
     next(error)
    }
}

export const nominationReverse = async (req, res) => {
console.log("Fetching reverse geocoding data for coordinates:", req.query);
const { lat, lon } = req.query;

try {
 const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;

 const response = await fetch(url);

 if (!response.ok) {
   return res.status(response.status).json({ error: "BigDataCloud request failed" });
 }

 const data = await response.json();
 console.log("BigDataCloud response data:", data);

 // Construct address manually since display_name doesn't exist
 const address = `${data.city || ""}, ${data.principalSubdivision || ""}, ${data.countryName || ""}`;

 res.status(200).json({ success: true, address: address.trim() });
} catch (error) {
 console.error("Error fetching BigDataCloud:", error);
 res.status(500).json({ error: "Internal Server Error" });
}
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;

  const R = 6371; // Radius of earth in KM
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in KM
}



