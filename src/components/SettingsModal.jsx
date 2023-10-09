import React from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function SettingsModal({
  showSettingsModal,
  setEmbedSettings,
  closeSettingsModal,
  embedSettings,
}) {

  return (
    <Modal show={showSettingsModal} onHide={closeSettingsModal}>
      <Modal.Header closeButton>
        <Modal.Title>Embed Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.entries(embedSettings).map(([key, value]) => (
          <Form.Group controlId={`formBasicCheckbox${key}`} key={key}>
            <Form.Check
              type="checkbox"
              label={value.name}
              checked={value.value}
              onChange={(e) => {
                setEmbedSettings({
                  ...embedSettings,
                  [key]: {
                    ...value,
                    value: e.target.checked ? 1 : 0,
                  },
                });
              }}
            />
          </Form.Group>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeSettingsModal}>
          ❌ Close
        </Button>
        <Button
          variant="primary"
          onClick={closeSettingsModal}
        >
          💾 Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
