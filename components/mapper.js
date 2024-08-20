import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import * as L from 'leaflet';
import ContentMarker from "../components/contentmarker";

export default function Mapper({ channel, itemWidth, privateID, autoPlay, animate, tour, ...props }) 
{  
  const [mapRef, setMapRef] = useState();
  const [currSlide, setCurrSlide] = useState(-1);
  const markerRefs = [];

  //  TODO: to make sure it loads
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    setMapKey(prevKey => prevKey + 1);
  }, []);

  let tileset = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
  let attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href= "https://carto.com/about-carto/">CARTO</a>`;
  //let tileset = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  //let attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  if (channel.tileset?.urlformatstring)
  {
    tileset = channel.tileset.urlformatstring;
    attribution = channel.tileset.attribution;
  }

  useEffect(() => {   
    resetMap();
  }, [mapRef, channel]);

  function resetMap()
  {
    if (!mapRef)
      return;
    
    var locationArray = [];

    mapRef.eachLayer((layer) => {
      if (layer instanceof L.Marker)
      {
        const latlng = layer.getLatLng();
        locationArray.push(latlng);
      };
    });

    if (locationArray.length)
    {
      const bounds = L.latLngBounds(locationArray);
      mapRef.fitBounds(bounds, {padding: [150, 150]});
    }
    else
      mapRef.setView({lat: channel.lat? channel.lat : 40.7736, lng: channel.long ? channel.long : -73.941}, channel.zoom ? channel.zoom : 11.2);
  }

  function gotoSlide(goSlide)
  {
    if (goSlide == markerRefs.length || goSlide == -1)
      resetMap();

    if (goSlide > markerRefs.length)
      goSlide = 0;

    else if (goSlide < -1)
      goSlide = markerRefs.length - 1;

    setCurrSlide(goSlide);
    
    if (!markerRefs[goSlide])
      return;
    
    if (animate)
    {
      markerRefs[goSlide].openPopup();
      mapRef.flyTo(markerRefs[goSlide].getLatLng(), 18);
    }
    else
    {
      mapRef.setView(markerRefs[goSlide].getLatLng(), 18);
      markerRefs[goSlide].openPopup();
    }
  }

  function nextSlide()
  {
    gotoSlide(currSlide+1);
  }

  function prevSlide()
  {
    gotoSlide(currSlide-1);
  }

  return (
    <div {...props}>
      <MapContainer key={mapKey} ref={setMapRef} scrollWheelZoom={true} doubleClickZoom={false} zoomSnap={0.1} zoomControl={false} style={{height: '100%', width: '100%', zIndex: 1}}>
        <TileLayer attribution={attribution} url={tileset} />
        {
          channel.contents && channel.contents.map((contentItem) => {
            return <ContentMarker key={contentItem.id} contentItem={contentItem} itemWidth={itemWidth} privateID={privateID} autoPlay={autoPlay} ref={el => {if (el && markerRefs) markerRefs.push(el)}} />
          })
        }
        { tour  && channel.contents.length ? 
          <span>
            <button style={{position: 'absolute', top: '45%', left:'1%', opacity:'0.5', width: 30, height: 30, zIndex: 1000, border: '1px solid gray'}} onClick={prevSlide}><b>&lt;</b></button>
            <button style={{position: 'absolute', top: '45%', right:'1%', opacity:'0.5', width: 30, height: 30, zIndex: 1000, border: '1px solid gray'}} onClick={nextSlide}><b>&gt;</b></button>
          </span> : ""}
        <ZoomControl position="bottomleft" /> 
      </MapContainer>
    </div>
  );
}

