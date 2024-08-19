import { useRouter } from 'next/router';
import { useRef, forwardRef, useState } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet.js';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import updateSubmission from "../hooks/updatesubmission";
import getContentMarkerIcon from "../hooks/getcontentmarkericon";
import ContentEditor from "./contenteditor";
import Content from "./content";
import Caption from "./caption";

const ContentMarker = forwardRef(function ContentMarker(props, fwdRef) 
{
  const { contentItem, itemWidth, itemHeight, privateID, autoPlay } = props;

  if (!contentItem)
    return;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const markerRef = useRef();
  const router = useRouter();

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
    dblclick() {
      if (privateID)
      {
        markerRef.current.closeTooltip();
        markerRef.current.closePopup();
        setIsModalOpen(true);
      }
    },
  };

  const icon = getContentMarkerIcon(contentItem);

  return (
    <>
      <Marker position={[contentItem.lat, contentItem.long]} icon={icon} ref={(el)=> {markerRef.current = el; if (fwdRef) fwdRef(el);}} eventHandlers={eventHandlers} draggable={privateID ? true : false}>
        { contentItem.name && <Tooltip>
            <div style={{textAlign: 'center'}}><b>{contentItem.name}</b></div>
          </Tooltip>    
        }
        <Popup>
          <div style={{minWidth: itemWidth}}>
            <Content contentItem={contentItem} width={itemWidth} height={itemHeight} controls autoPlay={autoPlay} />
            {contentItem.description &&
                <Caption 
                  title={contentItem.description}
                  textAlignment="center"
                  small
                />
            }
          </div>
        </Popup>
      </Marker>
      <ContentEditor contentItem={contentItem} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
});

export default ContentMarker;
