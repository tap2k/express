import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import addTag from "../hooks/addtag";
import removeTag from "../hooks/removetag";

const ReactTags = dynamic(
    () => import('react-tag-input').then((mod) => mod.WithContext),
    { ssr: false }
);

function convertArray(myArray) {
    if (!myArray || !myArray.length) return [];
    return myArray.map(item => ({id: item.id.toString(), text: item.tag}));
}

export default function ContentTagger({ contentItem, tags, jwt, privateID, ...props }) {
    if (!contentItem) return null;

    const router = useRouter();
    const myTags = convertArray(tags);

    const handleDelete = async (i) => {
        const err = await removeTag({contentID: contentItem.id, tagID: myTags[i].id, jwt, privateID});
        router.replace(router.asPath, undefined, { scroll: false });
    }

    const handleAddition = async (myTag) => {
        if (!myTag) return;
        const newTag = await addTag({contentID: contentItem.id, tag: myTag.text, tagID: myTag.id, jwt, privateID});
        router.replace(router.asPath, undefined, { scroll: false });
    }

    return ( 
        <ReactTags 
            inputFieldPosition="top"
            tags={convertArray(contentItem.tags)}
            suggestions={myTags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            delimiters={[9, 13]} // Tab and Enter keys
            allowDeleteFromEmptyInput={false}
            allowDragDrop={false}
            editable={false}
            placeholder="Add tags here"
            inputProps={{...props}}
        />
    );
}