@@ .. @@
 import express from 'express';
 import multer from 'multer';
 import path from 'path';
 import { fileURLToPath } from 'url';
 import fs from 'fs/promises';
 import { uploadResource, getResources, searchResources, deleteResource, downloadResource } from '../controllers/resources.js';
+import { authMiddleware } from '../middleware/auth.js';

@@ .. @@
 const upload = multer({
   storage,
   fileFilter,
   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
 }).single('file');

-router.post('/', upload, uploadResource); // Temporary: Removed authMiddleware
+router.post('/', authMiddleware, upload, uploadResource);
 router.get('/', getResources);
 router.get('/search', searchResources);
 router.get('/:id/download', downloadResource);
-router.delete('/:id', deleteResource);
+router.delete('/:id', authMiddleware, deleteResource);