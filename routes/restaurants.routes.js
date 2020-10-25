const {Restaurant, sequelize, load, Menu, Item} = require('../models/models');
const router = require('express').Router();


router.get('/', async (req, res)=>{
    const restaurants = await Restaurant.findAll({include: ["menus"]});
    res.render('restaurants', {restaurants});
});

router.post('/', (req, res)=>{
    let error='';
    if (!req.body.name || !req.body.imgURL){
        error = 'Invalid Form!';
    }
    Restaurant.create({
        name: req.body.name,
        image: req.body.imgURL
    }).then(()=>{
        res.redirect('back');
    })
})
router.get('/:id', async (req, res)=>{
    const restaurant = await Restaurant.findByPk(req.params.id, {include: [{all: true, nested: true}]});
    res.render('restaurant', {restaurant});
});
router.get('/:id/delete', (req, res)=>{
    Restaurant.findByPk(req.params.id).then((restaurant)=>{
        restaurant.destroy();
        res.redirect('/');
    })
})
router.get('/:id/edit', (req, res)=>{
    Restaurant.findByPk(req.params.id).then((restaurant)=>{
        res.render('restaurantEdit', {restaurant});
    });
})
router.post('/:id/edit', async (req, res)=>{
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update({name: req.body.name, image: req.body.imgURL});
    res.redirect('/')
})

router.get('/:restaurant_id/menus/:menu_id/edit', async (req, res)=>{
    const restaurant = await Restaurant.findByPk(req.params.restaurant_id);
    const menu = await Menu.findByPk(req.params.menu_id, {include: [{all: true, nested: true}]});
    res.render('menuEdit', {restaurant, menu});
});
router.post('/:restaurant_id/menus/add', async (req, res)=>{
    await Menu.create({title: req.body.title, restaurantId: req.params.restaurant_id});
    res.redirect('back');
})
router.post('/:restaurant_id/menus/:menu_id/edit', async (req, res)=>{
    const menu = await Menu.findByPk(req.params.menu_id);
    await menu.update({title: req.body.title});
    res.redirect(`/restaurants/${req.params.restaurant_id}`);
})
router.get('/:restaurant_id/menus/:menu_id/delete', async (req, res)=>{
    Menu.findByPk(req.params.menu_id).then((menu)=>{
        menu.destroy();
        res.redirect(`/restaurants/${req.params.restaurant_id}`)
    })
})
router.get('/:restaurant_id/menus/:menu_id/items/:item_id/delete', async (req, res)=>{
    await Item.findByPk(req.params.item_id).then((item)=>{
        item.destroy();
        res.redirect('back');
    })
})
router.get('/:restaurant_id/menus/:menu_id/addItem', async (req, res)=>{
    const restaurant = await Restaurant.findByPk(req.params.restaurant_id);
    const menu = await Menu.findByPk(req.params.menu_id, {include: [{all: true, nested: true}]});
    res.render('itemAdd', {restaurant, menu});
})
router.post('/:restaurant_id/menus/:menu_id/addItem', async (req, res)=>{
    const restaurant = await Restaurant.findByPk(req.params.restaurant_id);
    const menu = await Menu.findByPk(req.params.menu_id, {include: [{all: true, nested: true}]});
    await Item.create({name: req.body.name, price: req.body.price, menuId:req.params.menu_id});
    res.redirect(`/restaurants/${req.params.restaurant_id}`);
})
router.get('/:restaurant_id/menus/:menu_id/items/:item_id/edit', async (req, res)=>{
    const item = await Item.findByPk(req.params.item_id);
    res.render('itemEdit', {item})
})
router.post('/:restaurant_id/menus/:menu_id/items/:item_id/edit', async (req, res)=>{
    const item = await Item.findByPk(req.params.item_id);
    await item.update({name: req.body.name, price: req.body.price});
    res.redirect(`/restaurants/${req.params.restaurant_id}`)
})
module.exports = router;