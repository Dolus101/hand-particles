let particles = [];
let handX = 0;
let handY = 0;
let handDetected = false;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
  }

  update() {
    if (handDetected) {
      // SNAP DIRECTLY TO HAND DIRECTION
      this.pos.x += (handX - this.pos.x) * 0.35;
      this.pos.y += (handY - this.pos.y) * 0.35;
    }
  }

  show() {
    noStroke();
    fill(0, 255, 255);
    circle(this.pos.x, this.pos.y, 3);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // VERY LOW CPU COST
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }

  const video = document.getElementById("video");

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0, // FASTEST
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks.length > 0) {
      const index = results.multiHandLandmarks[0][8];
      handX = index.x * width;
      handY = index.y * height;
      handDetected = true;
    } else {
      handDetected = false;
    }
  });

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

function draw() {
  background(0);
  for (let p of particles) {
    p.update();
    p.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
