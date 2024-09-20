
export default function filterChannel({ channel, tags }) 
{
  if (!channel?.tags?.length || !tags?.length)
    return channel;

  let newchannel = {...channel};

  let parts = tags.split(/[ ,]+/).filter(Boolean);
  parts.map(tag => {
      newchannel.contents = newchannel.contents.filter(contentItem => contentItem.tags.some(tagItem => tagItem.tag == tag));
  });

  return newchannel; 
}
