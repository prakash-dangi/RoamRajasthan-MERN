// backend/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

// Import all your Mongoose Models
const City = require('./models/City');
const Place = require('./models/Place');
const Food = require('./models/Food');
const Shopping = require('./models/Shopping');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // 1. Clear all existing data to prevent duplicates
        await City.deleteMany();
        await Place.deleteMany();
        await Food.deleteMany();
        await Shopping.deleteMany();
        console.log('🧹 Cleared all old data.');

        // 2. Insert Cities
        const citiesData = [
            {
                city_id: 'C01',
                city_name: 'Jaipur',
                name: 'The Pink City',
                description: 'Capital of Rajasthan, known for its historic forts, majestic palaces, and vibrant markets.',
                best_time: 'October to March',
                air: 'Jaipur International Airport (Sanganer)',
                train: 'Jaipur Junction',
                road: 'Well connected by NH48',
                map_link: 'https://maps.app.goo.gl/jaipur',
                image_url: 'images/jaipur/hawaMahal.jpg' 
            },
            {
                city_id: 'C02',
                city_name: 'Udaipur',
                name: 'City of Lakes',
                description: 'Known for its stunning lakes, romantic palaces, and rich cultural heritage.',
                best_time: 'September to March',
                air: 'Maharana Pratap Airport',
                train: 'Udaipur City Railway Station',
                road: 'Well connected by NH58',
                map_link: 'https://maps.app.goo.gl/udaipur',
                image_url: 'images/udaipur/udaipur-cover.avif'
            }
        ];

        const createdCities = await City.insertMany(citiesData);
        console.log(`🏙️ Inserted ${createdCities.length} cities.`);

        // Get the ObjectIds for references
        const jaipurId = createdCities[0]._id;
        const udaipurId = createdCities[1]._id;

        // 3. Insert Places
        const placesData = [
            {
                place_id: 'P01',
                city_id: jaipurId, 
                name: 'Hawa Mahal',
                type: 'Palace',
                description: 'The Palace of Winds with a unique honeycomb facade built for royal ladies.',
                timing: '9:00 AM - 5:00 PM',
                entry_fee: '₹50 (Indians), ₹200 (Foreigners)',
                map_link: 'https://maps.app.goo.gl/hawamahal',
                image_url: 'images/jaipur/hawaMahal.jpg'
            },
            {
                place_id: 'P02',
                city_id: jaipurId, 
                name: 'Amer Fort',
                type: 'Fort',
                description: 'A majestic fort situated on a hill, known for its artistic Hindu style elements.',
                timing: '8:00 AM - 5:30 PM',
                entry_fee: '₹100 (Indians), ₹500 (Foreigners)',
                map_link: 'https://maps.app.goo.gl/amerfort',
                image_url: 'images/jaipur/AmerFort.jpg'
            },
            {
                place_id: 'P03',
                city_id: udaipurId, 
                name: 'City Palace',
                type: 'Palace',
                description: 'A magnificent palace complex situated on the banks of Lake Pichola.',
                timing: '9:30 AM - 5:30 PM',
                entry_fee: '₹300 (Adults), ₹100 (Children)',
                map_link: 'https://maps.app.goo.gl/citypalaceudaipur',
                image_url: 'images/udaipur/udaipur-cover.avif'
            }
        ];

        const createdPlaces = await Place.insertMany(placesData);
        console.log(`📍 Inserted ${createdPlaces.length} places.`);

        // 4. Insert Food
        const foodData = [
            {
                food_id: 'F01',
                city_id: jaipurId,
                name: 'Chokhi Dhani Thali',
                specialty: 'Authentic Dal Bati Churma',
                map_link: 'http://googleusercontent.com/maps.google.com/food1',
                description: 'Experience a traditional Rajasthani village dining experience.',
                image_url: 'images/jaipur/CHokhi-DHani.jpg'
            },
            {
                food_id: 'F02',
                city_id: jaipurId,
                name: 'Laxmi Mishthan Bhandar (LMB)',
                specialty: 'Ghewar and Mishri Mawa',
                map_link: 'http://googleusercontent.com/maps.google.com/food2',
                description: 'A historic sweet shop famous for traditional Rajasthani desserts.',
                image_url: 'images/jaipur/LMB.jpg'
            }
        ];

        const createdFood = await Food.insertMany(foodData);
        console.log(`🍲 Inserted ${createdFood.length} food spots.`);

        // 5. Insert Shopping
        const shoppingData = [
            {
                shop_id: 'S01',
                city_id: jaipurId,
                name: 'Bapu Bazaar',
                map_link: 'http://googleusercontent.com/maps.google.com/shop1',
                famous_for: 'Mojari shoes, textiles, and authentic Rajasthani handicrafts.',
                best_time: '11:00 AM - 8:00 PM',
                image_url: 'images/jaipur/bapuBazaar.jpg'
            },
            {
                shop_id: 'S02',
                city_id: udaipurId,
                name: 'Hathi Pol Bazaar',
                map_link: 'http://googleusercontent.com/maps.google.com/shop2',
                famous_for: 'Pichwai and Phad paintings, authentic traditional art.',
                best_time: '10:00 AM - 7:00 PM',
                image_url: 'images/udaipur/udaipur-cover.avif' // Reusing cover as placeholder
            }
        ];

        const createdShopping = await Shopping.insertMany(shoppingData);
        console.log(`🛍️ Inserted ${createdShopping.length} shopping spots.`);

        console.log('🎉 Database fully seeded and ready to go!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding the database:', error);
        process.exit(1); 
    }
};

seedDatabase();