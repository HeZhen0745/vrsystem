import useUser from '../utils/useUser'
import Link from 'next/link';
import TopNav from '../components/topnav';
import Loading from '../components/loading';
import {Button} from "react-bootstrap";


const Recording = () => {
  const { user } = useUser({ redirectTo: '/' });
  // check if user is login or not
  
  if (!user || user.isLoggedIn === false) {
    return <Loading />
  }

  return <>
  <TopNav />
    <section className="py-5 text-center container">
      <div className="row">
        <div className="col-lg-10 col-md-12 col-sm-12 mx-auto">
          <video playsInline autoPlay className="videofeed" id="recorder" poster="/images/bg.png"></video>
          <video playsInline autoPlay className="videofeed" id="recordedVideo" poster="/images/bg.png"></video>
          <hr/>
          <div className="d-grid gap-2">
            <Button href="#" id="record" variant="primary" size="lg" block>Start</Button>
            <Button href="#" id="stop" variant="danger" size="lg" block>Stop</Button>
            <Button href="#" id="upload" variant="success" size="lg" block>Upload</Button>
          </div>
        </div>
      </div>
    </section>
    </>
}

export default Recording