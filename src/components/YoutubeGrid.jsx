import React, { useState, useEffect } from "react";
import "./YoutubeGrid.scss";
import {
  Button,
  ButtonGroup,
  Col,
  Collapse,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import localStorageHelper from "../actions/localStorage";
import SettingsModal from "./SettingsModal";
import CreditsModal from "./CreditsModal";

function YoutubeGrid() {
  const storageKey = "youtube-grid";
  const settingsKey = "youtube-grid-settings";
  const initialStateFromURL = new URLSearchParams(window.location.search).get("v");
  const initialState = initialStateFromURL ? JSON.parse((initialStateFromURL))[storageKey] : localStorageHelper.loadState(storageKey);

  const initialSettings = initialStateFromURL ? JSON.parse((initialStateFromURL))[settingsKey] : localStorageHelper.loadState(settingsKey);
  let fileInputRef = null;
  const cheatCode = 'sakinol';
  const [keySequence, setKeySequence] = useState([]);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [rows, setRows] = useState(initialState?.rows || 2);
  const [columns, setColumns] = useState(initialState?.columns || 2);
  const [url, setUrl] = useState("");
  const [textInputs, setTextInputs] = useState(
    Array.from({ length: rows * columns }, () => "")
  );

  const [videos, setVideos] = useState(
    initialState?.videos || Array.from({ length: rows * columns }, () => "")
  );

  // listen key down and check if it is the cheat code
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { key } = e;
      const newKeySequence = [...keySequence, key];
      setKeySequence(newKeySequence);

      if (newKeySequence.join('').includes(cheatCode)) {
        setKeySequence([]);
        // play https://p4rrot.com/clips/9062f370-4576-4475-82aa-9a3c65482ebe.mp4 on full screen and remove video elements
        const video = document.createElement('video');
        video.src = 'https://p4rrot.com/clips/9062f370-4576-4475-82aa-9a3c65482ebe.mp4';
        video.autoplay = true;
        video.loop = false;
        video.controls = false;
        video.style.position = 'fixed';
        video.style.top = 0;
        video.style.left = 0;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        
        video.addEventListener('ended', () => {
          video.remove();
        });

        document.body.appendChild(video);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [keySequence]);

  const setVideo = (index, url) => {
    let videoId = "";
    // if url has watch
    if (url.includes("watch?v=")) {
      videoId = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/
      )?.[1];

      videoId = videoId.split("&")[0];
    } else if (url.includes("embed")) {
      videoId = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:embed\/)?(.+)/
      )?.[1];

      videoId = videoId.split("?")[0];
    } else if (url.includes("youtu.be")) {
      videoId = url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(.+)/
      )?.[1];

      videoId = videoId.split("?")[0];
    } else {
      videoId = url;
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

    updateURL();
  }, [videos, rows, columns, textInputs]);

  const updateURL = () => {
    const queryParams = new URLSearchParams();
    const value = {
      [storageKey]: { rows, columns, videos },
      [settingsKey]: { settings: embedSettings },
    };
    queryParams.set("v", (JSON.stringify(value)));

    window.history.replaceState(null, null, `?${queryParams.toString()}`);
  };

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

  const openCreditsModal = () => {
    setShowCreditsModal(true);
  };

  const closeCreditsModal = () => {
    setShowCreditsModal(false);
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

  const copyShareableLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);

    alert("Copied to clipboard!");
  };

  const resetSettings = async () => {
    const answer = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (!answer) return;

    localStorageHelper.clearState(storageKey);
    localStorageHelper.clearState(settingsKey);
    
    // clear v= query param
    window.history.replaceState(null, null, `?`);
    window.location.reload();
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="youtube-grid mx-2 my-2">
      <SettingsModal
        closeSettingsModal={closeSettingsModal}
        showSettingsModal={showSettingsModal}
        setEmbedSettings={setEmbedSettings}
        embedSettings={embedSettings}
      />

      <CreditsModal showCreditsModal={showCreditsModal} closeCreditsModal={closeCreditsModal} />

      <Container fluid className="controls mx-2">
        <Row>
          <Col>
            <p
              className="clickable-text"
              onClick={() => setCollapsed(!collapsed)}
            >
              <span>{collapsed ? "🔼 " : "🔽 "}</span>
              <span>{collapsed ? "Hide" : "Show"} Controls</span>
            </p>
          </Col>
        </Row>
      </Container>

      <Collapse in={collapsed} className="mx-2">
        <Container fluid >
          <Row>
            <Col md={2} sm={12}>
              <Form.Group controlId="columnsInput">
                <Form.Label>
                  <strong>
                    Columns <small>(1-10)</small>
                  </strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Rows"
                  value={rows}
                  onChange={(e) => setRows(e.target.value)}
                  min={1}
                  max={10}
                />
              </Form.Group>
            </Col>
            <Col md={2} sm={12}>
              <Form.Group controlId="rowsInput">
                <Form.Label>
                  <strong>
                    Rows <small>(1-10)</small>
                  </strong>
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Columns"
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                  min={1}
                  max={10}
                />
              </Form.Group>
            </Col>
            <Col md={4} sm={12}>
              <Form.Group controlId="actions">
                <Form.Label>
                  <strong>Actions</strong>
                </Form.Label>
                <div>
                  <ButtonGroup>
                    <Button variant="info" size="sm" onClick={copyShareableLink}>
                      📤 Share
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openSettingsModal}
                    >
                      ⚙️ Settings
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={exportSettings}
                    >
                      🗃️ Export
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={importSettings}
                    >
                      📥 Import
                    </Button>
                    <Button variant="danger" size="sm" onClick={resetSettings}>
                      🗑️ Reset
                    </Button>
                    <Button variant="secondary" size="sm" onClick={openCreditsModal}>
                      🙏 Credits
                    </Button>
                  </ButtonGroup>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Collapse>
      <input
        type="file"
        id="fileInput"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
        ref={(input) => (fileInputRef = input)}
      />

      <Container className="video-grid pt-3 mx-2" style={videoGridStyle} fluid>
        {Array.from({ length: rows * columns }).map((_, index) => (
          <Col key={index} className="video-item">
            {videos[index] ? (
              <>
                <span
                  variant="danger"
                  size="sm"
                  href="javascript:void(0)"
                  className="delete-button clickable-text hidden-overlay"
                  onClick={() => deleteVideo(index)}
                >
                  ❌
                </span>
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
          </Col>
        ))}
      </Container>
    </div>
  );
}

export default YoutubeGrid;
