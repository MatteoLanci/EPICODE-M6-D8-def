import React, { useContext, useEffect, useRef, useState } from "react";

//!----------> UTILITIES IMPORT
import { nanoid } from "nanoid";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//!----------> BOOTSTRAP IMPORT
import { Container, Alert, Button, Modal } from "react-bootstrap";

//!----------> ROUTER-DOM IMPORT
import { useParams, Link, useNavigate } from "react-router-dom";

//!----------> CONTEXT IMPORT
import { ThemeContext } from "../../context/themeContext";
import { AuthorsContext } from "../../context/AuthorsContenx";

//!----------> CUSTOM HOOKS IMPORT
import { useSession } from "../../middlewares/ProtectedRoutes";

//!----------> REACT ICONS IMPORT
import { TbRefresh } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import { BsPersonVcard } from "react-icons/bs";
import { HiOutlineMail, HiOutlineCake, HiOutlineUser, HiOutlineTrash } from "react-icons/hi";

//!----------> CSS IMPORT
import "./authorPage.css";

const AuthorPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const session = useSession();

  const { theme } = useContext(ThemeContext);
  const { authors, setAuthors } = useContext(AuthorsContext);

  const [showModal, setShowModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("userLoggedIn"));

    const fetchAuthors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVERBASE_URL}/authors`, {
          headers: { Authorization: token },
        });
        setAuthors(response.data.authors);
        setIsLoading(false);
      } catch (error) {
        console.log("Error fetching authors: ", error);
        setIsLoading(false);
      }
    };
    fetchAuthors();
  }, [id]);

  //! function to delete author account from DB
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
    } catch (error) {
      console.log("Error deleting author from DB: ", error);
    }
  };

  //!function to format the date for BirthDate field
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }

  const selectedAuthor = authors.find((author) => author._id === id);

  const userLogged = selectedAuthor && selectedAuthor._id === session.id;

  const fileInputRef = useRef(null);

  //! function to update pro-pic
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const [file, setFile] = useState(null);

  const handleAvatarUpdate = async (e) => {
    setFile(e.target.files[0]);

    if (e.target.files.length > 0) {
      const uploadedFile = await uploadFile(e.target.files[0]);

      if (uploadedFile) {
        try {
          const response = await axios.patch(
            `${process.env.REACT_APP_SERVERBASE_URL}/authors/${selectedAuthor._id}`,
            { avatar: uploadedFile.avatar },
            { headers: { "Content-Type": "application/json" } }
          );

          const updatedAuthors = authors.map((author) =>
            author._id === selectedAuthor._id ? { ...author, avatar: uploadedFile.avatar } : author
          );
          setAuthors(updatedAuthors);

          return response.data;
        } catch (error) {
          console.log("Error occurs updating author: ", error);
        }
      } else {
        console.error("File upoload failed");
      }
    }
  };

  //! function to upload pro-pic in cloudinary
  const uploadFile = async (file) => {
    const avatarData = new FormData();
    avatarData.append("avatar", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/authors/cloudUploadAvatar`,
        avatarData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Avatar upload error occurs: ", error);
    }
  };

  //! function to edit AuthorData
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedAuthorData, setEditedAuthorData] = useState({});

  useEffect(() => {
    if (!isLoading && selectedAuthor) {
      setEditedAuthorData({
        firstName: selectedAuthor.firstName,
        lastName: selectedAuthor.lastName,
        email: selectedAuthor.email,
        birthDate: selectedAuthor.birthDate,
      });
    }
  }, [isLoading, selectedAuthor]);

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
  };

  //? Toast for successful Author Edit Data
  const notify = () =>
    toast.success("Your data has been successfully updated.", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: `colored`,
    });

  const handleSaveChanges = async () => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVERBASE_URL}/authors/${selectedAuthor._id}`,
        editedAuthorData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const updatedAuthors = authors.map((author) =>
        author._id === selectedAuthor._id ? { ...author, ...editedAuthorData } : author
      );
      setAuthors(updatedAuthors);
      notify();

      setIsEditMode(false);

      return response.data;
    } catch (error) {
      console.log("Error updating author: ", error);
    }
  };

  return (
    <>
      {!selectedAuthor ? (
        <Alert className="text-center" variant="danger">
          OOOOOPS... seems like this page doesn't exists anymore!
        </Alert>
      ) : (
        <>
          <Container
            className={`d-flex flex-column ${theme === "light" ? "" : "text-light"}`}
            style={{ paddingTop: "10rem" }}
          >
            <section className="align-self-center">
              <h1 className="text-center">Hello World,</h1>
              <h2 className="text-center">
                {selectedAuthor.firstName} {selectedAuthor.lastName} here!
              </h2>
            </section>

            <section className="AuthorPageImgWrapper text-center align-self-center">
              <img
                src={selectedAuthor.avatar}
                alt=""
                style={{
                  borderRadius: "50%",
                  width: "300px",
                  height: "300px",
                  background: "#ffffff",
                  objectFit: "cover",
                }}
                className="my-5"
              />

              {userLogged && (
                <p className="changeAvatarIcon">
                  <TbRefresh onClick={handleIconClick} />
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarUpdate}
              />
            </section>

            <section className="mb-5">
              <h5 className="mb-3 d-flex align-items-center gap-3">
                Author information:{" "}
                {userLogged && (
                  <FiSettings className="userEditData" onClick={handleEditModeToggle} />
                )}
              </h5>

              <ul className="list-unstyled px-2">
                <li className="userData my-2" key={nanoid()}>
                  <BsPersonVcard /> <strong>Full Name: </strong>
                  {isEditMode ? (
                    <div className="editModeFields">
                      <input
                        type="text"
                        value={editedAuthorData.firstName}
                        style={{ maxWidth: "100px" }}
                        onChange={(e) =>
                          setEditedAuthorData({
                            ...editedAuthorData,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        value={editedAuthorData.lastName}
                        style={{ maxWidth: "100px" }}
                        onChange={(e) =>
                          setEditedAuthorData({
                            ...editedAuthorData,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  ) : (
                    `${selectedAuthor.firstName} ${selectedAuthor.lastName}`
                  )}
                </li>

                <li className="userData my-2" key={nanoid()}>
                  <HiOutlineMail /> <strong>Email :</strong>{" "}
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editedAuthorData.email}
                      onChange={(e) =>
                        setEditedAuthorData({
                          ...editedAuthorData,
                          email: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <span className="ms-2">
                      <a className="userEmail" href={`mailto:${selectedAuthor.email}`}>
                        {selectedAuthor.email}
                      </a>
                    </span>
                  )}
                </li>

                <li className="userData my-2" key={nanoid()}>
                  <HiOutlineCake /> <strong>Date of Birth :</strong>{" "}
                  {isEditMode ? (
                    <input
                      type="date"
                      value={editedAuthorData.birthDate}
                      onChange={(e) =>
                        setEditedAuthorData({ ...editedAuthorData, birthDate: e.target.value })
                      }
                    />
                  ) : (
                    <span className="ms-2">{formatDate(selectedAuthor.birthDate)}</span>
                  )}
                </li>

                <li className="userData my-2" key={nanoid()}>
                  <HiOutlineUser /> <strong>StriveID :</strong>{" "}
                  <span className="ms-2">{selectedAuthor._id}</span>
                </li>
              </ul>

              {userLogged && isEditMode && (
                <div className="d-flex align-items-center justify-content-start gap-2">
                  <Button variant="outline-success" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                  <Button variant="outline-danger" onClick={handleEditModeToggle}>
                    Cancel
                  </Button>
                </div>
              )}
            </section>

            <section className="mb-5" key={nanoid()}>
              <h5>{selectedAuthor.firstName}'s blogPosts: </h5>

              {selectedAuthor.blogPosts.length === 0 ? (
                <Alert variant="danger" className="text-center">
                  Attention: No blog posts available at the moment. Stay tuned for exciting content
                  coming soon!
                </Alert>
              ) : (
                selectedAuthor.blogPosts.map((post) => {
                  return (
                    <ul>
                      <li key={nanoid()}>
                        <Link className="linkToBlogPost" to={`/blogPage/${post._id}`}>
                          {post.title}
                        </Link>
                      </li>
                    </ul>
                  );
                })
              )}
            </section>

            {userLogged && (
              <Button
                variant="danger"
                className="d-flex align-items-center gap-3 justify-content-center mt-5"
                style={{ maxWidth: "400px" }}
                onClick={() => {
                  setShowModal(true);
                  setAuthorToDelete(selectedAuthor._id);
                }}
              >
                <HiOutlineTrash style={{ fontSize: "1.2rem" }} /> Delete my Account
              </Button>
            )}
          </Container>

          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {/* Same as */}
          <ToastContainer />

          {/* SECURITY MODAL TO DELETE PERMANENTELY ACCOUNT FROM DB */}
          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>DELETE ACCOUNT</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to permanently delete your account? This action is irreversible
              and all your data will be lost.
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
      )}
    </>
  );
};

export default AuthorPage;
