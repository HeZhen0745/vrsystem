import TopNav from "../components/topnav";
import Link from "next/link";
import useUser from "../utils/useUser";
import useSWR from "swr";
import Loading from "../components/loading";
import {Button} from "react-bootstrap";


const Homepage_employee= () =>{
    const { user } = useUser({ redirectTo: '/' });
    const { data, error } = useSWR('/api/videos');

    const Today = new Date(Date.now()).toDateString();


    // check if user is login or not
    if (!user || user.isLoggedIn === false) {
        return <Loading />
    }

    if (error) return <div>failed to load</div>
    if (!data) return <Loading />

    const checkupload = () =>{
        var temp=0;
        for (let i in data) {
            var check = new Date(data[i].uploadDate).toDateString()
            if (check == Today){
                temp = 1;
            }
        }
        if (temp == 0){
            return <>
                <h2 className="lead text-muted">You haven't record your video report today, let's start recording!</h2>
                <div className="d-grid gap-2">
                    <Link href="/recording"><a className="btn btn-primary my-2">Create Video Recording</a></Link>
                    <Link href="/fileupload"><a className="btn btn-secondary my-2">Upload Video</a></Link>
                </div>
            </>
        }
        else{
            return<>
                <h2 className="lead text-muted">You already upload today's video report, Good job!</h2>
                <Link href="/recording"><a className="btn btn-primary my-2">Create Video Recording</a></Link>
            </>
        }
    }

    const checknewvideo = () =>{
        var count = 0;
        for (var i in data) {
            if (data[i].comment == null){
                count = count+1;
            }
        }
        if (count!=0){
            return<>
                <h2 className="lead text-muted">{count} new video reports have been uploaded</h2>
                <div className="d-grid gap-2">
                    <Button href="/newupdates" variant="primary" size="lg" block>Go to check</Button>
                </div>
            </>
        }
        else {
            return<>
                <h2 className="lead text-muted">All video reports have been checked!</h2>
            </>
        }

    }

    if (user.user.type == "supervisor")
    return <>
    <TopNav />
        <section className="py-5 text-center container">
            <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                    <h1 className="fw-light">Hello, {user.user.username}</h1>
                    <h2 className="fw-light">Today is {Today}</h2>
                    {checknewvideo()}
                </div>
            </div>
        </section>
    </>

    if (user.user.type == "student")
        return <>
            <TopNav />
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                    <div className="col-lg-6 col-md-8 mx-auto">
                        <h1 className="fw-light">Hello, {user.user.username}</h1>
                        <h2 className="fw-light">Today is {Today}</h2>
                        {checkupload()}
                    </div>
                </div>
            </section>
        </>
}

export default Homepage_employee