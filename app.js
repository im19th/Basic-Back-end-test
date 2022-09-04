const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3050;
const app = express();
app.use(bodyParser.json());

// MySql configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'restaurant'
});


// Main route
app.get('/', (req, res) => {
  res.send('Hey you, wellcome here!');
});

//CREATE
app.post('/restaurants/add', (req, res) => {
  const sql = 'INSERT INTO restaurants SET ?';
  
  const customerObj = {
    id: req.body.id,
    rating: req.body.rating,
    name: req.body.name,
    site: req.body.site,
    email:req.body.email,
    phone: req.body.phone,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    lat: req.body.lat,
    lng: req.body.lng
  };

  connection.query(sql, customerObj, error => {
    if (error) 
    {
      res.send('Ops, we had a problem, try again, maybe changing the id or some data.\n We apologize for the inconveniences');
      throw error;
    }
    res.send('New restaurant was created!');
  });
});

//READ
app.get('/restaurants/ShowRestaurants', (req, res) => {
  const sql = 'SELECT * FROM restaurants';

  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.jsonp(results);
    } else {
      res.send('Oh no, there are not restaurants here');
    }
  });
});

app.get('/restaurants/ShowRestaurants/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM restaurants WHERE id = ${id}`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send('There are not restaurant with that id!');
    }
  });
});

app.get('/restaurants/stadistics?', (req, res) => {
  const sql = `SELECT * FROM restaurants`;
  connection.query(sql, (error, result) => {
    if (error){
      res.send('Ops, we had a problem');
      throw error;
    } 
    radian = function (x) {return x * Math.PI / 180;}
    var RestInside = [];
    if (result.length > 0) {
      var R = 6378.137;  //Radio de la tierra en km
      result.forEach(e => {
        var lat2 = parseFloat(e.lat);
        var lng2 = parseFloat(e.lng);
        var dLat = radian(lat2 - parseFloat(req.query.latitude));
        var dLong = radian(lng2 - parseFloat(req.query.longitude));
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(radian(parseFloat(req.query.latitude))) * Math.cos(radian(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; 
        if((parseFloat(req.query.radius))/1000>=d){
          e.distanciaEnKM=parseFloat(d.toFixed(2));
          RestInside.push(e)
        }
      });
      res.send(RestInside);
    } else {
      res.send('There are not restaurant with that id!');
    }
  });
});

//UPDATE
app.put('/restaurants/update/:id', (req, res) => {
  const { id } = req.params;
  const { rating,name,site,email,phone,street,city,state,lat,lng } = req.body;

  const sql = `UPDATE restaurants SET 
  rating = IFNULL('${rating}',rating), 
  name = IFNULL('${name}',name), 
  site = IFNULL('${site}',site), 
  email = IFNULL('${email}',email), 
  phone = IFNULL('${phone}',phone), 
  street = IFNULL('${street}',street), 
  city = IFNULL('${city}',city), 
  state = IFNULL('${state}',state), 
  lat = IFNULL('${lat}',lat), 
  lng = IFNULL('${lng}',lng)
  WHERE id =${id}`;

  connection.query(sql, error => {
    if(error)
    {
      res.send('Ops, we had a problem, try again, maybe changing some data.\n We apologize for the inconveniences');
      throw error;
    }
    res.send('Restaurant updated!');
  });
});

//DELETE
app.delete('/restaurants/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM restaurants WHERE id= ${id}`;

  connection.query(sql, error => {
    if (error)
    {
      res.send('Ops, we had a problem, try again, Make sure you send the ID correctly.\n We apologize for the inconveniences');
      throw error;
    }
    res.send('The restaurant was successfully removed');
  });
});


connection.connect(error => {if (error) throw error;});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
