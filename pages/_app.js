/* pages/_app.js */
import Head from 'next/head'
import '../styles/global.css';
import '../styles/bootstrap.min.css';

export default function App({
  Component,
  pageProps,
}) {
  return (
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    </Head>
    <Component {...pageProps} />
    </>
  )
}
