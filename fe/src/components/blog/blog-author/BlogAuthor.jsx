import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import "./BlogAuthor.css";

//!------------- REACT-ICONS IMPORT
import { FaTrashAlt } from "react-icons/fa";
import { FaList } from "react-icons/fa";

//!------------- REACT-BOOTSTRAP IMPORT
import { Container, Row, OverlayTrigger, Tooltip, Modal, Button } from "react-bootstrap";

//!------------- LIBRARIES IMPORT
import axios from "axios";
import { nanoid } from "nanoid";
import Carousel from "react-multi-carousel";

//!------------- CONTEXT IMPORT
import { ThemeContext } from "../../../context/themeContext";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
  },
};

const BlogAuthor = ({ authors, fetchAuthors }) => {
  const [showModal, setShowModal] = useState(false);

  const [authorToDelete, setAuthorToDelete] = useState("");
  // console.log(authorToDelete);

  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("userLoggedIn"));
  // console.log(token);
  const tokenDecoded = jwtDecode(token);
  // console.log(tokenDecoded);

  const handleDeleteAuthor = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_SERVERBASE_URL}/comments/${authorToDelete}/remove`
      );
      await axios.delete(`${process.env.REACT_APP_SERVERBASE_URL}/posts/${authorToDelete}/remove`);
      await axios.delete(`${process.env.REACT_APP_SERVERBASE_URL}/authors/${authorToDelete}`);

      setAuthorToDelete("");

      localStorage.removeItem("userLoggedIn");
      navigate("/");

      setTimeout(() => {
        fetchAuthors();
      }, 1000);
    } catch (error) {
      console.log("Error deleting author from DB: ", error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  return (
    <>
      <h2 className={`my-5 ${theme === "light" ? "" : "text-light"}`}>Meet Our Authors</h2>
      <Container className="authorContainer">
        <Row className={`${theme === "light" ? "galleryWrapper" : "galleryWrapperDarkTheme"}`}>
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={5000}
            className="customCarousel"
            removeArrowOnDeviceType={["tablet", "mobile"]}
          >
            {authors.map((author) => (
              <figure className="galleryItem" key={nanoid()}>
                <img src={author.avatar} alt={author._id} className="itemImage" />
                <figcaption className="itemDescription">
                  <h2 className="authorName">
                    {author.firstName} {author.lastName}
                  </h2>
                  <a href={`mailto:${author.email}`} className="authorEmail">
                    {author.email}
                  </a>
                  <span className="authorUniqueId">id: {author._id}</span>
                  {tokenDecoded.id === author._id && (
                    <OverlayTrigger
                      placement="left"
                      overlay={<Tooltip id="tooltipDeleteProfile">Delete my Account</Tooltip>}
                    >
                      <div className="authorIcon removeAuthorIcon">
                        <FaTrashAlt
                          onClick={() => {
                            setShowModal(true);
                            setAuthorToDelete(author._id);
                          }}
                        />
                      </div>
                    </OverlayTrigger>
                  )}

                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id={`tooltip-${author._id}`}>
                        Discover {author.firstName} {author.lastName} blogPosts
                      </Tooltip>
                    }
                  >
                    <Link className="authorIcon blogAuthorIcon" to={`/authorPage/${author._id}`}>
                      <FaList />
                    </Link>
                  </OverlayTrigger>
                </figcaption>
              </figure>
            ))}
          </Carousel>
        </Row>
      </Container>
      {/* SECURITY MODAL TO DELETE PERMANENTELY ACCOUNT FROM DB */}
      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>DELETE ACCOUNT</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete your account? This action is irreversible and
          all your data will be lost.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            No, i changed my mind
          </Button>
          <Button variant="danger" onClick={() => handleDeleteAuthor()}>
            YES, I want to delete my account from StriveBlog.
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogAuthor;
