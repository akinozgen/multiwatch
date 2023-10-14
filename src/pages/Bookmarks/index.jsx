import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import "./index.scss";
import localStorageHelper from "~/actions/localStorage";
import axios from "axios";
import BookmarkUrl from "./BookmarkUrl";

function NewsGrid() {
  /**
   * newsItemObject: {
   *   type: 'url|directory',
   *   url: string,
   *   title: string,
   *   favicon: string,
   * }
   */
  const newsKey = "newsLinks";
  const newsLinksFromLocalStorage = localStorageHelper.loadState(newsKey);

  const [newsLinks, setNewsLinks] = useState(newsLinksFromLocalStorage || []);
  const [newURL, setNewURL] = useState("");

  const resolveTitle = async (url) => {
    try {
      const endpoint = "https://title-fetch-8c2f1e444cb3.herokuapp.com/?url=";
      const response = await axios.get(endpoint + url);
      const title = response.data;
      // convert &amp; to &, etc.
      const parser = new DOMParser();
      const dom = parser.parseFromString(
        "<!doctype html><body>" + title,
        "text/html"
      );
      return dom.body.textContent;
    } catch (error) {
      console.error(`Error fetching title for URL: ${url}`, error);
      return url; // Return the URL if the title cannot be fetched
    }
  };

  const resolveFavicon = (url) => {
    return `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
  };

  const addNewURL = async () => {
    const newsItemObject = {
      type: "url",
      url: newURL,
      title: null,
      favicon: null,
    };

    newsItemObject.title = await resolveTitle(newURL);
    newsItemObject.favicon = resolveFavicon(newURL);

    setNewsLinks([...newsLinks, newsItemObject]);
    setNewURL("");
  };

  const removeLink = (index, event) => {
    event.stopPropagation();
    const newNewsLinks = [...newsLinks];
    newNewsLinks.splice(index, 1);
    setNewsLinks(newNewsLinks);
  };

  const exportSettings = () => {
    const filename = prompt("Enter filename", "bookmarks");
    if (!filename) return;

    const combinedSettings = {
      [newsKey]: {
        newsLinks
      },
    };

    const blob = new Blob([JSON.stringify(combinedSettings)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.click();

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      const text = await file.text();
      const combinedSettings = JSON.parse(text);

      const newsLinks = combinedSettings[newsKey].newsLinks;
      setNewsLinks(newsLinks);
    };
  };

  useEffect(() => {
    localStorageHelper.saveState(newsKey, newsLinks);
  }, [newsLinks]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={4} sm={4} xs={4}>
            <Card className="mx-2 mb-4">
              <Card.Body>
                <Form.Group controlId="addNewURL">
                  <Form.Label>Add News URL</Form.Label>
                  <InputGroup>
                    <Form.Control
                      onChange={(e) => setNewURL(e.target.value)}
                      value={newURL}
                      type="text"
                      name="addNewURL"
                      placeholder="Enter URL"
                    />
                    <Button onClick={addNewURL} variant="primary" type="button">
                      ➕ Add
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} sm={8} xs={8}>
            <Card className="mx-2 mb-4">
              <Card.Body>
                <div>
                  <Form.Label>
                    <strong>Actions</strong>
                  </Form.Label>
                </div>
                <ButtonGroup>
                  <Button
                    variant="danger"
                    onClick={() => setNewsLinks([])}
                    size="sm"
                  >
                    🗑️ Clear All
                  </Button>
                  <Button variant="success" size="sm" onClick={exportSettings}>
                    🗃️ Export
                  </Button>
                  <Button variant="warning" size="sm" onClick={importSettings}>
                    📥 Import
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container fluid className="mb-4">
        {newsLinks.map((link, index) =>
          link.type === "url" ? (
            <BookmarkUrl
              key={index}
              index={index}
              link={link}
              onClick={(event) => removeLink(index, event)}
            />
          ) : (
            <>test</>
          )
        )}
      </Container>
    </>
  );
}

export default NewsGrid;
