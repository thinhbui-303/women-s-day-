import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Sparkles, Gift } from 'lucide-react';
import './Celebration.css';

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    let particles = [];
    const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffb3c1', '#c9184a', '#ffccd5', '#fff', '#ffd700'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > canvas.height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        if (Math.random() > 0.5) {
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
      }
    }

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height / 2);
        this.speed = Math.random() * 3 + 5;
        this.particles = [];
        this.exploded = false;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (!this.exploded) {
          this.y -= this.speed;
          if (this.y <= this.targetY) {
            this.explode();
          }
        } else {
          this.particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.alpha -= 0.01;
            if (p.alpha <= 0) this.particles.splice(i, 1);
          });
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 2;
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1
          });
        }
      }

      draw() {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else {
          this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
          });
        }
      }
    }

    let confettiParticles = [];
    let fireworks = [];

    for (let i = 0; i < 200; i++) {
      confettiParticles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confettiParticles.forEach((p) => {
        p.update();
        p.draw();
      });

      if (Math.random() < 0.02) fireworks.push(new Firework());
      fireworks.forEach((f, i) => {
        f.update();
        f.draw();
        if (f.exploded && f.particles.length === 0) fireworks.splice(i, 1);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};

const Celebration = ({ onRestart }) => {
  const [message, setMessage] = React.useState('');
  const [isSent, setIsSent] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setIsSending(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (response.ok) {
        setIsSent(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Không thể gửi lời nhắn. Hãy chắc chắn Backend đang chạy!');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="celebration-container">
      <Confetti />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, type: 'spring' }}
        className="main-card-glass"
      >
        <div className="icon-group">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Heart fill="#ff4d6d" stroke="none" size={50} />
          </motion.div>
          <Sparkles className="sparkle-icon" color="#ffd700" size={30} />
          <Star className="star-icon" color="#ffd700" size={30} />
        </div>

        <h1 className="main-title">Chúc mừng ngày 8/3!</h1>
        <h2 className="secondary-title">Cảm ơn vì đã luôn là niềm hạnh phúc lớn nhất của anh.</h2>
        
        {!isSent ? (
          <div className="message-form">
            <p className="form-label">Hãy để lại một lời nhắn cho anh nhé:</p>
            <textarea
              className="message-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập lời nhắn của em ở đây..."
              rows={4}
            />
            <button 
              className="send-message-btn" 
              onClick={handleSendMessage}
              disabled={isSending || !message.trim()}
            >
              {isSending ? 'Đang gửi...' : 'Gửi lời nhắn ❤️'}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="message-box"
          >
            <p>
              "Lời nhắn của em đã được gửi đi! Cảm ơn em rất nhiều. Chúc em một ngày 8/3 thật tuyệt vời!"
            </p>
          </motion.div>
        )}

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gift-card"
        >
          <Gift size={40} color="#ff4d6d" />
          <span>Một món quà đặc biệt đang đợi em...</span>
        </motion.div>

        <button className="restart-btn" onClick={onRestart}>
          CHƠI LẠI TỪ ĐẦU
        </button>
      </motion.div>

      {/* Floating Flowers Background Effect (CSS only) */}
      <div className="floating-flowers">
        <span className="flower">🌸</span>
        <span className="flower">🌹</span>
        <span className="flower">🌻</span>
        <span className="flower">🌷</span>
        <span className="flower">🌺</span>
        <span className="flower">🌼</span>
      </div>
    </div>
  );
};

export default Celebration;
