import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Facebook, Twitter, Instagram, Linkedin } from 'react-bootstrap-icons';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5">
      <Container fluid className="py-4">
        <Row>
          {/* Company Info */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Company Name</h5>
            <p className="text-muted">
              Providing quality services since 2010. We specialize in creating amazing digital experiences.
            </p>
            <div className="social-icons">
              <a href="#" className="text-white me-2"><Facebook size={20} /></a>
              <a href="#" className="text-white me-2"><Twitter size={20} /></a>
              <a href="#" className="text-white me-2"><Instagram size={20} /></a>
              <a href="#" className="text-white"><Linkedin size={20} /></a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">Home</a></li>
              <li><a href="#" className="text-muted">About Us</a></li>
              <li><a href="#" className="text-muted">Services</a></li>
              <li><a href="#" className="text-muted">Portfolio</a></li>
              <li><a href="#" className="text-muted">Contact</a></li>
            </ul>
          </Col>

          {/* Services */}
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-muted">Web Design</a></li>
              <li><a href="#" className="text-muted">App Development</a></li>
              <li><a href="#" className="text-muted">SEO</a></li>
              <li><a href="#" className="text-muted">Digital Marketing</a></li>
              <li><a href="#" className="text-muted">Graphic Design</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4}>
            <h5>Contact Us</h5>
            <address className="text-muted">
              <p><i className="bi bi-geo-alt-fill me-2"></i> 123 Street, City, Country</p>
              <p><i className="bi bi-envelope-fill me-2"></i> info@example.com</p>
              <p><i className="bi bi-telephone-fill me-2"></i> +1 234 567 890</p>
            </address>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="mt-4">
          <Col className="text-center text-muted">
            <p className="mb-0">&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;