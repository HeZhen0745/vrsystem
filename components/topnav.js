import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import useUser from '../utils/useUser';

const TopNav = () => {
  const { user, mutateUser } = useUser();

  if (user.user.type == "student")
    return(
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="/homepage_employee">&nbsp;&nbsp; Home</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/video">Video Reports</Nav.Link>
              <Nav.Link href="/recording">New Recording</Nav.Link>
              <Nav.Link href="/api/logout">Log Out</Nav.Link>
            </Nav>
            <Navbar.Text>Hello, {user.user.username}</Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </>
    )

  if (user.user.type == "supervisor")
    return(
        <>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/homepage_employee">&nbsp;&nbsp; Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/newupdates">New Updates</Nav.Link>
                <Nav.Link href="/video">Video Reports</Nav.Link>
                <Nav.Link href="/api/logout">Log Out</Nav.Link>
              </Nav>
              <Navbar.Text>Hello, {user.user.username}</Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </>
    )
}

export default TopNav