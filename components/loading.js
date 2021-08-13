import React, { Component } from 'react';

export default class Loading extends Component {
    render() {
      return( 
        <>
            <main>
            <section className="py-5 text-center container">
                <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                    <h1 className="fw-light">Loading...</h1>
                </div>
                </div>
            </section>
            </main>
        </>
      )
    }
}