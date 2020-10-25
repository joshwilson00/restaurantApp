const { Sequelize, DataTypes, Model } = require("sequelize");
const data = require('./restaurants.json');
const path = require('path')
const sequelize = process.env.NODE_ENV === 'test'
    ? new Sequelize('sqlite::memory:', null, null, {dialect: 'sqlite', logging:false})
    : new Sequelize({dialect: 'sqlite', storage: path.join(__dirname, 'data.db')})

class Menu extends Model {}
class Item extends Model {}
class Restaurant extends Model {}

Restaurant.init(
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
  },
  { sequelize, modelName: "restaurant" }
);

Menu.init(
  {
    title: DataTypes.STRING,
  },
  { sequelize, modelName: "menu" }
);

Item.init(
  {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
  },
  { sequelize, modelName: "item" }
);

Restaurant.hasMany(Menu, { as: "menus" });
Menu.belongsTo(Restaurant);
Menu.hasMany(Item, { as: "items" });
Item.belongsTo(Menu);

const load = async () => {
  await sequelize.sync().then(async () => {
    const taskQueue = data.map(async (json_restaurant) => {
      const restaurant = await Restaurant.create({
        name: json_restaurant.name,
        image: json_restaurant.image,
      });
      const menus = await Promise.all(
        json_restaurant.menus.map(async (_menu) => {
          const items = await Promise.all(
            _menu.items.map(({ name, price }) => Item.create({ name, price }))
          );
          const menu = await Menu.create({ title: _menu.title });
          return menu.setItems(items);
        })
      );
      return await restaurant.setMenus(menus);
    });
    return Promise.all(taskQueue);
  });
};


const output = async ()=>{
    await load();
    const restaurants = await Restaurant.findAll({include: [{all:true , nested: true}]});
    restaurants.forEach(restaurant =>{
        console.log(`Restaurant Name: ${restaurant.name}`);
        restaurant.menus.forEach(menu=>{
            console.log(`--Menu: ${menu.title}`);
            menu.items.forEach(item=>{
                console.log(`---Item: ${item.name}`);
                console.log(`----Price: ${item.price}`);
            });
        })
    })
}

//output();
module.exports = { Restaurant, Menu, Item, sequelize, load};
