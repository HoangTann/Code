const axios = require('axios');

// Hàm tạo nhiệt độ ngẫu nhiên (ví dụ 28–34°C)
function getRandomTemp() {
  return (28 + Math.random() * 6).toFixed(2);
}

// Hàm tạo độ ẩm ngẫu nhiên (ví dụ 50–70%)
function getRandomHumidity() {
  return (50 + Math.random() * 20).toFixed(2);
}

// Gửi dữ liệu định kỳ
setInterval(() => {
  const data = {
    deviceId: 'sensor-001',
    temperature: getRandomTemp(),
    humidity: getRandomHumidity(),
    timestamp: new Date().toISOString()
  };

  axios.post('http://localhost:3000/data', data)
    .then(res => {
      console.log('📡 Gửi dữ liệu thành công:', data);
    })
    .catch(err => {
      console.error('❌ Lỗi gửi dữ liệu:', err.message);
    });

}, 5000); // Mỗi 5 giây
