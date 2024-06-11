import React, { useState, useEffect } from 'react';
import { FaFacebookSquare } from 'react-icons/fa';
import './information.scss'


const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFacebookClick = () => {
    window.open('https://www.facebook.com/groups/3044382598928799/', '_blank');
  };

  return (
    <div>
      <h1>Sân vận động Bách Khoa Hà Nội</h1>
      <p>Số điện thoại: 0936935346</p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '20px',
          cursor: 'pointer',
        }}
        onClick={handleFacebookClick}
      >
        <FaFacebookSquare size={32} style={{ marginRight: '10px', animation: 'pulse 2s infinite'  }} />
        <span>Liên lạc Facebook</span>
      </div>
      <p>Địa chỉ: A1 P. Lê Thanh Nghị, Bách Khoa, Hai Bà Trưng, Hà Nội</p>

      <div style={{ display: 'flex', marginTop: '20px' }}>
        <div style={{ width: '40%' }}>
          {/* Khung hiển thị bản đồ Google Maps */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7615353749757!2d105.84525181125605!3d21.00219398055978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac740ba3819f%3A0x2b5ef5b01461f9e7!2sHanoi%20University%20of%20Science%20and%20Technology%20(HUST)%20Stadium!5e0!3m2!1sen!2s!4v1718044674024!5m2!1sen!2s"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          cursor: 'pointer',
        }}
        onClick={handleFacebookClick}
      >
        <FaFacebookSquare size={48} style={{ animation: 'pulse 2s infinite' }} />
      </div> */}
    </div>
  );
};

export default Index;