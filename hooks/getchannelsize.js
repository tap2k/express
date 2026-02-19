import setError, { setErrorText } from "./seterror";
import getChannel from "./getchannel";

export default async function getChannelSize({ channelID, jwt })
{
  if (!channelID) {
    setErrorText("No channel provided");
    return null;
  }
  try {
    let size = 0;
    let channel = await getChannel({ channelID, jwt, edit: true });
    channel.contents && channel.contents.forEach(contentItem => {
      if (contentItem.mediafile?.size)
        size += contentItem.mediafile.size;
      if (contentItem.audiofile?.size)
        size += contentItem.audiofile.size;
    });
    channel.overlays && channel.overlays.forEach(overlay => {
      if (overlay.image?.size)
        size += overlay.image.size;
    });
    channel.assets && channel.assets.forEach(asset => {
      if (asset.pcbundle?.size)
        size += asset.pcbundle.size;
      if (asset.macbundle?.size)
        size += asset.macbundle.size;
      if (asset.androidbundle?.size)
        size += asset.androidbundle.size;
      if (asset.webglbundle?.size)
        size += asset.webglbundle.size;
    });
    for (const child of (channel.children || []))
      size += await getChannelSize({ channelID: child.uniqueID, jwt });
    return size;
  } catch (err) {
    setError(err);
    return null;
  }
}
