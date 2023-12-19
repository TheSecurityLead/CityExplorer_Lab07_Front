import React, { useState } from 'react';
import axios from 'axios';
import './CityExplorer.css'; // Import your CSS file

const CityExplorer = () => {
  const [cityName, setCityName] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [mapImage, setMapImage] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  const exploreCity = async () => {
    try {
      // Reset error state
      setError(null);

      const response = await axios.get(
        'https://us1.locationiq.com/v1/search.php',
        {
          params: {
            key: 'pk.d412df6ffd1d3aaabcda549b559fe485',
            q: cityName,
            format: 'json',
          },
        }
      );

      const firstLocation = response.data[0];

      setLocationData({
        displayName: firstLocation.display_name,
        latitude: firstLocation.lat,
        longitude: firstLocation.lon,
      });

      // Fetch map image
      // const mapResponse = await axios.get(
      //   'https://maps.locationiq.com/v3/staticmap',
      //   {
      //     params: {
      //       key: 'pk.d412df6ffd1d3aaabcda549b559fe485',
      //       center: `${firstLocation.lat},${firstLocation.lon}`,
      //       zoom: 12,
      //       format: 'png',
      //     },
      //   }
      // );

const mapUrl = `http://maps.locationiq.com/v3/staticmap?key=pk.d412df6ffd1d3aaabcda549b559fe485&center=${firstLocation.lat},${firstLocation.lon}`

      setMapImage(mapUrl); // Set the map image URL
    } catch (error) {
      console.error('Error exploring city:', error);

      // Handle API error
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
          <p>
            <strong>City:</strong> {locationData.displayName}
          </p>
          <p>
            <strong>Latitude:</strong> {locationData.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {locationData.longitude}
          </p>
        </div>
      )}

       {mapImage && ( 
        <div className="map-container">
          <h2>City Map</h2>
          <img src={mapImage} alt="City Map" />
        </div>
      )} 
    </div>
  );
};

export default CityExplorer;
