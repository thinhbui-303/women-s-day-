import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Camera, Star, Sparkles } from 'lucide-react';
import HeartParticles from './HeartParticles';
import './Storyline.css';

const timelineData = [
  {
    id: 1,
    date: 'March 2024',
    title: 'Lần đầu gặp gỡ',
    content: 'Ánh mắt chạm nhau, thế giới bỗng nhiên chậm lại...',
    icon: <Calendar className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800',
  },
  {
    id: 2,
    date: 'April 2024',
    title: 'Buổi hẹn đầu tiên',
    content: 'Cùng nhau đi dạo dưới ánh đèn phố phường, nụ cười ấy thật rạng rỡ.',
    icon: <MapPin className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800',
  },
  {
    id: 3,
    date: 'June 2024',
    title: 'Kỷ niệm khó quên',
    content: 'Những chuyến đi, những khoảnh khắc được lưu giữ mãi mãi.',
    icon: <Camera className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=800',
  },
  {
    id: 4,
    date: 'Today',
    title: 'Hành trình tiếp tục',
    content: 'Cảm ơn vì đã luôn ở bên cạnh, làm cho cuộc sống trở nên rực rỡ hơn.',
    icon: <Star className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1516589174184-c6852650d87a?auto=format&fit=crop&w=800',
  },
];

const TimelineItem = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`timeline-item ${isEven ? 'even' : 'odd'}`}
    >
      <div className="timeline-content">
        <div className="timeline-icon-wrapper">
          {item.icon}
        </div>
        <div className="card-glass">
            <img src={item.image} alt={item.title} className="card-image" />
            <div className="card-body">
              <span className="card-date">{item.date}</span>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-text">{item.content}</p>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

const Storyline = ({ onFinish }) => {
  return (
    <div className="storyline-container">
      <HeartParticles />
      
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="hero-content"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="love-icon-large"
          >
            <Heart fill="#ff4d6d" stroke="none" size={60} />
          </motion.div>
          <h1 className="hero-title">Hành trình của chúng mình</h1>
          <p className="hero-subtitle">Cuộn xuống để xem lại những kỷ niệm...</p>
        </motion.div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-line"></div>
        {timelineData.map((item, index) => (
          <TimelineItem key={item.id} item={item} index={index} />
        ))}
      </section>

      {/* Final Action */}
      <section className="final-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="final-content"
        >
          <h2 className="final-title">Bạn có sẵn sàng cho một thử thách?</h2>
          <p className="final-text">Người yêu của bạn đang bị nhốt trong mê cung quà tặng!</p>
          
          <button className="rescue-button" onClick={onFinish}>
            <span className="sparkle-layer">
              <Sparkles className="sparkle-1" />
              <Sparkles className="sparkle-2" />
            </span>
            GIẢI CỨU NGƯỜI YÊU
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Storyline;
