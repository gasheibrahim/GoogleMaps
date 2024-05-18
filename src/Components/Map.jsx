import react, { useEffect } from "react"
import { GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import { useState } from "react"
import db from "../Firebase_setup/firebase"
import { getDatabase, ref, onValue } from "firebase/database";
import { Icon } from "@iconify/react/dist/iconify.js";

const libraries = ['places'];
const mapContainerStyle={
    width: '100vw',
    height: '100vh',
};

const center ={
    lat: -1.9489196023037583,
    lng:  30.092607828989397,
}

const LocationPin = ({ text }) => (
    <div className="pin">
      <Icon icon="mdi:location" className="pin-icon" />
      <p className="pin-text">{text}</p>
    </div>
  );

const Map =()=>{
    const db = getDatabase();
    const {isLoaded, loadError } = useLoadScript({
        id: "google-map-script",
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

  const [ currentLocation, setCurrentLocation ] = useState([
    { lat: -1.9355377074007851, lng: 30.060163829002217, address: "A"},
    { lat: -1.9358808342336546, lng: 30.08024820994666, address: "B"},
    { lat: -1.9489196023037583, lng: 30.092607828989397, address: "C"},
    { lat: -1.9592132952818164, lng: 30.106684061788073, address: "D"},
    { lat: -1.9487480402200394, lng: 30.126596781356923, address: "E"},
  ]);

  const [etaData, setEtaData ]=useState([]);

  const fetchdata=async()=>{
    const starCountRef = ref(db,"location/");
    onValue(starCountRef, (snapshot)=>{
        const data = snapshot.val();
        setCurrentLocation(data);
        console.log(data);
        calculateETA(data);
    });
  };

  useEffect(() => {
    const starCountRef = ref(db, "location/");
    const unsubscribe = onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            const locationsArray = Object.keys(data).map(key => data[key]);
            setCurrentLocation(locationsArray);
            calculateETA(locationsArray);
        }
    });

    return () => unsubscribe();
}, [db]);

  const calculateETA = async (locations) => {
    if(!locations.length) return;
    const origin = `${center.lat},${center.lng}`;
    const destinations = locations.map(loc => `${loc.lat},${loc.lng}`).join('|');
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&key=${apiKey}`);
        const result = await response.json();

        if (result.status === "OK") {
            const etaResults = {};
            result.rows[0].elements.forEach((element, index) => {
                etaResults[locations[index].address] = element.duration.text;
            });
            setEtaData(etaResults);
        } else {
            console.log("Error retrieving ETA:", result.status);
        }
    } catch (error) {
        console.log("Error retrieving ETA:", error);
    }
};



  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;
    return  (
       <div>
         <h2 className="map-h2">Come Visit Us At Our Kigali</h2>
        <GoogleMap
    mapContainerStyle={mapContainerStyle}
    zoom={10}
    center={center}
    options={{
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        fullscreenControl: true,
    }}
>
    {currentLocation ? (
        currentLocation.map((loc, index) => (
            <Marker
                key={index}
                position={{ lat: loc.lat, lng: loc.lng }}
            >
                <InfoWindow>
                    <div>
                        <LocationPin text={loc.address} />
                        <p>ETA: {etaData[loc.address]}</p>
                    </div>
                </InfoWindow>
            </Marker>
        ))
    ) : null}
</GoogleMap>

       </div> 
    )
}

export default Map;