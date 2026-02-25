import { useState } from 'react';
import { Container } from 'reactstrap';

const questions = [
  {
    q: 'What is Fotomap?',
    a: 'Fotomap is a platform for creating interactive maps, slideshows, and videos from your photos, video, audio, and 360 content.',
  },
  {
    q: 'Does it cost money?',
    a: 'We plan to offer Fotomap for free as long as we can. If usage goes beyond what we can manage internally, we may need to charge some nominal fees.'
  },
  {
    q: 'What media formats are supported?',
    a: 'Images (JPEG, PNG, GIF, WebP), video (MP4, WebM), audio (MP3, WAV), 360 images and video, plus YouTube, Vimeo, Google Photos, and Dropbox links.',
  },
  /*{
    q: 'How does video generation work?',
    a: 'Upload your media, arrange it in a channel, and Fotomap generates a video with transitions and narration. Available on Pro plans and above.',
  },*/
  {
    q: 'How does 360 content work?',
    a: 'Add _360 or _180 to your filename and Fotomap will auto-detect it.',
    // For stereo, add _lr (side-by-side) or _tb (top-bottom).
  },
  /*{
    q: 'Can I try it for free?',
    a: 'Yes. The Free plan includes 5 channels and 250 MB of storage with full access to maps, slideshows, and 360 media.',
  },*/
  {
    q: 'What is Fotomap built with?',
    a: 'Next.js and React on the front, Strapi in the back, Bootstrap for UI, and Leaflet for maps.',
  },
  {
    q: 'Can I self-host Fotomap?',
    a: 'Yes. Fotomap is open source. Clone the repo, run the frontend and backend.',
  },
  {
    q: 'Do you take requests?',
    a: 'We would love to hear from you if you have ideas for how to make Fotomap better.',
  },
  /*{
    q: 'What about AI?',
    a: "We don't have any AI features, but you can upload your own AI-generated content.",
  },*/
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: '1px solid #e9ecef',
        padding: '16px 0',
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: '1.1rem', color: '#333' }}>{q}</span>
        <span style={{ fontSize: '1.4rem', color: '#999', marginLeft: '12px', flexShrink: 0 }}>
          {open ? '−' : '+'}
        </span>
      </div>
      {open && (
        <p style={{ margin: '10px 0 0', fontSize: '1rem', color: '#666', lineHeight: 1.6 }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      {/* <hr style={{ border: 'none', borderTop: '2px solid #ccc', margin: '12px 24px' }} /> */}
      <Container style={{ maxWidth: '680px', padding: '24px 16px 32px' }}>
        {questions.map(({ q, a }) => (
          <FAQItem key={q} q={q} a={a} />
        ))}
      </Container>
    </>
  );
}
