import dotenv from 'dotenv';

// Configure environment variables BEFORE any other imports
dotenv.config();

import { app } from './frame-works/web-server/express';

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => console.log(`Admin shop services listening at http://localhost:${PORT}/api/v1/data/docs/`));
