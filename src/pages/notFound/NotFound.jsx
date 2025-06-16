import React from 'react';
import './NotFound.css';

function NotFound() {
    return(
        <div className="outer-container notfound-wrapper">
            <div className="inner-container notfound-card">
                <div className="form-card notfound-card">
                    <h1>404</h1>
                    <h2>Oeps... This page doesn't exist</h2>
                    <p>Please check the URL or return to the homepage.</p>
                    <a href="/" className="button-red">Go to Homepage</a>
                </div>
            </div>
        </div>
    )
}

export default NotFound;