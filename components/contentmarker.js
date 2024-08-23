import { useRouter } from 'next/router';
import { useRef, forwardRef, useState } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import updateSubmission from "../hooks/updatesubmission";
import getContentMarkerIcon from "../hooks/getcontentmarkericon";
import ContentCard from "./contentcard";

const ContentMarker = forwardRef(function ContentMarker(props, fwdRef) 
{
  const { contentItem, itemWidth, privateID, autoPlay } = props;

  if (!contentItem)
    return;

  const markerRef = useRef();

  // TODO: What about 0,0?
  if (!contentItem.lat || !contentItem.long)
    return;

  const eventHandlers = {
    async dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        var position = marker.getLatLng();
        await updateSubmission({contentID: contentItem.id, lat: position.lat, long: position.lng});
      }
    },
    click() {
      markerRef.current.closeTooltip();
    },
  };

  const icon = getContentMarkerIcon(contentItem);

  return (
    <>
      <Marker position={[contentItem.lat, contentItem.long]} icon={icon} ref={(el)=> {markerRef.current = el; if (fwdRef) fwdRef(el);}} eventHandlers={eventHandlers} draggable={privateID ? true : false}>
        { contentItem.title && <Tooltip>
            <div style={{textAlign: 'center'}}><b>{contentItem.title}</b></div>
          </Tooltip>    
        }
        <Popup>
          <div style={{minWidth: itemWidth}}>
            <ContentCard contentItem={contentItem} autoPlay={autoPlay} privateID={privateID} />
          </div>
        </Popup>
      </Marker>
    </>
  );
});

export default ContentMarker;
