//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Station = require('../models/model').Station;
const Car = require('../models/model').Car;
const async = require('async');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');
const should = chai.should();
const expect = chai.expect;


chai.use(chaiHttp);
//Our parent block
describe('Station', () => {
    beforeEach((done) => { //Before each test we empty the database
        Station.remove({}, (err) => {
            Car.remove({}, (err) => {
                done();
            });
        });

    });

    describe('integration Stations', () => {
        it('it should create some cars and stations and assign some cars to stations', (done) => {
            let car_id = null;

            async.series([
                    // add two stations
                    (cb) => {
                        chai.request(server)
                            .post('/stations')
                            .send({name: 'paris'})
                            .end(() => {
                                cb()
                            })
                    },
                    (cb) => {
                        chai.request(server)
                            .post('/stations')
                            .send({name: 'london'})
                            .end(() => {
                                cb()
                            })
                    },
                    // add three cars
                    (cb) => {
                        chai.request(server)
                            .post('/cars')
                            .send({name: 'mercedes_95'})
                            .end(() => {
                                cb()
                            })
                    },
                    (cb) => {
                        chai.request(server)
                            .post('/cars')
                            .send({name: 'bmw_33'})
                            .end(() => {
                                cb()
                            })
                    },
                    (cb) => {
                        chai.request(server)
                            .post('/cars')
                            .send({name: 'renault_15'})
                            .end(() => {
                                cb()
                            })
                    },
                    // assign cars to stations
                    (cb) => {
                        chai.request(server)
                            .post('/stations/paris/cars')
                            .send({name: 'mercedes_95'})
                            .end(() => {
                                cb()
                            })
                    },
                    (cb) => {
                        chai.request(server)
                            .post('/stations/paris/cars')
                            .send({name: 'bmw_33'})
                            .end(() => {
                                cb()
                            })
                    },
                    (cb) => {
                        chai.request(server)
                            .post('/stations/london/cars')
                            .send({name: 'renault_15'})
                            .end(() => {
                                cb()
                            })
                    },
                    // get internal id of a car
                    (cb) => {
                        chai.request(server)
                            .get('/cars/mercedes_95')
                            .end((err, res) => {
                                car_id = res.body._id;
                                cb();
                            })
                    },
                    // verify the id exists for the station
                    (cb) => {
                        chai.request(server)
                            .get('/stations/paris/cars')
                            .end((err, res) => {
                                res.should.have.status(200);
                                expect(JSON.stringify(res.body.cars.items)).to.contains(car_id);
                                cb();
                            })
                    }],
                () => {
                    done();
                });
        });
    });

    describe('/GET Stations', () => {
        it('it should create a car', (done) => {
            let station = {
                name: 'paris'
            };

            chai.request(server)
                .post('/stations')
                .send(station)
                .end();

            chai.request(server)
                .get('/stations')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('count').eql(1);
                    done();
                });
        });
    });

    describe('/POST cars', () => {
        it('it should create a car', (done) => {
            let station = {
                name: 'paris'
            };

            chai.request(server)
                .post('/stations')
                .send(station)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.header.should.have.property('location').contains('/stations/paris');
                    done();
                });
        });
    });

    describe('/GET /station/:id', () => {
        it('it should return info about a station', (done) => {
            let station = {
                name: 'paris'
            };

            chai.request(server)
                .post('/stations')
                .send(station)
                .end();
            chai.request(server)
                .get('/stations/paris')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('name').eql('paris');
                    done();
                });
        });
    });

    describe('/PUT cars', () => {
        it('it should update a car', (done) => {
            let station = {
                name: 'paris'
            };

            // add a car
            chai.request(server)
                .post('/stations')
                .send(station)
                .end();

            station.name = 'toulouse';
            // update car name
            chai.request(server)
                .put('/stations/paris')
                .send(station)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.header.should.have.property('location').contains('/stations/toulouse');
                    done();
                });
        });
    });

    describe('/DELETE /stations/:id', () => {
        it('it should delete the station', (done) => {
            let station = {
                name: 'paris'
            };

            chai.request(server)
                .post('/stations')
                .send(station)
                .end();
            chai.request(server)
                .delete('/stations/paris')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

});