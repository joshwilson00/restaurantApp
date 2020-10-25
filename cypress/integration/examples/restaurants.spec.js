const { expect } = require("chai");

describe('Restaurants', ()=>{
    it('should load 8 restaurants.', ()=>{
        cy.visit('http://localhost:3000');
        cy.get('section')
            .find('a')
            .should(($a) =>{
                expect($a).to.have.length(8);
            });
    });
    it('All restaurants should have a hyperlink', ()=>{
        cy.get('a')
            .should('have.attr', 'href');
    });
    it('should be able to add a restaurant', ()=>{
        cy.get('input[name="name"]').type('New Restaurant');
        cy.get('input[name="imgURL"]').type('https://media.istockphoto.com/photos/two-empty-wine-glasses-sitting-in-a-restaurant-on-a-warm-sunny-picture-id1018141890?k=6&m=1018141890&s=612x612&w=0&h=_OmlYECOxfO-VHY3eIzuJSPRXUXiFbeHHp3RUZGQoSQ=');
        cy.get('button').click();
        cy.get('a')
            .find('article').last().contains('New Restaurant');
    });
    it('Last card should be a form to create a new restaurant.', ()=>{
        cy.get('section')
            .find('article')
            .last()
            .contains('Restaurant Name:');
    });
    it('Clicking on a restaurant card takes you to the restaurants page', ()=>{
        cy.get('section')
            .find('article')
            .first().click();
        cy.url().should('include', '/restaurants/1');
    });
    it('Should be able to edit the name of the restaurant.', ()=>{
        cy.get('h1')
            .find('a').first().click();
        cy.get('input[name="name"]').type(" V2");
        cy.get('button').click()
        cy.get('a')
            .find('article').first().contains('Bayroot V2');
    });
    it('Should be able to delete a restaurant.', ()=>{
        cy.get('section')
        .find('article')
        .first().click();
        cy.get('h1')
            .find('a').last().click();
        cy.get('section')
            .find('a')
            .should(($a) =>{
                expect($a).to.have.length(8)});

    })
});

describe('Menus', () => {
    it('Clicking on a menu should take you to the menus edit page.', ()=>{
        cy.visit('http://localhost:3000/restaurants/2');
        cy.get('section')
            .find('article').first().click();
        cy.url().should('include', '/restaurants/2/menus/3');
        })
})
