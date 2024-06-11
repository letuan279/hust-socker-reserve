import React, { useState, useEffect } from 'react';

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    
    <div>
      <h1>Sân vận động Bách Khoa Hà Nội</h1>
      <p>Thời gian hiện tại: {currentTime.toLocaleString()}</p>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7615353749757!2d105.84525181125605!3d21.00219398055978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac740ba3819f%3A0x2b5ef5b01461f9e7!2sHanoi%20University%20of%20Science%20and%20Technology%20(HUST)%20Stadium!5e0!3m2!1sen!2s!4v1718044674024!5m2!1sen!2s"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

    </div>
  );
};

export default Index;