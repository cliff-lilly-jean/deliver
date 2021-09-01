import { useEffect, useRef, useState } from 'react';
import * as tt from '@tomtom-international/web-sdk-maps';
import './App.css';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const App = () => {
 const mapElement = useRef();
 const [map, setMap] = useState({});
 const [longitude, setLongitude] = useState('');
 const [latitude, setLatitude] = useState('');
 const [address, setAddress] = useState('');
 const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

 const handleAddressSelect = async (addressValue) => {
  const results = await geocodeByAddress(addressValue);
  const latLng = await getLatLng(results[0]);

  setAddress(addressValue);
  setCoordinates(latLng);

  // Update the lat & long after a dropdown item is selected
  let newLat = latLng.lat;
  let newLong = latLng.lng;

  changeLatNLong(newLat, newLong);
 };

 let changeLatNLong = (lat, long) => {
  setLatitude(lat);
  setLongitude(long);
 };

 // NAVIGATOR FUNCTION
 let geoLocator = async () => {
  await navigator.geolocation.getCurrentPosition((position) => {
   let latResult = position.coords.latitude;
   let longResult = position.coords.longitude;
   setLatitude(latResult);
   setLongitude(longResult);
  });
 };

 useEffect(() => {

  geoLocator();

  let map = tt.map({
   key: process.env.REACT_APP_TOM_TOM_API_KEY,
   container: mapElement.current,
   stylesVisibility: {
    trafficIncidents: true,
    trafficFlow: true
   },
   center: [longitude, latitude],
   zoom: 14
  });

  setMap(map);

  const element = document.createElement('div');
  element.className = 'marker';

  // POPUP
  const popupOffset = {
   bottom: [0, -25]
  };

  // MARKER
  const addMarker = () => {
   const popup = new tt.Popup({ offset: popupOffset }).setHTML('This is you');
   const marker = new tt.Marker({
    draggable: true,
    element: element
   })
    .setLngLat([longitude, latitude]).addTo(map);
   marker.on('dragend', () => {
    const lngLat = marker.getLngLat();
    setLatitude(lngLat.lat);
    setLongitude(lngLat.lng);
   });
   marker.setPopup(popup).togglePopup(``);
  };

  addMarker();

  return () => map.remove();
 }, [longitude, latitude]);

 return (
  <>{<div className='app'>
   <h1>Where to?</h1>
   <PlacesAutocomplete className="places-autocomplete-container" value={address} onChange={setAddress} onSelect={handleAddressSelect}>
    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
     <div className="input-field">
      {/* Input field */}
      {/* <p>latitude: {coordinates.lat}</p>
      <p>long: {coordinates.lng}</p> */}
      <input type="text" {...getInputProps({ placeholder: 'Type a location' })} />

      {/* Dropdown list */}
      <div className="dropdown">
       {loading ? <div>... Loading</div> : null}
       {suggestions.map((suggestion) => {
        return <div className="dropdown__suggestions" {...getSuggestionItemProps(suggestion)}>{suggestion.description}</div>;
       })}
      </div>
     </div>
    )}
   </PlacesAutocomplete>
   <div ref={mapElement} className="map"></div>
  </div>}
  </>
 );
};

export default App;
