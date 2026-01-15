let particles = [];
let handX = null;
let handY = null;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
  }

  update() {
    if (handX !== null && handY !== null) {
      let target = createVector(handX, handY);
      let force = p5.Vector.sub(target, this.pos);
      force.setMag(0.3);
      this.vel.add(force);
    }

    this.pos.add(this.vel);
    this.vel.limit(3);
  }

  show() {
    noStroke();
    fill(0, 200, 255);
    circle(this.pos.x, this.pos.y, 4);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 300; i++) {
    particles.push(new Particle());
  }

  const video = document.getElementById("video");

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks.length > 0) {
      let indexFinger = results.multiHandLandmarks[0][8];

      handX = indexFinger.x * width;
      handY = indexFinger.y * height;
    } else {
      handX = null;
      handY = null;
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
  background(0, 40);

  for (let p of particles) {
    p.update();
    p.show();
  }
}
