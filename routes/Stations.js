const createError = require('http-errors');
const router = require('express').Router();

const Station = require(__basedir + '/models/model').Station;
const Car = require(__basedir + '/models/model').Car;
const Util = require(__basedir + '/Util');

/**
 * Get all stations name
 * GET /stations
 */
router.get('/', (req, res, next) => {
    Station.find((err, stations) => {
        if (err) return next(createError(err));
        const result = {
            items: []
        };

        stations.forEach(station => {
            result['items'].push(station.name);
        });

        result['count'] = stations.length;

        return res.status(200).send(result);
    })
});

/**
 * Create a new station
 * POST /stations
 */
router.post('/', Util.checkName, (req, res, next) => {
    const requestedName = req.body.name;

    const resource = new Station({name: requestedName});
    resource.save((err) => {
        if (err) {
            if (err.code === 11000) {
                return next(createError.BadRequest());
            } else {
                // if we have an error different than duplicate
                return next(createError(err));
            }
        }

        next();
    });

}, Util.setHeaderLocation);

/**
 * Get info about station
 * GET /stations/:id
 */
router.get('/:id', (req, res, next) => {
    const requestedResource = req.params.id;

    Station.findOne({name: requestedResource}, (err, station) => {
        if (err) return next(createError(err));
        if (!station) return next(createError.NotFound());

        res.status(200).send(station);
    });
});

/**
 * Delete a station
 * DELETE /stations/:id
 */
router.delete('/:id', (req, res, next) => {
    const requestedResource = req.params.id;

    // we need to make all cars in this station to null
    Station.findOne({name: requestedResource}, (err, station) => {
        if (err) return next(createError(err));
        if (!station) return next(createError.NotFound());

    }).populate('_cars').exec((err, cars) => {
        if (!cars) return;

        cars = cars._cars;
        cars.forEach((car) => {
            car._station = null;
            car.save((err) => {
                if (err) return next(createError(err));
                // not async
            });
        });

        Station.remove({name: requestedResource}, (err, obj) => {
            if (err) return next(createError(err));
            if (obj.deletedCount == 0) return next(createError.BadRequest());


            res.status(200).end();
        });
    });

});

/**
 * Update a station (name)
 * PUT /stations/:id
 */
router.put('/:id', Util.checkName, (req, res, next) => {
    const requestedResource = req.params.id;
    const newName = req.body.name;

    Station.updateOne({name: requestedResource}, {name: newName}, (err, obj) => {
        if (err) return next(createError(err));
        if (!obj.n) return next(createError.BadRequest());

        next();
    });
}, Util.setHeaderLocation);

/**
 * Associate a car to a station
 * POST /stations/:id/cars
 */
router.post('/:id/cars', Util.checkName, (req, res, next) => {
    const amendCar = req.body.name;

    Station.findOne({name: req.params.id}, (err, station) => {
        if (err) return next(createError(err));
        if (!station) return next(createError.NotFound());

        Car.findOne({name: amendCar}, (err, car) => {
            if (err) return next(createError(err));
            if (!car) return next(createError.NotFound());

            if (car._station) {
                next(createError.BadRequest());
            }

            // not affiliated yet
            car._station = station._id;
            car.save((err) => {
                if (err) return next(createError(err));

                station._cars.push(car._id);
                station.save((err) => {
                    if (err) return next(createError(err));

                    return res.status(201).end();
                })
            })
        });
    });
});

/**
 * Remove a car from a station
 * DELETE /stations/:id/cars/:carName
 */
router.delete('/:id/cars/:carName', (req, res, next) => {
    const carName = req.params.carName;

    Station.findOne({name: req.params.id}, (err, station) => {
        if (err) return next(createError(err));
        if (!station) return next(createError.NotFound());

        Car.findOne({name: carName}, (err, car) => {
            if (err) return next(createError(err));
            if (!car) return next(createError.NotFound());

            if (!car._station) {
                // Not affiliated
                next(createError.BadRequest());
            }

            car._station = null;
            car.save((err) => {
                if (err) return next(createError(err));

                const updatedCars = [];
                station._cars.forEach((element) => {
                    if (String(element) !== String(car._id)) {
                        updatedCars.push(element);
                    }
                });

                delete station._cars;
                station._cars = updatedCars;

                station.save((err) => {
                    if (err) return next(createError(err));

                    return res.status(200).end();
                })
            })
        });
    });
});

/**
 * Get all cars in a particular station
 * GET /stations/:id/cars
 */
router.get('/:id/cars', (req, res, next) => {
    const stationName = req.params.id;

    Station.findOne({name: stationName}, (err, station) => {
        if (err) return next(createError(err));
        if (!station) return next(createError.NotFound());

    }).populate('_cars').exec((err, cars) => {
        if (!cars) return;

        cars = cars._cars;
        const result = {
            name: stationName,
            cars: {items: []}
        };

        cars.forEach((car) =>{
            result.cars.items.push(car);
        });
        result.cars['count'] = cars.length;

        res.send(result);
    });
});

module.exports = router;
