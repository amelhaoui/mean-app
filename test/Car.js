let mongoose = require("mongoose");

const Station = require('../models/model').Station;
const Car = require('../models/model').Car;
//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Cars', () => {
    beforeEach((done) => { //Before each test we empty the database
        Car.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test the /GET route
     */
    describe('/GET cars', () => {
        it('it should GET all the cars', (done) => {
            let car = {
                name: 'mercedes'
            };

            chai.request(server)
                .post('/cars')
                .send(car)
                .end();

            chai.request(server)
                .get('/cars')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('items');
                    res.body.should.have.property('count').eql(1);
                    done();
                });
        });
    });

    describe('/POST cars', () => {
        it('it should create a car', (done) => {
            let car = {
                name: 'mercedes'
            };

            chai.request(server)
                .post('/cars')
                .send(car)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.header.should.have.property('location').contains('/cars/mercedes');
                    done();
                });
        });
    });

    describe('/GET /cars/:id', () => {
        it('it should return info about car', (done) => {
            let car = {
                name: 'mercedes'
            };

            chai.request(server)
                .post('/cars')
                .send(car)
                .end();
            chai.request(server)
                .get('/cars/mercedes')
                .end((err, res) => {
                   res.should.have.status(200);
                   res.body.should.have.property('name').eql('mercedes');
                   res.body.should.have.property('available').eql(true);
                   done();
                });
        });
    });

    describe('/PUT cars', () => {
        it('it should update a car', (done) => {
            let car = {
                name: 'mercedes'
            };

            // add a car
            chai.request(server)
                .post('/cars')
                .send(car)
                .end();

            car.name = 'bmw';
            // update car name
            chai.request(server)
                .put('/cars/mercedes')
                .send(car)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.header.should.have.property('location').contains('/cars/bmw');
                    done();
                });
        });
    });

    describe('/DELETE /cars/:id', () => {
        it('it should delete the car', (done) => {
            let car = {
                name: 'mercedes'
            };

            chai.request(server)
                .post('/cars')
                .send(car)
                .end();
            chai.request(server)
                .delete('/cars/mercedes')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});
