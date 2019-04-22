const createError = require('http-errors');
const router = require('express').Router();

const Car = require(__basedir + '/models/model').Car;
const Util = require(__basedir + '/Util');


/**
 * Get all cars
 */
router.get('/', (req, res, next) => {
    Car.find((err, cars) => {
        if (err) return next(createError(err));
        const result = {
            items: []
        };

        cars.forEach(car => {
            result['items'].push({name: car.name, available: car.available});
        });

        result['count'] = cars.length;

        return res.status(200).send(result);

    })
});

/**
 * Create a new car
 */
router.post('/', Util.checkName, (req, res, next) => {
    const requestedName = req.body.name;


    const resource = new Car({name: requestedName, available: true});
    resource.save((err) => {
        if (err) {
            if (err.code === 11000) {
                next(createError.BadRequest());
                // if we have an error different than duplicate
            } else {
                next(createError(err));
            }
        }

        next();
    });

}, Util.setHeaderLocation);

/**
 * Get info about a car
 */
router.get('/:id', (req, res, next) => {
    const requestedResource = req.params.id;

    Car.findOne({name: requestedResource}, (err, car) => {
        if (err) return next(createError(err));
        if (!car) return next(createError.NotFound());

        res.status(200).send(car);
    });
});

/**
 * Delete a car
 */
router.delete('/:id', (req, res, next) => {
    const requestedResource = req.params.id;

    Car.remove({name: requestedResource}, (err, obj) => {
        if (err) return next(createError(err));
        if (obj.deletedCount == 0) return next(createError.BadRequest());

        res.status(200).end();
    });

});

/**
 * Update car info
 */
router.put('/:id', Util.checkName, (req, res, next) => {
    const requestedResource = req.params.id;
    const updatedCar = {name: req.body.name};
    if (req.body.available) {
        updatedCar.available = req.body.available;
    }

    Car.updateOne({name: requestedResource}, updatedCar, (err, obj) => {
        if (err) return next(createError(err));
        if (!obj.n) return next(createError.BadRequest());

        next();
    });
}, Util.setHeaderLocation);


module.exports = router;
