/* pages/_app.js */
import Head from 'next/head'
import '../styles/global.css';
import '../styles/bootstrap.min.css';
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
  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    </Head>
    <main className={nunito.className}>
      <Component {...pageProps} />
    </main>
    </>
  )
}
