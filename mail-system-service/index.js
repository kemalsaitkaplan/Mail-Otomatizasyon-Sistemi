require('dotenv').config();
const express   = require('express');
const connectDB = require('./src/config/db');
const { spawn } = require("child_process");
const path      = require("path");
const runSeed   = require('./src/utils/seed');
const scheduleEmails = require('./src/jobs/dailyJob');
const { connectRedis } = require('./src/config/redis');

const app = express();
app.use(express.json());

connectDB(); 
connectRedis();

console.log("Main program started..");

const workerPath = path.join(__dirname, "src", "workers", "emailWorker.js"); 
const worker = spawn("node", [workerPath]); //child prosess
worker.stdout.on("data", (data) => {console.log(`[Email Worker]: ${data}`);});
worker.stderr.on("data", (data) => {console.error(`[Email Worker Error]: ${data}`);});
worker.on("close", (code) => {console.log(`Email Worker exited with code ${code}`);});

//mail back-end test
app.get('/', (req, res) => {
  res.send('Mail-System is running...');
});

//Ornek Veri olusturma
app.post('/seed', async (req, res) => {
  try {
    await runSeed();
    res.status(200).json({ message: 'Veritabanı başarıyla seed edildi' });
  } catch (err) {
    console.error('Seed hatası:', err);
    res.status(500).json({ error: 'Seed işlemi başarısız' });
  }
});

//dailyJob test
//scheduleEmails() gece 12 de calisacak sekilde tasarlandi, test icin api olusturdum.
app.post('/run-daily-job', async (req, res) => {
  await scheduleEmails();
  res.send('Daily job manuel olarak tetiklendi.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running: http://localhost:${PORT}`));