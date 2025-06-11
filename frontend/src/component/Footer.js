import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  //   Facebook, 
  //   Twitter, 
  //   Instagram, 
  Linkedin,
  GeoAlt,
  Envelope,
  Telephone
} from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto" style={{ backgroundColor: '#343a40' }}>
      <Container fluid className="py-4">
        <Row>
          {/* Company Info */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="text-white">Company Name</h5>
            <p className="text-light">
              Book events your way, at your space — Trusted since 2025.
            </p>
            <div className="social-icons">
              {/* <a href="#" className="text-white me-2"><Facebook size={20} /></a>
              <a href="#" className="text-white me-2"><Twitter size={20} /></a>
              <a href="#" className="text-white me-2"><Instagram size={20} /></a> */}
              <a
                href="http://linkedin.com/in/granth-das-aa9470287"
                className="text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          {/* <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-white">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Home</a></li>
              <li><a href="#" className="text-light">About Us</a></li>
              <li><a href="#" className="text-light">Services</a></li>
              <li><a href="#" className="text-light">Portfolio</a></li>
              <li><a href="#" className="text-light">Contact</a></li>
            </ul>
          </Col> */}

          {/* Services */}
          {/* <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-white">Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-light">Web Design</a></li>
              <li><a href="#" className="text-light">App Development</a></li>
              <li><a href="#" className="text-light">SEO</a></li>
              <li><a href="#" className="text-light">Digital Marketing</a></li>
              <li><a href="#" className="text-light">Graphic Design</a></li>
            </ul>
          </Col> */}

          {/* Contact Info */}
          <Col md={4}>
            <h5 className="text-white">Contact Us</h5>
            <address className="text-light">
              <p><GeoAlt className="me-2 text-white" /> Varanasi,Uttar Pradesh, India</p>
              <p><Envelope className="me-2 text-white" /> dasgranth24@gmail.com</p>
              <p><Telephone className="me-2 text-white" /> +91 8318383381</p>
            </address>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4">
          <Col className="text-center text-light">
            <p className="mb-0">&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;