import express from 'express';
import { body, query, validationResult } from 'express-validator';
import Entry from '../models/Entry.js';
import { auth, requireRole } from '../middleware/auth.js';

const router = express.Router();

// POST /api/entries - create a new entry (authenticated)
router.post(
  '/',
  auth,
  [body('kind').notEmpty().withMessage('kind is required')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const payload = req.body || {};
      // Extract known top-level fields; everything else goes into `data` for flexibility
      const { kind, location, coords, stall, papers, submittedAt, data: dataField, ...rest } = payload;

      const entry = new Entry({
        kind,
        user: req.user?.id,
        location,
        coords: coords ? { latitude: coords.latitude, longitude: coords.longitude } : undefined,
        stall,
        papers: papers || [],
        // prefer explicit payload.data, otherwise store remaining fields under `data` (or null if none)
        data: dataField !== undefined ? dataField : (Object.keys(rest).length ? rest : null),
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      });
      await entry.save();
      res.status(201).json({ entry });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/entries - list entries. Admins see all; regular users see their own
router.get(
  '/',
  auth,
  [
    query('kind').optional().isString(),
    query('location').optional().isString(),
    query('page').optional().toInt(),
    query('limit').optional().toInt(),
  ],
  async (req, res) => {
    try {
        const { kind, location, page = 1, limit = 20, user: userFilter } = req.query;
        const filter = {};
        if (kind) filter.kind = kind;
        if (location) filter.location = location;

        // Admins may optionally filter by user id via `?user=<userId>`; non-admins only see their entries
        if (req.user?.role === 'admin') {
          if (userFilter) filter.user = userFilter;
        } else {
          filter.user = req.user?.id;
        }

        const skip = (page - 1) * limit;
        // If admin, populate basic user info for convenience in the admin UI
        let queryExec = Entry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
        if (req.user?.role === 'admin') queryExec = queryExec.populate('user', 'name email role');
        const entries = await queryExec.lean();
        const total = await Entry.countDocuments(filter);
        res.json({ entries, total, page: Number(page), limit: Number(limit) });
      } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/entries/stats - admin analytics (basic)
router.get('/stats', auth, requireRole('admin'), async (req, res) => {
  try {
    const byKind = await Entry.aggregate([
      { $group: { _id: '$kind', count: { $sum: 1 } } },
    ]);

    const byLocation = await Entry.aggregate([
      { $group: { _id: '$location', count: { $sum: 1 } } },
    ]);

    res.json({ byKind, byLocation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
