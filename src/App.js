import { useEffect, useRef, useState } from 'react';
import './App.css';
import * as tt from '@tomtom-international/web-sdk-maps';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const App = () => {
 const mapElement = useRef();
 const [map, setMap] = useState({});
 const [longitude, setLongitude] = useState(-80.2259);
 const [latitude, setLatitude] = useState(26.2173);
 const [address, setAddress] = useState('');
 const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null });

 const handleAddressSelect = async (addressValue) => {
  const results = await geocodeByAddress(addressValue);
  const latLng = await getLatLng(results[0]);
  setAddress(addressValue);
  setCoordinates(latLng);
 };

 useEffect(() => {
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
 }, []);

 return (
  <div className='app'>
   <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleAddressSelect}>
    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
     <div className="input-field">
      <p>Latitude: {coordinates.lat}</p>
      <p>Longitude: {coordinates.lng}</p>
      {/* Input field */}
      <input type="text" {...getInputProps({ placeholder: 'Type address' })} />

      {/* Dropdown list */}
      <div className="dropdown">
       {loading ? <div>... Loading</div> : null}
       {suggestions.map((suggestion) => {
        const style = suggestion.active ? { backgroundColor: "#0D4745", cursor: 'pointer' } : { backgroundColor: "#fff", cursor: 'pointer' };
        return <div {...getSuggestionItemProps(suggestion, { style })}>{suggestion.description}</div>;
       })}
      </div>
     </div>

    )}
   </PlacesAutocomplete>
   <div ref={mapElement} className="map"></div>
  </div>
 );
};

export default App;
