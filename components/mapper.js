import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { Input } from "reactstrap";
import { FaUndo } from 'react-icons/fa';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import * as L from 'leaflet';
import updateChannel from "../hooks/updatechannel";
import ContentMarker from "./contentmarker";
import getTagURL from "../hooks/gettagurl";

const defaultInterval = 3000;

export default function Mapper({ channel, itemWidth, privateID, tilesets, jwt, animate, tour, legend, isPlaying, ...props }) 
{  
  const [mapRef, setMapRef] = useState();
  const [currSlide, setCurrSlide] = useState(-1);
  //  TODO: to make sure it loads
  const [mapKey, setMapKey] = useState(0);
  const router = useRouter();

  const markerRefs = [];

  useEffect(() => {
    setMapKey(prevKey => prevKey + 1);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.L = L;
    }
  }, []);

  useEffect(() => {   
    resetMap();
  }, [mapRef, channel.contents]);

  let tileset = tilesets;
  let attribution = `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href= "https://carto.com/about-carto/">CARTO</a>`;
  //let tileset = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  //let attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  if (channel.tileset?.urlformatstring)
  {
    tileset = channel.tileset.urlformatstring;
    attribution = channel.tileset.attribution;
  }
  else if (tilesets && tilesets.length)
  {
    tileset = tilesets[0].urlformatstring;
    attribution = tilesets[0].attribution;
  }

  function resetMap()
  {
    if (!mapRef)
      return;
    
    markerRefs.map((marker)=>marker.closePopup());
    const locationArray = markerRefs.map(marker => marker.getLatLng());

    if (locationArray.length)
    {
      const bounds = L.latLngBounds(locationArray);
      mapRef.fitBounds(bounds, {padding: [150, 150]});
    }
    else
      mapRef.setView({lat: channel.lat? channel.lat : 40.7736, lng: channel.long ? channel.long : -73.941}, channel.zoom ? channel.zoom : 11.2);
  }

  const gotoSlide = useCallback((goSlide) => {
    if (goSlide == markerRefs.length || goSlide == -1)
      resetMap();

    if (goSlide > markerRefs.length - 1)
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
  }, [markerRefs, mapRef, animate, resetMap]);

  useEffect(() => {
    let tourTimer;
    if (isPlaying && tour && channel.contents.length > 0) {
      tourTimer = setInterval(() => {
        gotoSlide((currSlide + 1) % channel.contents.length);
      }, channel.interval ? channel.interval : defaultInterval);
    }
    return () => {
      if (tourTimer) clearInterval(tourTimer);
    };
  }, [isPlaying, channel, currSlide]);

  function nextSlide()
  {
    gotoSlide((currSlide + 1) % channel.contents.length);
  }

  function prevSlide()
  {
    gotoSlide((currSlide - 1 + channel.contents.length) % channel.contents.length);
  }

  async function handleTilesetChange(event) {
    await updateChannel({tileset: event.target.value, channelID: channel.uniqueID, privateID: privateID, jwt: jwt});
    router.replace(router.asPath, undefined, { scroll: false });
    resetMap();
    //setMapKey(prevKey => prevKey + 1);
    //router.reload();
  }

  return (
    <div {...props}>
      {tilesets && tilesets.length && (privateID || jwt) && <Input 
        type="select" 
        defaultValue={channel.tileset?.id}
        onChange={handleTilesetChange}
        style={{
          position: 'absolute',
          top: '7px',
          right: '10px',
          zIndex: 10,
          width: '95px',
          height: '40px',
          backgroundColor: 'rgba(92, 131, 156, 0.6)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        {tilesets.map(tileset => (
          <option key={tileset.id} value={tileset.id}>{tileset.name}</option>
        ))}
      </Input>}
      <MapContainer key={mapKey} ref={setMapRef} scrollWheelZoom={true} doubleClickZoom={false} zoomSnap={0.1} zoomControl={false} style={{height: '100%', width: '100%', zIndex: 1}}>
        <TileLayer attribution={attribution} url={tileset} />
        <MarkerClusterGroup
          //chunkedLoading
          maxClusterRadius={15}
        >
          {
            channel.contents && channel.contents.map((contentItem) => {
              return <ContentMarker key={contentItem.id} contentItem={contentItem} itemWidth={itemWidth} privateID={privateID} jwt={jwt} ref={el => {if (el && markerRefs) markerRefs.push(el)}} />
            })
          }
        </MarkerClusterGroup>
        { tour && channel.contents.length ? 
          <span>
            <button style={{position: 'absolute', top: '45%', left:'1%', opacity:'0.5', width: 30, height: 30, zIndex: 500, border: '1px solid gray'}} onClick={prevSlide}><b>&lt;</b></button>
            <button style={{position: 'absolute', top: '45%', right:'1%', opacity:'0.5', width: 30, height: 30, zIndex: 500, border: '1px solid gray'}} onClick={nextSlide}><b>&gt;</b></button>
          </span> : ""}
        <ZoomControl position="bottomleft" /> 
        <div className="leaflet-bottom leaflet-left" style={{ margin: '0 0 0px 35px' }}>
          <button
            onClick={resetMap}
            title="Reset map"
            className="leaflet-control leaflet-bar"
            style={{
              width: '33px',
              height: '33px',
              border: '1px solid #aaaaaa',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            <FaUndo />
          </button>
        </div>
      </MapContainer>
      { (legend && channel.tags?.length) ? 
        <div style={{position: 'absolute', left: 10, bottom: 90, zIndex: 1000, backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
          <table>
            <tbody>
              {
               channel.tags && channel.tags.map(tag => {
                  let url = getTagURL(tag);
                  // TODO: inefficient?
                  const tagExists = channel.contents.some(content => 
                    content.tags && content.tags[0] && content.tags[0].id === tag.id
                  );
                  if (url && tagExists)
                    return (
                      <tr key={tag.id}>
                        <td style={{color: 'rgba(255, 255, 255, 1.0)', padding: 15}}>
                          <small>{tag.tag}</small>
                        </td>
                        <td style={{paddingRight:15}}>
                          <img width={25} src={url}/> 
                        </td>
                      </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div> : "" }
    </div>
  );
}

