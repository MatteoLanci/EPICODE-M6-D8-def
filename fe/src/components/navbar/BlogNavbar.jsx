import React, { useContext, useState } from "react";

//! LIBRARIES IMPORT
import { Button, Container, Navbar, ListGroup, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";

//! ASSETS IMPORT
import logoDark from "../../assets/logo.png";
import logoLight from "../../assets/logo_white.png";

//! CSS IMPORT
import "./styles.css";

//! ICONS IMPORT
import { TbBulbOff, TbBulb } from "react-icons/tb";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

//! CONTEXT IMPORT
import { ThemeContext } from "../../context/themeContext";
import { useSession } from "../../middlewares/ProtectedRoutes";

const NavBar = (props) => {
  const { theme, handleTheme } = useContext(ThemeContext);
  const session = useSession();
  // console.log(session);

  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenu = () => {
    setShowMenu(true);
  };
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    setShowMenu(false);
  };

  return (
    <Navbar
      expand="lg"
      className="blog-navbar"
      fixed="top"
      bg={theme === "light" ? "light" : "dark"}
    >
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/homepage">
          <img
            className="blog-navbar-brand"
            alt="logo"
            src={theme === "light" ? logoDark : logoLight}
          />
        </Navbar.Brand>
        <div className="d-flex justify-content-between align-items-center gap-2">
          {session && (
            <>
              <Button onClick={handleShowMenu} className="navbarTriggerMenu">
                <img
                  src={session.avatar || session.photos[0].value}
                  alt={session.firstName}
                  className="userNavbar"
                />
              </Button>

              <Link to={"/"}>
                <FiLogOut
                  className={`logoutIcon ${theme === "light" ? "text-danger" : "text-warning"}`}
                  onClick={handleLogout}
                />
              </Link>
            </>
          )}

          {theme === "light" ? (
            <TbBulbOff style={{ fontSize: "2rem" }} onClick={() => handleTheme()} />
          ) : (
            <TbBulb style={{ fontSize: "2rem", color: "white" }} onClick={() => handleTheme()} />
          )}
        </div>
      </Container>

      {session && (
        <Offcanvas
          show={showMenu}
          onHide={handleCloseMenu}
          placement="end"
          className="navbarMenu bg-light "
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="text-center mb-5">
              <img
                src={session.avatar || session.photos[0].value}
                alt={session.firstName}
                className="menuProPic"
              />
              <h4 className="mt-3">
                {session.firstName || session.displayName} {session.lastName}
              </h4>
            </div>

            <ListGroup>
              <ListGroup.Item
                className="menuItem bg-light"
                as={Link}
                to={`/authorPage/${session.id}`}
                onClick={handleCloseMenu}
              >
                <FaUser /> Profile
              </ListGroup.Item>
              <ListGroup.Item className="menuItem bg-light" disabled>
                <FiSettings />
                Settings
              </ListGroup.Item>
              <ListGroup.Item className="menuItem bg-light" disabled>
                <BiSupport />
                Support
              </ListGroup.Item>
              <ListGroup.Item
                className="menuItem mt-3 text-light bg-danger"
                onClick={handleLogout}
                as={Link}
                to={"/"}
              >
                <FiLogOut />
                Logout
              </ListGroup.Item>
            </ListGroup>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </Navbar>
  );
};

export default NavBar;
