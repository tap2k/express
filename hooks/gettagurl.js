import getMediaURL from "../hooks/getmediaurl";

const colors = [
  "black",
  "violet",
  "orange",
  "blue",
  "yellow",
  "red",
  "gold",
  //"green",
  "grey"
];

export default function getTagURL(tag) 
{
  if (!tag) {
    setErrorText("No tag provided");
    return null;
  }
  if (tag.thumbnail)
  {
    if (tag.thumbnail.formats?.icon?.url)
      return getMediaURL() + tag.thumbnail.formats.icon.url;
    else
      return getMediaURL() + tag.thumbnail.url;
  }
  else 
  {
    if (tag.markercolor && tag.markercolor != "none") 
      //return 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + tag.markercolor + '.png';
      return 'marker-icon-2x-' + tag.markercolor + '.png';
  }

  const colorIndex = tag.id % colors.length;
  const selectedColor = colors[colorIndex];
  return `marker-icon-2x-${selectedColor}.png`;
} 
