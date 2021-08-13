import useUser from '../utils/useUser';
import Loading from '../components/loading';
import TopNav from '../components/topnav';
import useSWR from 'swr';

const FileUpload = () => {
  const { user } = useUser({ redirectTo: '/' });
  const { data, error } = useSWR('/api/videos');

  if (!user || user.isLoggedIn === false) {
    return <Loading />
  }

  if (error) return <div>failed to load</div>
  if (!data) return <Loading />

  const uploadFile = async function(event) {
    event.preventDefault();
  }

  return <>
  <TopNav />
  <main>
    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">Upload Video Recording</h1>
          <p>Choose your video file by clicking "Browse..."</p>
          <form onSubmit={uploadFile} method="POST" encType="multipart/form-data">
              <input type="file" name="videofile" id="videofile" />
              <button id="upload" className="btn btn-lg btn-primary btn-upload" type="submit">Upload</button>
          </form>
        </div>
      </div>
    </section>
  </main>
  </>
}

export default FileUpload