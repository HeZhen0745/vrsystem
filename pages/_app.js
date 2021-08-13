import 'bootstrap/dist/css/bootstrap.css';
import 'react-toastify/dist/ReactToastify.css';
import '../public/css/style.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router'

export default function VideoReportApp({ Component, pageProps }) {

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      // re-register client-side JavaScript event
      registerEventListener();
    }

    router.events.on('routeChangeComplete', handleRouteChange)
  }, [])

  return <Component {...pageProps} />
}
