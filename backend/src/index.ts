import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import salesRoutes from './routes/salesRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
    res.send('Sales API is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
