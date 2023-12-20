import React, { useState } from 'react';
import axios from 'axios';
import Weather from './Weather'; // Import the Weather component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './CityExplorer.css'; // Assuming this is your CSS file

const CityExplorer = () => {
  const [cityName, setCityName] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [mapImage, setMapImage] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  const exploreCity = async () => {
    try {
      setError(null); // Reset error state

      // Fetch location data from LocationIQ
      const locationResponse = await axios.get(
        'https://us1.locationiq.com/v1/search.php',
        {
          params: {
            key: 'pk.d412df6ffd1d3aaabcda549b559fe485', // Replace with your actual API key
            q: cityName,
            format: 'json',
          },
        }
      );

      const firstLocation = locationResponse.data[0];
      setLocationData({
        displayName: firstLocation.display_name,
        latitude: firstLocation.lat,
        longitude: firstLocation.lon,
      });

      // Construct map image URL
      const mapUrl = `http://maps.locationiq.com/v3/staticmap?key=pk.d412df6ffd1d3aaabcda549b559fe485&center=${firstLocation.lat},${firstLocation.lon}`;
      setMapImage(mapUrl);

      // Fetch weather data from your Express server
      const weatherResponse = await axios.get(`http://localhost:3001/weather`, {
        params: {
          searchQuery: cityName,
          lat: firstLocation.lat,
          lon: firstLocation.lon,
        },
      });

      setWeatherData(weatherResponse.data);
    } catch (error) {
      console.error('Error exploring city:', error);
      // Update error handling for both API calls
      if (error.response) {
        setError({
          statusCode: error.response.status,
          message: error.response.data.error || 'An error occurred.',
        });
      } else {
        setError({
          statusCode: 'Unknown',
          message: 'An unexpected error occurred.',
        });
      }
    }
  };

  return (
    <div className="city-explorer-container">
      <form>
        <label>
          Enter City Name:
          <input type="text" value={cityName} onChange={handleInputChange} />
        </label>
        <button type="button" onClick={exploreCity}>
          Explore!
        </button>
      </form>

      {error && (
        <div className="error-alert">
          <strong>Error:</strong> {error.statusCode} - {error.message}
        </div>
      )}

      {locationData && (
        <div className="location-info">
          <h2>Location Information</h2>
          <p><strong>City:</strong> {locationData.displayName}</p>
          <p><strong>Latitude:</strong> {locationData.latitude}</p>
          <p><strong>Longitude:</strong> {locationData.longitude}</p>
        </div>
      )}

      {mapImage && (
        <div className="map-container">
          <h2>City Map</h2>
          <img src={mapImage} alt="City Map" />
        </div>
      )}

      {weatherData && <Weather forecasts={weatherData} />} {/* Render Weather component */}
    </div>
  );
};

export default CityExplorer;
