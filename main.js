
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const service = require('./services/restaurantService');
const path = require('path');
const prompt = require('prompt-sync')();
const utility = require('./utilities/configUtility');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

dotenv.config({path:'config.env'});

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use relevant methods when clicked button on form

app.use((req, res, next) => {
  if (req.query._method === 'PUT') {
    req.method = 'PUT';
    delete req.body._method;
  }
  else if (req.query._method === 'DELETE') {
    req.method = 'DELETE';
    delete req.body._method;
  }
  next();
});

// Setup Username and Password
const username = process.env.USERNAME; //gurpreet2512singh; //prompt("Input Username: ");
const password = process.env.PASSWORD; //Hamletss-80544; //prompt("Input Password: ");
utility.updateUserName(username)
var passwordCheck = utility.updatePassword(password);

let mongoUrl= process.env.MONGODB_URI;


if(passwordCheck) {
  mongoUrl = mongoUrl.replace('username', process.env.USERNAME);
  mongoUrl = mongoUrl.replace('password', password);
} else{
  throw Error("Incorrect Username or Password");
}

// Initialize database connection
service.initialize(mongoUrl).then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});



// POST /api/restaurants - Create a new restaurant

/*
app.post('/api/restaurants', async (req, res) => {
  try {
    const restaurant = await service.addNewRestaurant(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error creating restaurant', error });
  }
}); */

// GET /api/restaurants - Get list of restaurants with pagination

/*
app.get('/api/restaurants', async (req, res) => {
  const { page = 1, perPage = 5, borough } = req.query;

  // Validation (extra challenge)
  if (!Number(page) || !Number(perPage)) {
    return res.status(400).json({ message: 'Page and perPage must be numbers' });
  }

  try {
    const restaurants = await service.getAllRestaurants(page, perPage, borough);
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurants', error });
  }
}); */

// GET /api/restaurants/:id - Get a single restaurant by ID

/*
app.get('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const restaurant = await service.getRestaurantById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching restaurant', error });
  }
}); */

// PUT /api/restaurants/:id - Update a restaurant by ID
/*
app.put('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRestaurant = await service.updateRestaurantById(req.body, id);
    if (!updatedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(200).json(updatedRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Error updating restaurant', error });
  }
}); */

// DELETE /api/restaurants/:id - Delete a restaurant by ID

/*
app.delete('/api/restaurants/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRestaurant = await service.deleteRestaurantById(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.status(204).json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting restaurant', error });
  }
}); */

/////////////////////////////////////////////////////// Search Restaurant form
app.get('/restaurants', async (req, res) => {
    const { page = 1, perPage = 5, borough } = req.query;
  
    try {
      console.log('Starting: Search Restaurant');
      res.render('search', { layout:false });
      console.log('Completed: Search Restaurant');
    } catch (error) {
      var message = 'Error Searching Restaurants';
      console.log('Error: Search Restaurant');
      console.log(error);
      //res.render('error', { message, layout:false });
      res.status(500).render('error', { message, layout:false });
    }
  });

  ///////////////////////////////////////////////////// create restaurants
  app.get('/restaurants/create', (req, res) => {
    res.render('createRestaurant');
  });
  
  app.post('/api/restaurants', async (req, res) => {
    try {
      console.log('Starting: Create Restaurant');
      const restaurant = await service.addNewRestaurant(req.body);
      console.log('Completed: Create Restaurant');
      res.redirect('/api/restaurants');
    } catch (error) {
      var message = 'Error creating restaurant';
      console.log('Error: Create Restaurant');
      console.log(error);
      //res.render('error', { message, layout:false });
      res.status(500).render('error', { message, layout:false });
    }
  });

  //////////////////////////////////////////////////// restaurant details

  app.get('/api/restaurants/:id', async (req, res) => {
    try {
      console.log('Starting: Fetch Restaurant by ID');
      const restaurant = await service.getRestaurantById(req.params.id);
      if (!restaurant) {
        console.log('NotFound: Fetch Restaurant by ID');
        var message = 'Restaurant not found';
        //res.render('error', { message, layout:false });
        res.status(404).render('error', { message, layout:false });
      }
      console.log('Completed: Fetch Restaurant by ID');
      res.render('restaurantsDetails', { restaurant , layout: false});
    } catch (error) {
      console.log('Error: Fetch Restaurant by ID');
      console.log(error);
      var message = 'Error Fetching restaurant';
      //res.render('error', { message, layout:false });
      res.status(500).render('error', { message, layout:false });
    }
  });

  ////////////////////////////////////// update restaurant

  app.get('/restaurants/:id/edit', async (req, res) => {
    try {
      const restaurant = await service.getRestaurantById(req.params.id);
      if (!restaurant) {
        var message = 'Restaurant not found';
        //res.render('error', { message, layout:false });
        res.status(404).render('error', { message, layout:false });
      }
      res.render('updateRestaurant', { restaurant , layout: false});
    } catch (error) {
      console.log('Error: Fetch Restaurant by ID');
      console.log(error);
      var message = 'Error Fetching restaurant';
      //res.render('error', { message, layout:false });
      res.status(500).render('error', { message, layout:false });
    }
  });

  app.put('/api/restaurants/:id', async (req, res) => {
    console.log('Starting: Update Restaurant');
    const { id } = req.params;
    try {
      const updatedRestaurant = await service.updateRestaurantById(req.body, id);
      if (!updatedRestaurant) {
        console.log('NotFound: Update Restaurant');
        var message = 'Restaurant not found';
        //res.render('error', { message, layout:false });
        res.status(404).render('error', { message, layout:false });
      }
      console.log('Completed: Update Restaurant');
      res.redirect(`/api/restaurants/${updatedRestaurant._id}`);
    } catch (error) {
      console.log('Error: Update Restaurant');
      console.log(error);
      var message = 'Error Updating restaurant';
      //res.render('error', { message, layout:false });
      res.status(500).render('error', { message, layout:false });
    }
  });
  
  /* app.post('/restaurants/:id', async (req, res) => {
    try {
      const updatedRestaurant = await service.updateRestaurantById(req.body, req.params.id);
      res.redirect(`/restaurants/${updatedRestaurant._id}`);
    } catch (error) {
      res.status(500).send('Error updating restaurant');
    }
  }); */

////////////////////////////////// delete Restaurant

// Route to confirm deletion of a restaurant
app.get('/restaurants/:id/delete', async (req, res) => {
  try {
    const restaurant = await service.getRestaurantById(req.params.id);
    if (!restaurant) {
      console.log('NotFound: Delete Restaurant');
      var message = 'Restaurant not found';
      //res.render('error', { message, layout:false });
      res.status(404).render('error', { message, layout:false });
    }
    // Render the delete confirmation page
    res.render('deleteRestaurant', { restaurant , layout: false});
  } catch (error) {
    console.log('Error: Deleting Restaurant');
    console.log(error);
    var message = 'Error Deleting restaurant';
    //res.render('error', { message, layout:false });
    res.status(500).render('error', { message, layout:false });
  }
});

// Route to handle the actual deletion of the restaurant
app.delete('/api/restaurants/:id', async (req, res) => {
  console.log('Starting: Delete Restaurant');
  try {
    const result = await service.deleteRestaurantById(req.params.id);
    if (result === undefined) {
      console.log('NotFound: Delete Restaurant');
      var message = 'Restaurant not found';
      //res.render('error', { message, layout:false });
      res.status(404).render('error', { message, layout:false });
    }
    console.log('Completed: Delete Restaurant');
    res.redirect('/api/restaurants');  // Redirect to the restaurant list after deletion
  } catch (error) {
    console.log('Error: Delete Restaurant');
    console.log(error);
    var message = 'Error Deleting restaurant';
    //res.render('error', { message, layout:false });
    res.status(500).render('error', { message, layout:false });
  }
});

// POST Endpoint to delete a record //
/*
app.post('/api/restaurants/delete/:id', async (req, res) => {
  try {
    const result = await service.deleteRestaurantById(req.params.id);
    console.log(result)
    if (result === undefined) {
      return res.status(404).send('Restaurant not found');
    }
    res.redirect('/api/restaurants');  // Redirect to the restaurant list after deletion
  } catch (error) {
    console.log(error)
    res.status(500).send('Error deleting restaurant');
  }
}); */

////////////////////// restaurant list 

// Route to list all restaurants with pagination and optional borough filter
app.get('/api/restaurants', [
  
  check('page').isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  check('perPage').isInt({ min: 1 }).withMessage('PerPage must be a positive integer').toInt(),
  check('borough').optional().isString().withMessage('Borough must be a string'),
], async (req, res) => {
  console.log('Starting: Fetch List of Restaurants');

  const errors = validationResult(req);
    if ((req.query.page !== undefined && req.query.page !== undefined && !errors.isEmpty()) || 
    (req.query.page == NaN || req.query.perPage == NaN)) {
        var message = 'Invalid Input';
        res.status(400).render('error', { message, layout:false });
    } else {
  
  const { page = 1, perPage = 5, borough = '' } = req.query;
  
  try {
    
    // Fetch the list of restaurants based on query parameters
    const restaurants = await service.getAllRestaurants(page, perPage, borough);
    console.log('Completed: Fetch List of Restaurants');
    res.render('restaurantList', {
      restaurants,
      page: parseInt(page),      // Current page
      perPage: parseInt(perPage),  // Items per page
      borough,                  // Current borough filter
      layout: false
    });
  } catch (error) {
    console.log('Error: Fetch List of Restaurants');
    console.log(error);
    var message = 'Error Fetching Restaurants';
    //res.render('error', { message, layout:false });
    res.status(500).render('error', { message, layout:false });
  }
}
});

app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found' });
});

app.use((err, req, res, next) => {
  console.log("Error Occurred");
  console.error(err); 

  res.status(500).render('error', { message: err.message });
});

