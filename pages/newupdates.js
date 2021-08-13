import Link from 'next/link';
import useUser from '../utils/useUser';
import Loading from '../components/loading';
import TopNav from '../components/topnav';
import useSWR from 'swr';
import { useState } from 'react';
import {Modal, Button, Card, Badge, CardDeck, Col, Row, Container} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const Newupdates = () => {
    // comment button state definition
    const [videoID, setVideoID] = useState(0);
    // modal dialog state definition
    const [show, setShow] = useState(false);
    const {user} = useUser({redirectTo: '/'});
    const {data, error} = useSWR('/api/videos');

    // check if user is login or not
    if (!user || user.isLoggedIn === false) {
        return <Loading/>
    }

    if (error) return <div>failed to load</div>
    if (!data) return <Loading/>

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

        // result.user => 'Ada Lovelace'
    }

    const showCommentOrButton = (data) => {
        if (data.comment == null) {
            return<>
                <Col className="py-2">
                    <Card>
                        <video className="bd-placeholder-img card-img-top video" controls src={`/videos/${data.file}`}/>
                        <Card.Body>
                            <Card.Title> {new Date(data.uploadDate).toDateString()}&nbsp; <Badge pill variant="secondary">New</Badge></Card.Title>
                            <Card.Subtitle>Uploaded by {data.user}</Card.Subtitle>
                            <Card.Text className="py-1">
                                <Button className="float-right" variant="primary" onClick={() => {handleShow(); setVideoID(data._id)}}>Add Comment</Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </>
        }
    }

    // modal dialog event handler
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (user.user.type == "supervisor")
        return <>
            <TopNav/>
            <main>
                <div className="album py-5 px-4 bg-light">
                    <Container fluid="true">
                        <CardDeck>
                            <Row xs={1} md={2} lg={3} xl={4}>
                                {data.map((video) => (
                                    showCommentOrButton(video, user)
                                ))}
                            </Row>
                        </CardDeck>
                    </Container>
                </div>
            </main>
            <Modal show={show} onHide={handleClose} centered>
                <form onSubmit={handleSaveComment} method="POST">
                    <Modal.Header closeButton>
                        <Modal.Title>Add Comment</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <textarea className="form-control" name="commentText" id="commentText"></textarea>
                        <input type="hidden" name="commentedVideoID" id="commentedVideoID" value={videoID}/>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                        <Button type="submit" variant="primary">Save comment</Button>
                    </Modal.Footer>
                </form>
            </Modal>
            <ToastContainer/>
        </>
}

export default Newupdates