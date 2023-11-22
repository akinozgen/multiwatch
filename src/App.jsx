import { useEffect, useState } from "react";
import "./App.css";
import YoutubeGrid from "~/pages/YoutubeGrid";
import Bookmarks from "~/pages/Bookmarks";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Col, Container, Nav, Navbar, Row } from "react-bootstrap";
import CreditsModal from "~/components/CreditsModal";

import favicon from "../favicon.png";
import NotFoundPage from "~/pages/404";

function App() {
  const cheatCode = "sakinol";
  const [keySequence, setKeySequence] = useState([]);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  const openCreditsModal = () => {
    setShowCreditsModal(true);
  };

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
  };

  // listen key down and check if it is the cheat code
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      const newKeySequence = [...keySequence, key];
      setKeySequence(newKeySequence);

      if (newKeySequence.join("").includes(cheatCode)) {
        setKeySequence([]);
        const video = document.createElement("video");
        video.src =
          "https://p4rrot.com/clips/9062f370-4576-4475-82aa-9a3c65482ebe.mp4";
        video.autoplay = true;
        video.loop = false;
        video.controls = false;
        video.style.position = "fixed";
        video.style.top = 0;
        video.style.left = 0;
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "contain";

        video.addEventListener("ended", () => {
          video.remove();
        });

        document.body.appendChild(video);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keySequence]);

  const domain = window.location.hostname;

  const RouterPage = (
    <BrowserRouter>
      <Navbar expand="lg">
        <Container fluid className="mx-3">
          <Navbar.Brand href="#home">
            <img
              src={favicon}
              alt="Multiwatch"
              width="20"
              height="20"
              className="d-inline-block align-top mt-2 mr-2"
            />
            <div className="d-inline-block ml-2">Multiwatch</div>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link>
                <Link to="/">YouTube</Link>
              </Nav.Link>
              <Nav.Link>
                <Link to="/bookmarks">Bookmarks</Link>
              </Nav.Link>
              <Nav.Link>
                <a href="javascript:void(0)" onClick={openCreditsModal}>Credits</a>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route index path="/" element={<YoutubeGrid />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      
      <CreditsModal
        showCreditsModal={showCreditsModal}
        closeCreditsModal={closeCreditsModal}
      />

    </BrowserRouter>
  );

  return (
    <>
      {domain.includes("github") ? (
        <Container fluid>
          <Row className="mx-3 mt-4">
            <Col>
              <p>
              ✨ Try new website: <a href="https://multiwatchao.netlify.app/" target="_blank" rel="noreferrer">Multiwatch on Netlify</a>
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
            <YoutubeGrid />
            </Col>
          </Row>
        </Container>
      ) : (
        RouterPage
      )}
    </>
  );
}

export default App;
