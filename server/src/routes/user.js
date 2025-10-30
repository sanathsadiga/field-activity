
import express from 'express';
import { auth, requireRole } from '../middleware/auth.js';


const router = express.Router();


// Generic user protected route
router.get('/profile', auth, (req, res) => {
res.json({ message: `Hello user ${req.user.id}`, role: req.user.role });
});


// Admin-only sample analytics endpoint (placeholder data)
router.get('/admin/analytics', auth, requireRole('admin'), (req, res) => {
res.json({
cards: [
{ title: 'Users', value: 1240 },
{ title: 'Active Today', value: 132 },
{ title: 'Revenue', value: '₹2,45,000' },
{ title: 'Bounce Rate', value: '18%' }
]
});
});


export default router;