import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useEffect, useState } from 'react'

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '14px'
}

function MapComponent() {

  const [currentLocation, setCurrentLocation] = useState({
    lat: 12.9716,
    lng: 77.5946
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        console.log(error)
      }
    )
  }, [])

  return (
    <LoadScript googleMapsApiKey="AIzaSyAXmMWT4MEVNQgnRFGIpCJVu7CP_9me6e0">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={15}
      >
        <Marker position={currentLocation} />
      </GoogleMap>
    </LoadScript>
  )
}

export default MapComponent