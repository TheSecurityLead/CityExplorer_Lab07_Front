import React from 'react';
import { Card, ListGroup } from 'react-bootstrap'; // Assuming you're using react-bootstrap

const Weather = ({ forecasts }) => {
  return (
    <Card>
      <Card.Header>Weather Forecast</Card.Header>
      <ListGroup variant="flush">
        {forecasts.map((forecast, index) => (
          <ListGroup.Item key={index}>
            <strong>Date:</strong> {forecast.date}<br />
            <strong>Description:</strong> {forecast.description}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default Weather;
