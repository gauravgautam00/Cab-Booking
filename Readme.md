## Cab Booking Application

### Live Host Link

[Click here to view the live host](https://cab-booking-one.vercel.app)

### Overview

This project is a Cab Booking application built using React for the frontend and Node.js with Express for the backend. It allows users to book cabs for their desired locations and provides features such as checking availability, booking cabs, and managing bookings.

### Features

- **Booking Management:** Users can view their previous bookings and upcoming reservations.
- **Cab Availability Check:** Users can check the availability of cabs for a specific date and time.
- **Dijkstra Algorithm Integration:** The application uses Dijkstra's algorithm to find the shortest path between two locations for efficient cab routing.

### Working

#### To Find Shortest Path

To find the shortest path between two locations, the application utilizes Dijkstra's algorithm. This algorithm calculates the shortest path from a source node to all other nodes in the graph, ensuring efficient cab routing. By integrating Dijkstra's algorithm, users can easily determine the optimal route for their cab bookings, minimizing travel time and cost.

#### Check Availability Function Before Booking

Before allowing users to book a cab, the application checks the availability of cabs for the specified date and time. It first calculates the total fare for the shortest route from the source to the destination. Users are then presented with the available cab types and their respective fares. This feature ensures transparency and helps users make informed decisions before booking a cab.

#### View Upcoming Reservations

Users can access all their upcoming reservations through the application. They can view details such as the date, time, source, destination, and cab type for each booking. Additionally, users have the option to edit their upcoming reservations, allowing them to adjust the time, cab type, source, or destination based on availability and changing requirements.

### Usage

- Check cab availability for your desired date and time.
- Book a cab by providing source, destination, and other required details.
- Manage your bookings by viewing upcoming and previous reservations.
