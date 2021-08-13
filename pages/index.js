import { useState } from 'react';
import useUser from '../utils/useUser';
import fetchJson from '../utils/fetchJson'
import {Button} from "react-bootstrap";

function Index() {
  const { mutateUser } = useUser({
    redirectTo: '/homepage_employee',
    redirectIfFound: true,
  })

  const [errorMsg, setErrorMsg] = useState('');

  const authUser = async function(event) {
    event.preventDefault();

    const userLogin = {
      username: event.target.username.value,
      password: event.target.password.value
    }

    try {
      await mutateUser(fetchJson('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userLogin),
        })
      );
    } catch (error) {
      console.error('Error:', error)
      setErrorMsg(error.data.message)
    }
  }

  return <div className="container col-xl-10 col-xxl-8 px-4 py-5">
    <div className="row align-items-center g-lg-5 py-5">
      <div className="col-lg-7 text-center text-lg-start">
        <h1 className="display-4 fw-bold lh-1 mb-3">Video Report System</h1>
        <p className="col-lg-10 fs-4">Start making your daily video recording by login</p>
      </div>
      <div className="col-md-10 mx-auto col-lg-5">
        <form onSubmit={authUser} method="POST" className="p-4 p-md-5 border rounded-3 bg-light">
          <div className="form-floating mb-3">
            <label>Username</label>
            <input type="text" className="form-control" id="username" name="username" placeholder="Your login username" />
          </div>
          <div className="form-floating mb-3">
            <label>Password</label>
            <input type="password" className="form-control" id="password" name="password" placeholder="Password" />
          </div>
          <Button id="login" variant="primary" size="lg" block type="submit">Login</Button>
        </form>
      </div>
    </div>
  </div>
}

export default Index
