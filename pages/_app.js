/* pages/_app.js */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import { Spinner } from 'reactstrap';
import '../styles/global.css';
import '../styles/bootstrap.min.css';
import '../styles/tags.css';
import { Nunito, Dancing_Script, Playfair_Display, Roboto } from 'next/font/google';

const nunito = Nunito({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});

const dancingScript = Dancing_Script({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export default function App({
  Component,
  pageProps,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) setLoading(true);
    };
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
    <Head>
      <title>Express — Maps, Slideshows & Video for Participatory Mapping and Research</title>
      <meta name="description" content="Create interactive maps, slideshows, and videos from photos, video, audio, and 360 content. Built for participatory mapping, photovoice, oral history, and qualitative GIS." />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    </Head>
    {loading && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 9999,
      }}>
        <Spinner color="dark" style={{ width: '3rem', height: '3rem' }} />
      </div>
    )}
    <main className={nunito.className}>
      <Component {...pageProps} />
    </main>
    </>
  )
}
