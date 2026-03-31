const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('./models/City');
const { Place, Food } = require('./models/Entities');

dotenv.config();

const sampleCities = [
    {
        city_id: 'jaipur',
        city_name: 'Jaipur',
        name: 'Jaipur',
        description: 'The Pink City of India is known for its majestic forts, palaces, and vibrant culture. Built in 1727, Jaipur was the first planned city of India. Its characteristic pink hue, applied in 1876 to welcome the Prince of Wales, gives it its famous moniker.',
        best_time: 'October to March',
        air: 'Jaipur International Airport (JAI) connects to major Indian and international cities including Delhi, Mumbai, and Dubai.',
        train: 'Jaipur Junction is a major railway station well-connected to Delhi, Mumbai, and Jodhpur.',
        road: 'Well connected by NH48 from Delhi (270 km). Regular bus services from all major Rajasthan cities.',
        image_url: 'images/jaipur/hawaMahal.jpg'
    },
    {
        city_id: 'jodhpur',
        city_name: 'Jodhpur',
        name: 'Jodhpur',
        description: 'The Blue City is famous for its stunning Mehrangarh Fort overlooking a sea of indigo-blue houses. Founded in 1459, Jodhpur was a center of trade on the route to Central Asia.',
        best_time: 'October to March',
        air: 'Jodhpur Airport has regular domestic flights; mostly to Delhi and Mumbai.',
        train: 'Jodhpur Junction serves major cities including Delhi, Jaipur, and Jaisalmer.',
        road: 'Good road network via NH62 connects to Jaipur (350 km) and other Rajasthani cities.',
        image_url: 'images/jodhpur/mehrangarh.jpeg'
    },
    {
        city_id: 'udaipur',
        city_name: 'Udaipur',
        name: 'Udaipur',
        description: 'The City of Lakes is known for its beautiful palaces, serene lakes, and romantic atmosphere. Often called the Venice of the East, this picturesque city was founded in 1559 by Maharana Udai Singh II.',
        best_time: 'September to March',
        air: 'Maharana Pratap Airport connects to Delhi, Mumbai, and major Indian cities.',
        train: 'Udaipur City railway station is connected to Delhi via the Chetak Express.',
        road: 'Excellent connectivity via NH8 from Ahmedabad (250 km) and Jaipur (400 km).',
        image_url: 'images/udaipur/city_palace.jpg'
    }
];

const samplePlaces = [
    {
        place_id: 'p1',
        city_id: 'jaipur',
        name: 'Hawa Mahal',
        type: 'Historical Monument',
        description: 'The Palace of Winds is a five-story architectural masterpiece built in 1799 by Maharaja Sawai Pratap Singh.',
        timing: '9:00 AM - 4:30 PM',
        entry_fee: '₹50 (Indian), ₹200 (Foreign)',
        image_url: 'images/jaipur/hawaMahal.jpg'
    },
    {
        place_id: 'p2',
        city_id: 'udaipur',
        name: 'City Palace',
        type: 'Royal Palace',
        description: 'A majestic palace complex on the banks of Lake Pichola, built in 1559 by Maharana Udai Singh II.',
        timing: '9:30 AM - 5:30 PM',
        entry_fee: '₹30 (Indian), ₹250 (Foreign)',
        image_url: 'images/udaipur/city_palace.jpg'
    },
    {
        place_id: 'p3',
        city_id: 'jodhpur',
        name: 'Mehrangarh Fort',
        type: 'Fort',
        description: 'One of the largest forts in India, Mehrangarh stands 400 feet above the city of Jodhpur.',
        timing: '9:00 AM - 5:00 PM',
        entry_fee: '₹100 (Indian), ₹600 (Foreign)',
        image_url: 'images/jodhpur/mehrangarh.jpeg'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        await City.deleteMany();
        await Place.deleteMany();
        await Food.deleteMany();

        await City.insertMany(sampleCities);
        console.log(`✅ Seeded ${sampleCities.length} cities`);

        await Place.insertMany(samplePlaces);
        console.log(`✅ Seeded ${samplePlaces.length} places`);

        console.log('\n🎉 Database Seeded Successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seedDB();
