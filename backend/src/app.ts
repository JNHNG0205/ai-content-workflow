import express from "express";
import cors from "cors";
import router from "./routes";

// Routes
import contentRoutes from "./routes/content.routes";
import reviewRoutes from "./routes/review.routes";
import authRoutes from "./routes/auth.routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/review', reviewRoutes);
