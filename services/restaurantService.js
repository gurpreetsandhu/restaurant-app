var mongoose = require('mongoose');
var Restaurant = require('../models/restaurant.js');


const initialize = async (connectionString) => {
  try {
    console.log('Initializing DB');
    await mongoose.connect(connectionString)
    console.log('DB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const addNewRestaurant = async (newRestaurant) => {
  console.log('Adding New Restaurant');
  const restaurant = new Restaurant(newRestaurant);
  return await restaurant.save();
};

const getAllRestaurants = async (page, perPage, borough) => {
  const query = borough ? { borough: { $regex: new RegExp(borough, 'i') } } : {};
  console.log('Fetching the Restaurants');
  return await Restaurant.find(query)
    .sort({ restaurant_id: 1 })
    .skip((page - 1) * perPage)
    .limit(perPage);
};

const getRestaurantById = async (id) => {
  console.log('Fetching Restaurant');
  return await Restaurant.findById(id);
};

const updateRestaurantById = async (data, id) => {
  console.log('Updating Restaurant');
  return await Restaurant.findByIdAndUpdate(id, data, { new: true });
};

const deleteRestaurantById = async (id) => {
  console.log('Deleting The Restaurant');
  return await Restaurant.findByIdAndDelete(id);
};

module.exports = {
  initialize,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};