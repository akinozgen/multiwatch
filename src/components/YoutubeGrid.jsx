import React, { useState, useEffect } from "react";
import "./YoutubeGrid.scss";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import localStorageHelper from "../actions/localStorage";
import SettingsModal from "./SettingsModal";

function YoutubeGrid() {
  const storageKey = "youtube-grid";
  const settingsKey = "youtube-grid-settings";
  const initialState = localStorageHelper.loadState(storageKey);
  const initialSettings = localStorageHelper.loadState(settingsKey);
  let fileInputRef = null;

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [rows, setRows] = useState(initialState?.rows || 2);
  const [columns, setColumns] = useState(initialState?.columns || 2);
  const [url, setUrl] = useState("");
  const [textInputs, setTextInputs] = useState(
    Array.from({ length: rows * columns }, () => "")
  );

  const [videos, setVideos] = useState(
    initialState?.videos || Array.from({ length: rows * columns }, () => "")
  );

  const setVideo = (index, url) => {
    // if url has watch
    if (url.includes("watch?v=")) {
      const videoId = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
      )?.[1];
    } else if (url.includes("embed")) {
      const videoId = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:embed\/)?(.+)/
      )?.[1];
    } else if (url.includes("youtu.be")) {
      const videoId = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(.+)/
      )?.[1];
    } else {
      const videoId = url;
    }

    const newVideos = [...videos];
    newVideos[index] = videoId;
    setVideos(newVideos);
  };

  useEffect(() => {
    localStorageHelper.saveState(storageKey, {
      rows,
      columns,
      videos,
    });
  }, [videos, rows, columns, textInputs]);

  const [embedSettings, setEmbedSettings] = useState(
    initialSettings?.settings || {
      autoplay: {
        name: "Autoplay",
        value: 1,
      },
      fs: {
        name: "Fullscreen",
        value: 0,
      },
      mute: {
        name: "Mute",
        value: 1,
      },
      modestbranding: {
        name: "No YouTube Logo",
        value: 1,
      },
      rel: {
        name: "No Related Videos",
        value: 0,
      },
      "privacy-enhanced": {
        name: "Privacy Enhanced Mode",
        value: 1,
      },
    }
  );

  useEffect(() => {
    localStorageHelper.saveState(settingsKey, {
      settings: embedSettings,
    });
  }, [embedSettings]);

  // create a computed property that will be used to generate the embed URL params
  const embedSettingsString =
    Object.entries(embedSettings)
      .map(([key, value]) => `${key}=${value.value}`)
      .join("&") + `&iv_load_policy=3`;

  const deleteVideo = (index) => {
    const newVideos = [...videos];
    newVideos[index] = "";
    setVideos(newVideos);
  };

  const handleTextInputChange = (index, value) => {
    const newInputs = [...textInputs];
    newInputs[index] = value;
    setTextInputs(newInputs);
  };

  const openSettingsModal = () => {
    setShowSettingsModal(true);
  };

  const closeSettingsModal = () => {
    setShowSettingsModal(false);
  };

  const videoGridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridGap: "1rem",
    width: "100%",
    height: "100%",
  };

  const exportSettings = () => {
    const combinedSettings = {
      [storageKey]: {
        rows,
        columns,
        videos,
      },
      [settingsKey]: {
        settings: embedSettings,
      },
    };

    const blob = new Blob([JSON.stringify(combinedSettings)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "youtube-grid-settings.json";
    link.click();

    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
    if (fileInputRef) {
      fileInputRef.click();
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedSettings = JSON.parse(event.target.result);
          if (
            importedSettings &&
            importedSettings["youtube-grid"] &&
            importedSettings["youtube-grid-settings"]
          ) {
            const { rows, columns, videos } = importedSettings["youtube-grid"];
            const { settings } = importedSettings["youtube-grid-settings"];

            // Apply imported settings
            setRows(rows);
            setColumns(columns);
            setVideos(videos);
            setEmbedSettings(settings);

            // Save imported settings to local storage
            localStorageHelper.saveState(storageKey, {
              rows,
              columns,
              videos,
            });
            localStorageHelper.saveState(settingsKey, {
              settings,
            });
          } else {
            alert("Invalid settings file format.");
          }
        } catch (error) {
          alert("Error importing settings file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const resetSettings = async () => {
    const answer = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (!answer) return;
      
    localStorageHelper.clearState(storageKey);
    localStorageHelper.clearState(settingsKey);

    window.location.reload();
  };

  return (
    <div className="youtube-grid mx-2 my-2">
      <SettingsModal
        closeSettingsModal={closeSettingsModal}
        showSettingsModal={showSettingsModal}
        setEmbedSettings={setEmbedSettings}
        embedSettings={embedSettings}
      />
      <Container fluid className="controls">
        <Row>
          <Col>
            <Container fluid>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Rows"
                    value={rows}
                    onChange={(e) => setRows(e.target.value)}
                    min={1}
                    max={10}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Columns"
                    value={columns}
                    onChange={(e) => setColumns(e.target.value)}
                    min={1}
                    max={10}
                  />
                </Col>
                <Col md={2} sm={2}>
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openSettingsModal}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={exportSettings}
                    >
                      Export
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={importSettings}
                    >
                      Import
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={resetSettings}
                    >
                      Reset
                    </Button>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".json"
                      style={{ display: "none" }}
                      onChange={handleFileInputChange}
                      ref={(input) => (fileInputRef = input)}
                    />
                  </ButtonGroup>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <Container className="video-grid pt-3" style={videoGridStyle} fluid>
        {Array.from({ length: rows * columns }).map((_, index) => (
          <div key={index} className="video-item">
            {videos[index] ? (
              <>
                <Button
                  variant="danger"
                  size="sm"
                  className="delete-button rounded-circle"
                  onClick={() => deleteVideo(index)}
                >
                  &times;
                </Button>
                <iframe
                  width="100%"
                  height="100%"
                  style={{ aspectRatio: "16/9" }}
                  src={`https://www.youtube.com/embed/${videos[index]}?${embedSettingsString}`}
                  allowFullScreen
                  title={`Video ${index}`}
                ></iframe>
              </>
            ) : (
              <div className="black-square">
                <Form.Control
                  type="text"
                  placeholder="Paste YouTube URL"
                  value={textInputs[index]}
                  onChange={(e) => setVideo(index, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}
      </Container>
    </div>
  );
}

export default YoutubeGrid;
