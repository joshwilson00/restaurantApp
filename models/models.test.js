const { Restaurant, Menu, Item, sequelize } = require("./models");
const data = require('./restaurants.json');
describe("Restaurant", () => {
  beforeAll(async () => {
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
  });

  test("should be able to add a restaurant.", async () => {
    await Restaurant.create({
      name: "Ronalds",
      imgURL: "http://some.image.url",
    });
    const restaurant = await Restaurant.findOne({where:{name: 'Ronalds'}});
    expect(restaurant.name).toBe("Ronalds");
  });
  test('Restaurant should have a menu.', async () => {
      const restaurant = await Restaurant.findOne({where: {name: "Cafe Monico"}, include: ["menus"]});
      expect(restaurant.menus).toBeTruthy();
      expect(restaurant.menus[0].title).toBe('Mains');
  });
  test('Menus should have items.', async () => {
    const menus = await Menu.findAll({where: {restaurantid: 7}, include: "items"});
    const items = menus[0].items;
    expect(items[0].name).toBe('Chicken Liver Parfait');
  })
  test('Restaurant should have a menu.', async () => {
    const restaurant = await Restaurant.findOne({where: {name: "Cafe Monico"}, include: [{all: true, nested: true}]});
    console.log(restaurant.menus);
    expect(restaurant.menus).toBeTruthy();
    expect(restaurant.menus[0].items[0].name).toBe('Chicken Liver Parfait');
    expect(restaurant instanceof Restaurant).toBeTruthy();
});
  

});
