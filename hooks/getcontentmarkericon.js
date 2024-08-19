
export default function getContentMarkerIcon(contentItem) 
{
  const iconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'

  const iconParams = 
  {
    iconUrl: iconUrl, 
    iconAnchor: [10, 32], 
    popupAnchor: [1, -34],
    iconSize: [20, 32],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [32, 32]
  };
  
  return new L.Icon(iconParams);
} 
