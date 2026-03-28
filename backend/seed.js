const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('./models/City');
const { Place, Food } = require('./models/Entities');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const sampleCities = [
    { city_id: 'jaipur', city_name: 'Jaipur', name: 'Jaipur', description: 'The Pink City of India is known for its majestic forts, palaces, and vibrant culture.', best_time: 'October to March', air: 'Jaipur International Airport (JAI) connects to major Indian and international cities.', train: 'Jaipur Junction is a well-connected railway station.', road: 'Well connected by NH48 with regular bus services.', image_url: 'images/jaipur/hawaMahal.jpg' },
    { city_id: 'jodhpur', city_name: 'Jodhpur', name: 'Jodhpur', description: 'The Blue City is famous for its stunning Mehrangarh Fort and blue-painted houses.', best_time: 'October to March', air: 'Jodhpur Airport has limited flights; mostly domestic.', train: 'Jodhpur Junction serves major cities.', road: 'Good road network connects to all of Rajasthan.', image_url: 'images/jodhpur/mehrangarh.jpeg' },
    { city_id: 'udaipur', city_name: 'Udaipur', name: 'Udaipur', description: 'The City of Lakes, known for its beautiful palaces and serene lakes.', best_time: 'September to March', air: 'Maharana Pratap Airport connects to major cities.', train: 'Udaipur City railway station is well-connected.', road: 'Excellent connectivity via NH8.', image_url: 'images/udaipur/city_palace.jpg' }
];

const samplePlaces = [
    { place_id: 'p1', city_id: 'jaipur', name: 'Hawa Mahal', type: 'Historical', description: 'Palace of Winds.', image_url: 'images/jaipur/hawaMahal.jpg' },
    { place_id: 'p2', city_id: 'udaipur', name: 'City Palace', type: 'Historical', description: 'Majestic palace complex.', image_url: 'images/udaipur/city_palace.jpg' }
];

const seedDB = async () => {
    try {
        await City.deleteMany();
        await Place.deleteMany();
        await Food.deleteMany();

        await City.insertMany(sampleCities);
        await Place.insertMany(samplePlaces);

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedDB();
