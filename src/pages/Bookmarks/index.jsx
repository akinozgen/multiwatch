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


function NewsGrid() {
  /**
   * newsItemObject: {
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
      const endpoint = 'https://title-fetch-8c2f1e444cb3.herokuapp.com/?url=';
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
                </ButtonGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container fluid className="mb-4">
        {newsLinks.map((link, index) => (
          <Row className="mb-2" key={index}>
            <Col>
              <Card
                className="mx-2 clickable-card"
                onClick={() => window.open(link.url, "_blank")}
              >
                <Card.Body>
                  <Row className="d-flex align-items-center">
                    <Col className="flex-grow-0">
                      <div className="mr-2">
                        <img
                          src={link.favicon}
                          alt="favicon"
                          width={20}
                          height={20}
                        />
                      </div>
                    </Col>
                    <Col
                      className="flex-grow-0"
                      style={{ minWidth: "fit-content" }}
                    >
                      <div className="d-inline-block">{link.title}</div>
                    </Col>
                    <Col className="flex-grow-1">
                      <div className="d-inline-block text-muted">
                        {link.url}
                      </div>
                    </Col>
                    <Col className="flex-grow-0">
                      <Button
                        variant="default"
                        onClick={(event) => removeLink(index, event)}
                        className="float-end"
                      >
                        ❌
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))}
      </Container>
    </>
  );
}

export default NewsGrid;
