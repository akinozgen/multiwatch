import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import iconLicense from "../../icon-license.pdf";

export default function CreditsModal({ closeCreditsModal, showCreditsModal }) {
  return (
    <Modal show={showCreditsModal} onHide={closeCreditsModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Credits</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>📦 Source: </strong>
          <a href="https://github.com/akinozgen/multiwatch" target="_blank">
            GitHub / @akinozgen / multiwatch
          </a>
        </p>

        <p>
          <strong>🧑‍💻 My GitHub Profile: </strong>
          <a href="https://github.com/akinozgen" target="_blank">
            @akinozgen
          </a>
        </p>

        <div>
          <strong>🤝 Open Source Libraries Used:</strong>
          <ul>
            <li>
              <a href="https://react.dev" target="_blank">
                React by Facebook
              </a>
            </li>
            <li>
              <a href="https://react-bootstrap.github.io" target="_blank">
                React Bootstrap
              </a>
            </li>
            <li>
              <a href="https://vitejs.dev" target="_blank">
                Vite by Evan You
              </a>
            </li>
          </ul>
        </div>

        <p>
          <strong>📜 Favicon: </strong>
          <a href="./icon-license.pdf" target="_blank">
            Designed by Muhammad Atif from Flaticon
          </a>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeCreditsModal}>
          ❌ Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
