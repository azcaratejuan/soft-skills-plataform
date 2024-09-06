import React, { useEffect, useRef, useState } from "react";
import { Vision ,FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import hand_landmarker_task from "./hand_landmarker.task";
import Select from 'react-select';
import './video.css'; // Asegúrate de incluir los estilos CSS
import blue from './music/techno-beats-blue-eyes-10493.mp3';
import echo from './music/techno-beats-echo-light-10563.mp3';
import unshine from './music/techno-beats-unshine-star-10564.mp3';
import 'text-encoding-polyfill';
import ResponsiveAppBar from "../../responsiveappbar/ResponsiveAppBar";

const options = [
  { value: 'blue', label: 'Techno Beats Blue', numberSequence: [2, 3, 5, 7, 6, 4, 1, 3, 2, 7, 5, 6, 1, 4, 3, 2, 5, 6, 7, 1, 4, 2, 3, 5, 6, 7, 1, 2, 4, 3, 6, 5, 7, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 5, 4, 6, 7, 1, 2, 4, 5, 3, 6, 7, 1, 2, 3, 4, 6, 5, 7, 1, 2, 3, 4, 5, 6, 7, 1, 3, 5, 2, 6, 4, 7, 1, 2, 3, 4, 5, 6, 7]
    ,srcMusic: blue
  },
  { value: 'echo', label: 'Techno Beats Echo', numberSequence: [4, 7, 2, 6, 3, 1, 5, 2, 6, 7, 4, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 7, 2, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5, 2, 7, 4, 6, 3, 1, 5]
    ,srcMusic: echo
   },
  { value: 'unshine', label: 'Techno Beats Unshine', numberSequence: [6, 4, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3, 4, 6, 1, 7, 2, 5, 3]
    ,srcMusic: unshine
   },
   { value: 'song4', label: 'Song 4', numberSequence: [6, 4, 1]
    ,srcMusic: unshine
   }
];

const images = [
  {
    src: "https://drive.google.com/thumbnail?id=1IrV0oJtLxLbPAH3ri-4e_ipYhEc9LzD8",
    animation: "slideFromRight",
    id: 1
  },
  {
    src: "https://drive.google.com/thumbnail?id=10BSIJhbVhryUAyt4JOv8H4TBN6Ly8mIF",
    animation: "slideFromRight",
    id: 0
  },
  {
    src: "https://drive.google.com/thumbnail?id=1W3yXl9QKn6GK9ewBLyyRz28DL--qrhgK",
    animation: "slideFromRight",
    id: 3
  },
  {
    src: "https://drive.google.com/thumbnail?id=1WkVFeD3sNASf_i-FpNqQmVPd-ojeazt3",
    animation: "slideFromRight",
    id: 6
  },
  {
    src: "https://drive.google.com/thumbnail?id=1UjCixEmZe1aflBVJ5R-gqv4zFLMf8LJv",
    animation: "slideFromLeft",
    id: 8
  },
  {
    src: "https://drive.google.com/thumbnail?id=1rZdDJk2Rw7eJc0ia7YPvdMNEO5RvT-gp",
    animation: "slideFromLeft",
    id: 5
  },
  {
    src: "https://drive.google.com/thumbnail?id=1c7r42B85oamsaLNRiLFcMkMmZP60dYvw",
    animation: "slideFromLeft",
    id: 2
  }
];

const ImageAnimation = ({ imageSrc, animationClass, onAnimationEnd }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener('animationend', onAnimationEnd);

      return () => {
        element.removeEventListener('animationend', onAnimationEnd);
      };
    }
  }, [onAnimationEnd]);

  return (
    <div ref={elementRef} className={`image-animation ${animationClass}`}>
      <img src={imageSrc} alt="Animated" />
    </div>
  );
};

const Video = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const [activeSections, setActiveSections] = useState(new Array(9).fill(false));
  const [animations, setAnimations] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef();
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const initializeHandDetection = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(
          vision, {
            baseOptions: { modelAssetPath: hand_landmarker_task },
            numHands: 2,
            runningMode: "video"
          }
        );
        detectHands();
      } catch (error) {
        console.error("Error initializing hand detection:", error);
      }
    };

    const detectHands = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        const detections = handLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());

        if (detections.landmarks) {
          const newActiveSections = new Array(9).fill(false);
          const canvasWidth = canvasRef.current.width;
          const canvasHeight = canvasRef.current.height;
          const sectionWidth = canvasWidth / 3;
          const sectionHeight = canvasHeight / 3;

          detections.landmarks.forEach((landmarks) => {
            landmarks.forEach((landmark) => {
              const x = landmark.x * canvasWidth;
              const y = landmark.y * canvasHeight;
              const col = Math.floor(x / sectionWidth);
              const row = Math.floor(y / sectionHeight);
              const sectionIndex = row * 3 + col;

              if (sectionIndex !== 4 && sectionIndex !== 7) {
                newActiveSections[sectionIndex] = true;
              }
            });
          });

          const activeCount = newActiveSections.filter(Boolean).length;
          if (activeCount > 2) {
            let count = 0;
            for (let i = 0; i < newActiveSections.length; i++) {
              if (newActiveSections[i]) {
                count++;
                if (count > 2) {
                  newActiveSections[i] = false;
                }
              }
            }
          }

          setActiveSections(newActiveSections);
          drawOverlaysAndLandmarks(newActiveSections, detections.landmarks);
        }
      }
      requestAnimationFrame(detectHands);
    };

    const drawOverlaysAndLandmarks = (activeSections, landmarksArray) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';

      const sectionWidth = canvas.width / 3;
      const sectionHeight = canvas.height / 3;
      const colors = ['red', 'green', 'blue', 'purple', 'orange', 'pink', 'brown', 'cyan', 'magenta'];

      activeSections.forEach((isActive, index) => {
        if (isActive) {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const centerX = col * sectionWidth + sectionWidth / 2;
          const centerY = row * sectionHeight + sectionHeight / 2;
          const radius = (Math.min(sectionWidth, sectionHeight) / 2) * 0.7;

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fillStyle = colors[index];
          ctx.fill();
          ctx.stroke();
        }
      });

      for (let index = 0; index < 9; index++) {
        if (index === 4 || index === 7) {
          continue;
        }

        const col = index % 3;
        const row = Math.floor(index / 3);
        const centerX = col * sectionWidth + sectionWidth / 2;
        const centerY = row * sectionHeight + sectionHeight / 2;
        const radius = (Math.min(sectionWidth, sectionHeight) / 2) * 0.8;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "black";
      }
      ctx.fillStyle = 'white';
      landmarksArray.forEach(landmarks => {
      landmarks.forEach(landmark => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
      });
      });
    };

    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        await initializeHandDetection();
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && selectedSong) {
  
      const audio = audioRef.current;
      audio.src = selectedSong.srcMusic;
      audio.volume = 0.4;
      audio.play();
      
      let index = 0;
      const sequenceLength = selectedSong.numberSequence.length;

      intervalRef.current = setInterval(() => {
        if (index < sequenceLength) {
          const sequenceIndex = index;
          const imageIndex = selectedSong.numberSequence[sequenceIndex] - 1;
          const newAnimation = {
            date: Date.now(),
            id: images[imageIndex].id,
            src: images[imageIndex].src,
            animationClass: images[imageIndex].animation
          };

          setAnimations(prevAnimations => [...prevAnimations, newAnimation]);
          index++;
        } else {
          clearInterval(intervalRef.current);
          setFinished(true);
          
        }
      }, 2000);
    } else {
      const audio = audioRef.current;
      audio.pause();
      clearInterval(intervalRef.current);
    }

    return () => {
      const audio = audioRef.current;
      audio.pause();
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, selectedSong]);

  const handleSongChange = (selectedOption) => {
    setSelectedSong(selectedOption);
    handleStop();
    setFinished(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setScore(0);
    setFinished(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setFinished(false);
  };

  const handleAnimationEnd = (sectionIndex) => {
    console.log("Animation ended for section:", sectionIndex);
    const activeSectionIndex = activeSections.findIndex((isActive, index) => isActive && index === sectionIndex);
    if (activeSectionIndex !== -1) {
      setScore(prevScore => prevScore + 50);
    }
  };

  return (
    
    <div className="hidden-scroll" style={{ position: "absolute", width: '100%', height: '100%' }}>
      <ResponsiveAppBar />
      
      <div className="options">
        <Select
          options={options}
          onChange={handleSongChange}
          style={{
            marginBottom: '10px',
            zIndex: 10,
            position: 'relative'
          }}
        />
      </div>

      <button className="play" onClick={isPlaying ? handleStop : handlePlay}>
        {isPlaying ? "Stop" : "Play"}
      </button>

      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
        <video ref={videoRef} autoPlay playsInline
          style={{
            display: 'block',
            border: '1px solid black',
            width: 640,
            height: 480,
            transform: 'scaleX(-1)',
          }}
        />
        <canvas ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 640,
            height: 480,
            transform: 'scaleX(-1)',
            pointerEvents: 'none'
          }}
        />
      </div>

      {animations.map((animation) => (
        <ImageAnimation
          key={animation.id}
          imageSrc={animation.src}
          animationClass={animation.animationClass}
          onAnimationEnd={() => handleAnimationEnd(animation.id)}
        />
      ))}
    {!finished && (
      <div className="score">
        Score: {score}
      </div>
    )}

      {finished && (
        <div className="final-score">
          Final Score: {score}
        </div>
      )}
    </div>
  );
};

export default Video;