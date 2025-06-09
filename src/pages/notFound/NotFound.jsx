import React from 'react';

function NotFound() {
    return(
        <div className="notfound-wrapper">
            <div className="notfound-card">
                <h1>404</h1>
                <h2>Oeps... This page doesn't exist</h2>
                <p>Please check the URL or return to the homepage.</p>
                <a href="/" className="notfound-btn">Go to Homepage</a>
            </div>
        </div>
    )
}

export default NotFound;