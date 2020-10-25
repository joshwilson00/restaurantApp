require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const app =  express();
const restaurantRoutes = require('./routes/restaurants.routes');
const {Restaurant, sequelize, load} = require('./models/models');

const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/restaurants', restaurantRoutes);
app.get('/', (req, res)=>{
    res.redirect('/restaurants');
    // res.render('home');
})


app.listen(3000, async (err)=>{
    await sequelize.sync();
    await load();
    if (err) throw new Error(err);
    console.log('Listening...');
});
