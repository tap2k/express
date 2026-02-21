import { useRef, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import updateSubmission from "../hooks/updatesubmission";
import getContentMarkerIcon from "../hooks/getcontentmarkericon";
import ContentCard from "./contentcard";

const ContentMarker = forwardRef(function ContentMarker(props, fwdRef) 
{
  const { contentItem, itemWidth, privateID, jwt, autoPlay } = props;
  const router = useRouter();

  if (!contentItem)
    return;

  const markerRef = useRef();

  if (contentItem.lat == null || contentItem.long == null)
    return;

  const handleRemoveFromMap = async () => {
    await updateSubmission({ contentID: contentItem.id, lat: "", long: "", privateID, jwt });
    router.replace(router.asPath, undefined, { scroll: false });
  };

  const eventHandlers = {
    async dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        var position = marker.getLatLng();
        await updateSubmission({contentID: contentItem.id, lat: position.lat, long: position.lng, privateID, jwt});
      }
    },
    /*click() {
      markerRef.current.closeTooltip();
    },*/
  };

  const icon = getContentMarkerIcon(contentItem);

  return (
    <>
      <Marker position={[contentItem.lat, contentItem.long]} icon={icon} ref={(el)=> {markerRef.current = el; if (fwdRef) fwdRef(el);}} eventHandlers={eventHandlers} draggable={privateID || jwt ? true : false}>
        { contentItem.title && <Tooltip>
            <div style={{textAlign: 'center'}}><b>{contentItem.title}</b></div>
          </Tooltip>    
        }
        <Popup closeOnClick={false} autoPanPadding={[50, 150]}>
          <div style={{width: itemWidth}}>
            <ContentCard contentItem={contentItem} autoPlay={autoPlay} privateID={privateID} jwt={jwt} controls tags />
            {(privateID || jwt) && (
              <button onClick={handleRemoveFromMap} title="Remove from map"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  width: '100%', padding: '4px 0', marginTop: '4px',
                  backgroundColor: 'transparent', border: '1px solid #ccc', borderRadius: '4px',
                  cursor: 'pointer', fontSize: '12px', color: '#666',
                }}>
                <FaMapMarkerAlt size={10} /> Remove from map
              </button>
            )}
          </div>
        </Popup>
      </Marker>
    </>
  );
});

export default ContentMarker;
