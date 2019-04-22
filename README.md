# mean-app

# Guide
To run the server
```
npm start
```
To run tests
```
npm test
```

# Architecture and API design
Two APIs have been implemented
/cars and /stations

To ensure that we can add a car to a station, I defined sub-resources ``/stations/:stationName/cars``

Each CRUD operation is implemented beside updating cars for ``/stations/:stationName/cars``
