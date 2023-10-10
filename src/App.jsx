import { useEffect, useState } from "react";
import "./App.css";
import YoutubeGrid from "./components/YoutubeGrid";
import NewsGrid from "./components/NewsGrid";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Container, Nav, Navbar, Row } from "react-bootstrap";

import favicon from "../favicon.png";

function App() {
  const [count, setCount] = useState(0);
  const cheatCode = "sakinol";
  const [keySequence, setKeySequence] = useState([]);

  // listen key down and check if it is the cheat code
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      const newKeySequence = [...keySequence, key];
      setKeySequence(newKeySequence);

      if (newKeySequence.join("").includes(cheatCode)) {
        setKeySequence([]);
        // play https://p4rrot.com/clips/9062f370-4576-4475-82aa-9a3c65482ebe.mp4 on full screen and remove video elements
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

  return (
    <>
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
                  <Link to="/news">News</Link>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route index path="/" element={<YoutubeGrid />} />
          <Route path="/news" element={<NewsGrid />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
