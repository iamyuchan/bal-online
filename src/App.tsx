import { useState, useEffect, useRef } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Helmet } from "react-helmet-async";
import './App.css';
import Tracker from '@openreplay/tracker';

const tracker = new Tracker({
    projectKey: "TNH06Vayxj5HNCea1U2a",
});

export function App() {
  const { unityProvider, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "https://bal-online-unity-build.host-r2.abcpizza.rest/thefoot.loader.js",
    dataUrl: "https://bal-online-unity-build.host-r2.abcpizza.rest/thefoot.data",
    frameworkUrl: "https://bal-online-unity-build.host-r2.abcpizza.rest/thefoot.framework.js",
    codeUrl: "https://bal-online-unity-build.host-r2.abcpizza.rest/thefoot.wasm",
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    try {
      tracker.start();
    } catch (error) {
      console.warn("Tracker failed to start:", error);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const calculateFps = () => {
      frameCountRef.current++;
      const currentTime = Date.now();
      const elapsed = currentTime - lastTimeRef.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      requestAnimationFrame(calculateFps);
    };

    const animationId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
      <div className="app">
          <Helmet>
              <title>The Foot - Online Game</title>
              <meta name="description" content="좌호빈발게임" />

              <meta property="og:type" content="website" />
              <meta property="og:title" content="발.online" />
              <meta property="og:description" content="좌호빈발게임" />
              <meta property="og:url" content={window.location.href} />
              <meta property="og:site_name" content="The Foot" />
              <meta property="og:image" content="https://bal-online-unity-build.host-r2.abcpizza.rest/foot.jpeg" />
              <meta property="og:image:width" content="1200" />
              <meta property="og:image:height" content="630" />

              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="발.online" />
              <meta name="twitter:description" content="좌호빈발게임" />
              <meta name="twitter:image" content="https://bal-online-unity-build.host-r2.abcpizza.rest/foot.jpeg" />
          </Helmet>

          {!isLoaded && (
              <div className="loading-overlay">
                  <div className="loading-container">
                      <div className="loading-spinner"></div>
                      <h2 className="loading-title">The Foot</h2>
                      <div className="loading-bar-container">
                          <div
                              className="loading-bar"
                              style={{width: `${loadingProgression * 100}%`}}
                          ></div>
                      </div>
                      <p className="loading-text">
                          Loading... {Math.round(loadingProgression * 100)}%
                      </p>
                  </div>
              </div>
          )}

          <div className="game-container">
              <div className="header">
                  <h1>The Foot</h1>
                  <div className="fps-counter">FPS: {fps}</div>
                  <button
                      className="fullscreen-btn"
                      onClick={toggleFullscreen}
                      title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                      {isFullscreen ? "EXIT" : "FULL"}
                  </button>
              </div>

              <Unity
                  unityProvider={unityProvider}
                  className="unity-canvas"
                  style={{
                      width: isFullscreen ? "100%" : "960px",
                      height: isFullscreen ? "100%" : "600px",
                      visibility: isLoaded ? "visible" : "hidden"
                  }}
              />
          </div>

          <footer className="footer">
              <p>&copy; 1994-{new Date().getFullYear()} 좌호빈. All Rights Reserved.</p>
          </footer>
      </div>
  );
}
