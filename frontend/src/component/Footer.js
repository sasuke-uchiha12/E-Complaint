import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import '../css/Footer.css'; 

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="social-media-icons">
                    <FontAwesomeIcon className="icon-padding-right" icon={faFacebookF} />
                    <FontAwesomeIcon className="icon-padding-right" icon={faInstagram} />
                    <FontAwesomeIcon icon={faTwitter} />
                </div>
                <div className="brand-logo">
                    MyApp
                </div>
                <div className="footer-links">
                    <a href="#legal">aaaaaaaaa</a>
                    <a href="#privacy">bbbbbbb</a>
                    <a href="#security">ccccc</a>
                    <a href="#accessibility">dddddd</a>
                    <a href="#cookies">eeeeee</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} MyApp. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
