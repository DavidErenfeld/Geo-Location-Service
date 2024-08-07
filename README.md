# Geo-Location Service for Starbucks Locations

## Overview

This server-side application provides geospatial services to determine if a given Starbucks location falls within the specified country's boundaries. It is designed to support the front-end map application by processing geographic coordinates and country codes.

## Technology Stack

- **Node.js**: The runtime environment for the backend service.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features to develop web and mobile applications.
- **Turf.js**: An advanced geospatial processing library used to perform point-in-polygon tests and other geographic computations.
- **Heroku**: A cloud platform service used to deploy and run the server, ensuring the service is available to the front-end application.
- **Docker**: Used to containerize the application, ensuring consistent operation across different computing environments.

## Project Structure

- `services/`: Contains service files like `countryService.js` which handles fetching country boundaries.
- `utils/`: Utility functions such as `geometryUtils.js` for processing geographic data.
- `geojson/`: Contains GeoJSON files which are crucial for the geospatial operations.
- `index.js`: The main entry point for the server application setting up the express server.
