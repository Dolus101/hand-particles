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

      // FAST RESPONSE
      force.setMag(2.5);
      this.vel.lerp(force, 0.5);
    }

    this.pos.add(this.vel);
  }

  show() {
    noStroke();
    fill(0, 200, 255);
    circle(this.pos.x, this.pos.y, 4);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // LOWER PARTICLE COUNT = FASTER
  for (let i = 0; i < 150; i++) {
    particles.push(new Particle());
  }

  const video = document.getElementById("video");

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 0, // VERY IMPORTANT (speed)
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  hands.onResults((results) => {
    if (results.multiHandLandmarks.length > 0) {
      // INDEX FINGER TIP
      const indexFinger = results.multiHandLandmarks[0][8];
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
  background(0); // no motion blur = faster

  for (let p of particles) {
    p.update();
    p.show();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
