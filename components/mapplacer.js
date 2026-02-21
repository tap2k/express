import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useMapEvents } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import * as L from 'leaflet';
import updateSubmission from "../hooks/updatesubmission";
import getMediaURL from "../hooks/getmediaurl";

export default function MapPlacer({ show, contents, privateID, jwt }) {
  const [placingItem, setPlacingItem] = useState(null);
  const router = useRouter();

  const unlocatedItems = (contents || []).filter(item => item.lat == null || item.long == null);

  useMapEvents({
    click(e) {
      if (!placingItem) return;
      (async () => {
        await updateSubmission({ contentID: placingItem.id, lat: e.latlng.lat, long: e.latlng.lng, privateID, jwt });
        setPlacingItem(null);
        router.replace(router.asPath, undefined, { scroll: false });
      })();
    },
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPlacingItem(null);
    };
    if (placingItem) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [placingItem]);

  useEffect(() => {
    if (!show) setPlacingItem(null);
  }, [show]);

  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) L.DomEvent.disableClickPropagation(panelRef.current);
  });

  if (!show) return null;

  return (
    <div ref={panelRef} style={{
      position: 'absolute', top: '55px', right: '10px', zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)',
      borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
      maxHeight: '50vh', width: '220px', overflowY: 'auto', padding: '8px',
    }}>
      {placingItem && (
        <div style={{
          padding: '6px 8px', marginBottom: '6px', backgroundColor: '#fff3cd',
          borderRadius: '4px', fontSize: '12px', color: '#856404',
        }}>
          Click the map to place
        </div>
      )}
      {unlocatedItems.length > 0 ? unlocatedItems.map(item => (
        <div
          key={item.id}
          onClick={() => setPlacingItem(placingItem?.id === item.id ? null : item)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '6px',
            borderRadius: '6px', cursor: 'pointer', marginBottom: '4px',
            backgroundColor: placingItem?.id === item.id ? 'rgba(0, 123, 255, 0.15)' : 'transparent',
            border: placingItem?.id === item.id ? '2px solid #007bff' : '2px solid transparent',
          }}
        >
          {item.mediafile?.formats?.thumbnail?.url ? (
            <img src={getMediaURL() + item.mediafile.formats.thumbnail.url} alt=""
              style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: '40px', height: '40px', borderRadius: '4px', backgroundColor: '#e9ecef',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6c757d',
            }}>
              <FaMapMarkerAlt />
            </div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#333',
              fontWeight: placingItem?.id === item.id ? 'bold' : 'normal',
            }}>
              {item.title || item.description || `Item ${item.id}`}
            </div>
          </div>
        </div>
      )) : (
        <div style={{ padding: '6px 8px', fontSize: '13px', color: '#666' }}>
          All items mapped
        </div>
      )}
    </div>
  );
}
