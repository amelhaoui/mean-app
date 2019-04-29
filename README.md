# mean-app

# Guide
To run the server, you should have mongodb installed and run the deamon beforehand
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

1- /Stations

- POST: /stations
  Req: Body param name
  Res: Location of new resource in response header, property 'location'
- Get: /stations
  Res: List of stations
- Get: /stations/:stationName
  Res: Info about a station
- PUT: /stations/:stationName
  Req: Body param name to represent new name of the station
  Res: Location of updated resource in response header, property 'location'
- DELETE: /stations/:stationName
  Res: status code 200 for OK
- POST: /stations/:stationName/cars
  Req: Body param name of car to associate
  Res: 201 fi associated
- GET: /stations/:stationName/cars
  Res: list of all cars associated to this station
- DELELTE: /stations/:stationName/cars/:carName
  Res: 200 for OK
  
2-  /cars 

- POST: /cars
  Req: Body param name
  Res: Location of new resource in response header, property 'location'
- Get: /cars
  Res: List of stations
- PUT: /cars/:carName
  Req: Body param name to represent new name of the car
  Res: Location of updated resource in response header, property 'location'
- DELETE: /cars/:carName
  Res: status code 200 for OK

To ensure that we can add a car to a station, I defined sub-resources ``/stations/:stationName/cars``

Each CRUD operation is implemented beside updating cars for ``/stations/:stationName/cars``

# Remarks and assumptions

- For POST/PUT requests, we send a body field “name” to either create or update a car/station
- For POST/PUT request, I return a 201 status for created resource and a header location
- For GET request where I return a collection like all cars or all stations, i put them into a collection I named “items”
- I added 2 internal fields in the schema: _cars and _station. These fields contain respectively a list of internal ids of cars and internal id of the station the car belongs to. These information may be shared during dev process but I must add another layer so that in production we dont send them to whoever consume the API



# Limitation and future
Deleting a car implies deleting that the car is associated to a station (This wasn't implemented)

There is no verification in terms of cookies (like CSRF token) or Auth

Error messages don’t give much information at the moment.

In test suite, we don’t test about errors though implemented like adding same car or adding a car to two stations..
