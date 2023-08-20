import React, { useContext } from "react";

//! ---------------> CONTEXT IMPORT
import { ThemeContext } from "../../context/themeContext";

//! ---------------> REACT-BS IMPORT
import { Container, Row, Col } from "react-bootstrap";

//! ---------------> ICONS IMPORT
import {
  FaFacebookF,
  FaTwitter,
  FaGoogle,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaHome,
  FaEnvelope,
  FaPhone,
  FaPrint,
  FaGem,
} from "react-icons/fa";

//! ---------------> CSS IMPORT
import "./footer.css";

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <footer
        className={`mt-5 ${
          theme === "light" ? "footerWrapper" : "bg-dark text-white footerWrapperDarkTheme"
        }`}
      >
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="me-4 link-secondary"
            >
              <FaFacebookF className="socialIcon" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="me-4 link-secondary"
            >
              <FaTwitter className="socialIcon" />
            </a>
            <a
              href="https://google.com"
              target="_blank"
              rel="noreferrer"
              className="me-4 link-secondary"
            >
              <FaGoogle className="socialIcon" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="me-4 link-secondary"
            >
              <FaInstagram className="socialIcon" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="me-4 link-secondary"
            >
              <FaLinkedinIn className="socialIcon" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="me-4 link-secondary"
            >
              <FaGithub className="socialIcon" />
            </a>
          </div>
        </section>

        <section className="lowerFooter">
          <Container className=" text-center text-md-start mt-5">
            <Row className=" mt-3">
              <Col md={3} lg={4} xl={3} className=" mx-auto mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{
                    background: "#0bcf73",
                    color: "#ffffff",
                    padding: "2px 5px",
                    borderRadius: "5px",
                  }}
                >
                  <FaGem /> StriveBlog
                </h6>
                <p>
                  Your Gateway to Inspiration and Knowledge. <br />
                  <br />
                  This is the place where every click leads to a journey of discovery.
                </p>
              </Col>

              <Col md={3} lg={2} xl={2} className=" mx-auto mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{
                    background: "#108fde",
                    color: "#ffffff",
                    padding: "2px 5px",
                    borderRadius: "5px",
                  }}
                >
                  Useful links
                </h6>
                <p>
                  <a href="#!" className="text-reset text-decoration-none">
                    Support
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset text-decoration-none">
                    Settings
                  </a>
                </p>
                <p>
                  <a href="#!" className="text-reset text-center text-decoration-none">
                    FAQ
                  </a>
                </p>
              </Col>

              <Col md={4} lg={3} xl={3} className="mx-auto mb-md-0 mb-4">
                <h6
                  className="text-uppercase fw-bold mb-4"
                  style={{
                    background: "#108fde",
                    color: "#ffffff",
                    padding: "2px 5px",
                    borderRadius: "5px",
                  }}
                >
                  Contact
                </h6>
                <p>
                  <FaHome className="contactFooterIcon" /> Rome, RM 00042, IT
                </p>
                <p>
                  <FaEnvelope className="contactFooterIcon" /> striveblog@striveschool.it
                </p>
                <p>
                  <FaPhone className="contactFooterIcon" /> + 39 234 567 88
                </p>
                <p>
                  <FaPrint className="contactFooterIcon" /> + 39 234 567 89
                </p>
              </Col>
            </Row>
          </Container>
        </section>

        {/* <!-- Copyright --> */}
        <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.025)" }}>
          {`${new Date().getFullYear()} - © Strive Blog | Matteo Lanci | all rights reserved`}
          <div className="mt-1">
            <a className="text-reset fw-bold" href="https://github.com/MatteoLanci">
              Check my GitHub Profile!
            </a>
          </div>
        </div>
        {/* <!-- Copyright --> */}
      </footer>
    </>
  );
};

export default Footer;
