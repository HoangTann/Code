const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3000;

app.use(express.json());

// 📧 Cấu hình gửi email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nhtan2101077@student.ctuet.edu.vn',     // 🔁 Đổi email bạn
    pass: 'hgzy nnnf jgul naim'          // 🔁 Dùng App Password nếu là Gmail
  }
});

// Mảng để lưu trữ thông tin cảnh báo đã gửi
let sentAlerts = [];

function sendAlertEmail(sensorData) {
  const mailOptions = {
    from: '"IoT Cảnh báo" <youremail@gmail.com>',
    to: 'nguyenhoangtan010103@gmail.com',      // 🔁 Đổi người nhận, nhớ thay đổi cái này để demo nha 
    subject: `⚠️ CẢNH BÁO: Nhiệt độ cao từ ${sensorData.deviceId}`,
    html: `
      <h2>Thiết bị: ${sensorData.deviceId}</h2>
      <p><strong>Nhiệt độ:</strong> ${sensorData.temperature}°C</p>
      <p><strong>Độ ẩm:</strong> ${sensorData.humidity}%</p>
      <p><strong>Thời gian:</strong> ${sensorData.timestamp}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("❌ Lỗi gửi mail:", error.message);
    }
    console.log("📧 Đã gửi cảnh báo qua email:", info.response);
  });
}

// 📥 Nhận dữ liệu từ sensor
app.post('/data', (req, res) => {
  const sensorData = req.body;
  const temp = parseFloat(sensorData.temperature);

  // Ghi log vào file
  fs.appendFileSync('data.json', JSON.stringify(sensorData) + '\n');

  if (temp > 30) {
    console.log(`\x1b[31m🔥 CẢNH BÁO: Nhiệt độ cao (${temp}°C) từ ${sensorData.deviceId}\x1b[0m`);
    
    // Ghi log riêng cảnh báo
    fs.appendFileSync('alerts.json', JSON.stringify(sensorData) + '\n');

    // Kiểm tra nếu đã gửi cảnh báo trong 2 giờ qua, nếu chưa thì gửi email
    const lastSentTime = sentAlerts[sentAlerts.length - 1]?.timestamp;
    const currentTime = new Date().getTime();

    if (!lastSentTime || currentTime - lastSentTime > 2 * 60 * 60 * 1000) {
      sendAlertEmail(sensorData);
      sentAlerts.push({ timestamp: currentTime, deviceId: sensorData.deviceId });
    }
  } else {
    console.log(`✅ Nhận dữ liệu: ${JSON.stringify(sensorData)}`);
  }

  res.status(200).json({ message: 'Dữ liệu đã được nhận' });
});

// Cập nhật email mỗi 2 tiếng
setInterval(() => {
  sentAlerts = [];  // Reset lại mảng cảnh báo đã gửi sau 2 giờ
}, 2 * 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`🌐 Server lắng nghe tại http://localhost:${PORT}`);
});
