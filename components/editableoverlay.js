import { useRef, useEffect, useState } from 'react';
import { Marker, ImageOverlay } from 'react-leaflet';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import * as L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { FaTrash, FaArrowsAlt } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import updateOverlay from "../hooks/updateoverlay";
import deleteOverlay from "../hooks/deleteoverlay";

const cornerIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:20px;height:20px;border-radius:50%;background:rgba(0,120,255,0.8);border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.5);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const moveHtml = renderToString(<FaArrowsAlt size={20} color="rgba(0,120,255,0.8)" style={{cursor: 'move', filter: 'drop-shadow(0 0 2px white)'}} />);
const moveIcon = new L.DivIcon({
  className: '',
  html: moveHtml,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

/*const trashHtml = renderToString(<FaTrash size={18} color="rgba(220,53,69,0.9)" style={{cursor: 'pointer', filter: 'drop-shadow(0 0 2px white)'}} />);
const deleteIcon = new L.DivIcon({
  className: '',
  html: trashHtml,
  iconSize: [18, 18],
  iconAnchor: [9, -16],
});*/

function OverlayMarker({ latlng, setCorner, icon })
{
  const markerRef = useRef();

  const eventHandlers = {
    async dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        var position = marker.getLatLng();
        if (setCorner)
          setCorner(position);
      }
    }
  };

  return (
    <Marker position={latlng} icon={icon || cornerIcon} ref={markerRef} eventHandlers={eventHandlers} draggable />
  );
}

export default function EditableOverlay({ overlayID, url, bounds, jwt, ...props })
{
  if (!overlayID || !url || !jwt)
    return;

  const router = useRouter();
  const [myBounds, setMyBounds] = useState(bounds);
  const overlayRef = useRef();

  async function saveOverlay()
  {
    if (overlayRef)
    {
      const tl = myBounds.getNorthWest();
      const br = myBounds.getSouthEast();
      await updateOverlay({overlayID: overlayID, jwt: jwt, tl_lat: tl.lat, tl_long: tl.lng, br_lat: br.lat, br_long: br.lng});
    }
  }

  useEffect(() => {
    saveOverlay();
  }, [myBounds]);

  async function setNorthWest(latlng)
  {
    let newBounds = L.latLngBounds(latlng, myBounds.getSouthEast())
    setMyBounds(newBounds);
  }

  async function setSouthEast(latlng)
  {
    let newBounds = L.latLngBounds(myBounds.getNorthWest(), latlng)
    setMyBounds(newBounds);
  }

  async function setNorthEast(latlng)
  {
    let newBounds = L.latLngBounds(latlng, myBounds.getSouthWest())
    setMyBounds(newBounds);
  }

  async function setSouthWest(latlng)
  {
    let newBounds = L.latLngBounds(myBounds.getNorthEast(), latlng)
    setMyBounds(newBounds);
  }

  function moveOverlay(newCenter) {
    const oldCenter = myBounds.getCenter();
    const dlat = newCenter.lat - oldCenter.lat;
    const dlng = newCenter.lng - oldCenter.lng;
    const nw = myBounds.getNorthWest();
    const se = myBounds.getSouthEast();
    setMyBounds(L.latLngBounds(
      [nw.lat + dlat, nw.lng + dlng],
      [se.lat + dlat, se.lng + dlng]
    ));
  }

  /*const confirmDelete = () => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this overlay?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await deleteOverlay({overlayID, jwt});
            router.replace(router.asPath, null, { scroll: false });
          }
        },
        { label: 'No' }
      ]
    });
  };*/

  return (
    [
      <ImageOverlay key={1} url={url} bounds={myBounds} interactive {...props} />,
      <OverlayMarker key={2} latlng={myBounds.getNorthWest()} setCorner={setNorthWest} />,
      <OverlayMarker key={3} latlng={myBounds.getSouthWest()} setCorner={setSouthWest} />,
      <OverlayMarker key={4} latlng={myBounds.getNorthEast()} setCorner={setNorthEast} />,
      <OverlayMarker key={5} latlng={myBounds.getSouthEast()} setCorner={setSouthEast} />,
      <OverlayMarker key={6} latlng={myBounds.getCenter()} setCorner={moveOverlay} icon={moveIcon} />,
      /*<Marker key={7} position={myBounds.getNorthEast()} icon={deleteIcon} eventHandlers={{ click: confirmDelete }} />,*/
    ]
  )
}
