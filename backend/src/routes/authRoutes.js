const express = require('express');
const { z } = require('zod');
const authController = require('../controllers/authController');
const validateReq = require('../middlewares/validateReq');
const { protect } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false, 
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    role: z.enum(['superadmin', 'admin', 'customer']).optional(),
    location: z.object({
      type: z.literal('Point'),
      coordinates: z.array(z.number()).length(2)
    }).optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

router.post('/register', validateReq(registerSchema), authController.register);
router.post('/login', loginLimiter, validateReq(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
