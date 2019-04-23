# mean-app

# Guide
To run the server
```
npm install
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

#Remarks
For POST/PUT request, I return a 201 status for created resource and a header location
For GET request where I return a collection like all cars or all stations, i put them into a collection I named “items”


# Limitation and future
Deleting a car implies deleting that the car is associated to a station (This wasn't implemented)

There is no verification in terms of cookies (like CSRF token) or Auth

Error messages don’t give much information at the moment.
