import { useRef, useEffect } from "react";
import * as Phaser from "phaser";
import MainScene from "./scenes/Main/MainScene";
import LoadingScene from "./scenes/Loading/LoadingScene";
import LandingScene from "./scenes/Landing/LandingScene";

const Game = () => {
  const gameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: "100%",
      height: "100%",
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      fullscreenTarget: document.documentElement,
      fullscreen: {
        resizeCameras: true,
      },
      zoom: window.devicePixelRatio,
      parent: "phaser-game",
      backgroundColor: "#264a89",
      // scene: [LandingScene, MainScene, EditorScene, LoadingScene],
      scene: [MainScene],
      pixelArt: true,
      render: {
        antialias: true,
        pixelArt: true,
        roundPixels: true,
      },
    };

    const game = new Phaser.Game(config);

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, [gameRef]);

  return <div ref={gameRef} id="phaser-game" />;
};

export default Game;