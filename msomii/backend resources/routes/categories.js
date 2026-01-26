@@ .. @@
 import express from 'express';
 import { getCategories, createCategory, getCategoryById } from '../controllers/categories.js';
-//import { authMiddleware } from '../middleware/auth.js';
+import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
 import { validateRequest, categoryValidation } from '../middleware/validate.js';

@@ .. @@
 router.get('/', getCategories);
-router.post('/', authMiddleware, categoryValidation, validateRequest, createCategory);
+router.post('/', authMiddleware, adminMiddleware, categoryValidation, validateRequest, createCategory);
 router.get('/:id', authMiddleware, getCategoryById);