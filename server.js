import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

connectDb();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// User routes
app.use('/api/users', userRoutes);

// Route to handle questionnaire form submission
app.post('/api/submit', (req, res) => {
  const { answers } = req.body;

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ message: 'Invalid answers format.' });
  }

  // Calculate the total score
  const totalScore = Object.values(answers).reduce((sum, value) => sum + parseInt(value, 10), 0);

  // Interpret the score based on Beck Depression Inventory guidelines
  let interpretation;
  if (totalScore <= 10) {
    interpretation = 'These ups and downs are considered normal.';
  } else if (totalScore <= 16) {
    interpretation = 'Mild mood disturbances.';
  } else if (totalScore <= 20) {
    interpretation = 'Borderline clinical depression.';
  } else if (totalScore <= 30) {
    interpretation = 'Moderate depression.';
  } else if (totalScore <= 40) {
    interpretation = 'Severe depression.';
  } else {
    interpretation = 'Extreme depression.';
  }

  // Send the total score and interpretation as the response
  res.json({ totalScore, interpretation });
});

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});

export default app;
