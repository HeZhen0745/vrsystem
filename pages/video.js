import Link from 'next/link';
import useUser from '../utils/useUser';
import Loading from '../components/loading';
import TopNav from '../components/topnav';
import useSWR from 'swr';
import { useState } from 'react';
import {Modal, Button, Card, Badge, CardDeck, Col, Row, Container, Nav} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Video = () => {
  // comment button state definition
  const [ videoID, setVideoID ] =  useState(0);
  // comment button comment text state definition
  const [ selectedComment, setComment ] =  useState(0);
  // modal dialog state definition
  const [ show, setShow ] = useState(false);
  const { user } = useUser({ redirectTo: '/' });
  const { data, error } = useSWR('/api/videos');

  // check if user is login or not
  if (!user || user.isLoggedIn === false) {
    return <Loading />
  }

  if (error) return <div>failed to load</div>
  if (!data) return <Loading />

  // handle Save Comment button in Modal window
  const handleSaveComment = async (event) => {
    event.preventDefault()
    const commentText = event.target.commentText.value;
    const commentedVideoID = event.target.commentedVideoID.value;
    
    if (commentText.length < 5) {
      toast("Please add meaningful comment");
      return false;
    }

    const res = await fetch(
      '/api/addcomment',
      {
        body: JSON.stringify({
          comment: commentText,
          videoID: commentedVideoID
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )
    
    const result = await res.json();
    console.log(result);
    
    if (result.status == 'success') {
      toast("Done!");
      handleClose();
    } else {
      toast("Failed to add comment due to error!", {autoClose: false});
    }
  }

  // handle delete button in video
  const handleDeleteButton = async (event) => {
    const videoID = event.target.getAttribute('data');

    const res = await fetch(
      '/api/deletevideo',
      {
        body: JSON.stringify({
          videoID: videoID
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )
    
    const result = await res.json();
    console.log(result);
    
    if (result.status == 'success') {
      toast("Done!");
    } else {
      toast("Failed to delete the video due to error!", {autoClose: false});
    }
  }

  const showCommentOrButton = (data) => {
    if (data.comment != null) {
      return<>
        <Col className="py-2">
          <Card>
            <video className="bd-placeholder-img card-img-top video" controls src={`/videos/${data.file}`} />
            <Card.Body>
              <Card.Title>{new Date(data.uploadDate).toDateString()}</Card.Title>
              <Card.Subtitle>Uploaded by {data.user}</Card.Subtitle>
              <Card.Text className="py-1 comment">{data.comment}</Card.Text>
              <Button className="float-right" type="button" variant="secondary" onClick={() => {handleShow(); setVideoID(data._id); setComment(data.comment)}}>Edit Comment</Button>
            </Card.Body>
          </Card>
        </Col>
      </>
    }
  }

  const deleteButton = (data) => {
    return<>
      <Button className="float-right" type="button" variant="danger" onClick={handleDeleteButton} data={data._id}>Delete</Button>
    </>
  }


  // modal dialog event handler
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const userLinks = [];
  user.user.supervise.map((s, i) => {        
    userLinks.push(<Nav.Item><Nav.Link href={`/video/${s}`}>{s}</Nav.Link></Nav.Item>);
  })

  if(user.user.type == "supervisor") {
    return <>
    <TopNav />
    <main>
      <Nav variant="tabs" defaultActiveKey="">{userLinks}</Nav>
      <div className="album py-5 px-4 bg-light">
        <Container fluid="true">
          <CardDeck>
            <Row xs={1} md={2} lg={3} xl={4}>
              {data.map((video) => (
                  showCommentOrButton(video, user)
              ))}
            </Row>
          </CardDeck>
          {/*<div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">*/}
          {/*  {data.map((video) => (*/}
          {/*    <div className="col">*/}
          {/*      <div className="card shadow-sm">*/}
          {/*        <video className="bd-placeholder-img card-img-top video" controls src={`/videos/${video.file}`} />*/}
          {/*        <div className="card-body">*/}
          {/*          {showCommentOrButton(video, user)}*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</div>*/}
        </Container>
      </div>
    </main>
    <Modal show={show} onHide={handleClose} centered>
        <form onSubmit={handleSaveComment} method="POST">
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
  
        <Modal.Body>
          <textarea className="form-control" name="commentText" id="commentText">{selectedComment}</textarea>
          <input type="hidden" name="commentedVideoID" id="commentedVideoID" value={videoID} />
        </Modal.Body>
  
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button type="submit" variant="primary">Save comment</Button>
        </Modal.Footer>
        </form>
      </Modal>
      <ToastContainer />
    </>
  } else if(user.user.type == "student") {
    return <>
      <TopNav />
      <main>
        <div className="album py-5 px-4 bg-light">
          <Container fluid="true">
            <Row xs={1} md={2} lg={3} xl={4}>
              {data.map((video) => (
                  <Col className="py-2">
                    <Card>
                      <video className="bd-placeholder-img card-img-top video" controls src={`/videos/${video.file}`} />
                      <Card.Body>
                        <Card.Title>{new Date(video.uploadDate).toDateString()}</Card.Title>
                        <Card.Text className="comment">{video.comment}</Card.Text>
                        {deleteButton(video, user)}
                      </Card.Body>
                    </Card>
                  </Col>
              ))}
            </Row>
          </Container>
        </div>
      </main>
      </>
  }
}

export default Video