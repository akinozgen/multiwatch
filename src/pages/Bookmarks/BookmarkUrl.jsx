import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

function BookmarkUrl({link, index, onClick }) {
  return (
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
              <Col className="flex-grow-0" style={{ minWidth: "fit-content" }}>
                <div className="d-inline-block">{link.title}</div>
              </Col>
              <Col className="flex-grow-1">
                <div className="d-inline-block text-muted">{link.url}</div>
              </Col>
              <Col className="flex-grow-0">
                <Button
                  variant="default"
                  onClick={onClick}
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
  );
}

export default BookmarkUrl;
