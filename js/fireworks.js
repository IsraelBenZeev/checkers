const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = Math.random() * 3 + 1;
    this.size = Math.random() * 3 + 1;
    this.angle = Math.random() * Math.PI * 2;
}

Particle.prototype.update = function() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.size *= 0.95;
};

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
};

function createFirework(x, y) {
    const colors = ['#ff0044', '#ff77ff', '#33ccff', '#ffcc00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.1) {
            particles.splice(index, 1);
        }
    });

    if (Math.random() < 0.05) {
        createFirework(Math.random() * canvas.width, Math.random() * canvas.height);
    }

    requestAnimationFrame(animate);
}

animate();
