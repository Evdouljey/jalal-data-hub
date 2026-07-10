import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { query } from './db.js';
import {
  purchaseAirtime,
  purchaseData,
  payElectricity,
  subscribeCableTv,
} from './services/bilalSadaSubService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'jalal-demo-secret';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@jalalhub.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use(limiter);

const createToken = (user) => jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await query('SELECT id, name, email, role, status FROM users WHERE id = $1', [payload.userId]);

    if (!rows[0]) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    if (rows[0].status !== 'active') {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const initializeDatabase = async () => {
  const schemaPath = path.resolve(__dirname, '..', 'database', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await query(schemaSql);

  const existingAdmin = await query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (!existingAdmin.rows[0]) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await query(
      'INSERT INTO users (name, email, password_hash, role, status) VALUES ($1, $2, $3, $4, $5)',
      ['Admin User', adminEmail, passwordHash, 'admin', 'active']
    );
  }
};

app.get('/api/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', message: 'JALAL DATA HUB API is running' });
  } catch (error) {
    res.status(503).json({ status: 'degraded', message: 'Database unavailable', error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

    if (existingUser.rows[0]) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userResult = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, status, kyc_status',
      [name.trim(), normalizedEmail, passwordHash]
    );

    const user = userResult.rows[0];
    await query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2)', [user.id, 0]);
    const token = createToken(user);

    res.status(201).json({
      token,
      user,
      message: 'Account created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const { rows } = await query('SELECT id, name, email, password_hash, role, status FROM users WHERE email = $1', [normalizedEmail]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    const token = createToken(user);
    delete user.password_hash;

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const normalizedEmail = email.toLowerCase();
    const { rows } = await query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);

    if (rows[0]) {
      // In a production app this would send a secure reset email.
    }

    res.json({ message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Password reset failed', error: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/services', (_req, res) => {
  res.json([
    { name: 'Buy Data', slug: 'buy-data' },
    { name: 'Buy Airtime', slug: 'buy-airtime' },
    { name: 'Electricity', slug: 'electricity' },
    { name: 'Cable TV', slug: 'cable-tv' },
  ]);
});

const handleBilalSadaSubRequest = async (req, res, action, type) => {
  const dbClient = await import('./db.js').then((module) => module.default.connect());

  try {
    const amount = Number(req.body.amount || 0);
    const walletResult = await dbClient.query('SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [req.user.id]);
    const wallet = walletResult.rows[0];

    if (!wallet || Number(wallet.balance) < amount) {
      await dbClient.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient balance for this purchase.' });
    }

    await dbClient.query('BEGIN');
    const updatedWallet = await dbClient.query('UPDATE wallets SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [amount, wallet.id]);
    const providerResponse = await action(req.body);

    await dbClient.query(
      'INSERT INTO transactions (user_id, wallet_id, type, amount, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [req.user.id, wallet.id, type, amount, `${type} purchase`, 'completed']
    );
    await dbClient.query('COMMIT');

    console.info(`[BilalSadaSub] ${type} purchase succeeded`, { userId: req.user.id, amount, providerResponse });
    return res.json({ message: 'Purchase completed successfully.', wallet: updatedWallet.rows[0], providerResponse });
  } catch (error) {
    await dbClient.query('ROLLBACK').catch(() => null);
    console.error(`[BilalSadaSub] ${type} purchase failed`, { userId: req.user.id, error: error.message, details: error.details || error });
    return res.status(error.status || 502).json({ message: error.message || 'BilalSadaSub request failed' });
  } finally {
    dbClient.release();
  }
};

app.post('/api/services/data', authenticateToken, async (req, res) => {
  await handleBilalSadaSubRequest(req, res, purchaseData, 'data');
});

app.post('/api/services/airtime', authenticateToken, async (req, res) => {
  await handleBilalSadaSubRequest(req, res, purchaseAirtime, 'airtime');
});

app.post('/api/services/electricity', authenticateToken, async (req, res) => {
  await handleBilalSadaSubRequest(req, res, payElectricity, 'electricity');
});

app.post('/api/services/cable-tv', authenticateToken, async (req, res) => {
  await handleBilalSadaSubRequest(req, res, subscribeCableTv, 'cable-tv');
});

app.get('/api/wallet', authenticateToken, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM wallets WHERE user_id = $1', [req.user.id]);
    const wallet = rows[0];

    if (!wallet) {
      const createdWallet = await query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *', [req.user.id, 0]);
      return res.json({ wallet: createdWallet.rows[0] });
    }

    res.json({ wallet });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load wallet', error: error.message });
  }
});

app.post('/api/wallet/fund', authenticateToken, async (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'A positive amount is required' });
  }

  const client = await query('SELECT NOW()').catch(() => null);
  if (!client) {
    return res.status(500).json({ message: 'Database unavailable' });
  }

  const dbClient = await import('./db.js').then((module) => module.default.connect());

  try {
    await dbClient.query('BEGIN');
    const walletResult = await dbClient.query('SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [req.user.id]);
    const wallet = walletResult.rows[0] || (await dbClient.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *', [req.user.id, 0])).rows[0];
    const updatedWallet = await dbClient.query('UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [amount, wallet.id]);
    await dbClient.query(
      'INSERT INTO transactions (user_id, wallet_id, type, amount, description) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, wallet.id, 'credit', amount, 'Wallet funded']
    );
    await dbClient.query('COMMIT');
    res.json({ wallet: updatedWallet.rows[0], message: 'Wallet funded successfully' });
  } catch (error) {
    await dbClient.query('ROLLBACK');
    res.status(500).json({ message: 'Funding failed', error: error.message });
  } finally {
    dbClient.release();
  }
});

app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'A positive amount is required' });
  }

  const dbClient = await import('./db.js').then((module) => module.default.connect());

  try {
    await dbClient.query('BEGIN');
    const walletResult = await dbClient.query('SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [req.user.id]);
    const wallet = walletResult.rows[0];

    if (!wallet || Number(wallet.balance) < amount) {
      await dbClient.query('ROLLBACK');
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const updatedWallet = await dbClient.query('UPDATE wallets SET balance = balance - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [amount, wallet.id]);
    await dbClient.query(
      'INSERT INTO transactions (user_id, wallet_id, type, amount, description) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, wallet.id, 'debit', amount, 'Wallet withdrawal']
    );
    await dbClient.query('COMMIT');
    res.json({ wallet: updatedWallet.rows[0], message: 'Withdrawal completed' });
  } catch (error) {
    await dbClient.query('ROLLBACK');
    res.status(500).json({ message: 'Withdrawal failed', error: error.message });
  } finally {
    dbClient.release();
  }
});

app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    res.json({ transactions: rows });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load transactions', error: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const { rows } = await query('SELECT id, name, email, role, status, kyc_status, created_at FROM users ORDER BY created_at DESC');
    res.json({ users: rows });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load users', error: error.message });
  }
});

app.get('/api/admin/transactions', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const { rows } = await query('SELECT t.*, u.name AS user_name FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC');
    res.json({ transactions: rows });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load admin transactions', error: error.message });
  }
});

app.post('/api/admin/users/:id/suspend', authenticateToken, requireAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const { rows } = await query('UPDATE users SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role, status', [status || 'suspended', req.params.id]);
    res.json({ user: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update user status', error: error.message });
  }
});

app.post('/api/admin/wallets/:userId/fund', authenticateToken, requireAdmin, async (req, res) => {
  const amount = Number(req.body.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'A positive amount is required' });
  }

  const dbClient = await import('./db.js').then((module) => module.default.connect());

  try {
    await dbClient.query('BEGIN');
    const walletResult = await dbClient.query('SELECT * FROM wallets WHERE user_id = $1 FOR UPDATE', [req.params.userId]);
    const wallet = walletResult.rows[0] || (await dbClient.query('INSERT INTO wallets (user_id, balance) VALUES ($1, $2) RETURNING *', [req.params.userId, 0])).rows[0];
    const updatedWallet = await dbClient.query('UPDATE wallets SET balance = balance + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *', [amount, wallet.id]);
    await dbClient.query('INSERT INTO transactions (user_id, wallet_id, type, amount, description) VALUES ($1, $2, $3, $4, $5)', [req.params.userId, wallet.id, 'credit', amount, 'Admin wallet funding']);
    await dbClient.query('COMMIT');
    res.json({ wallet: updatedWallet.rows[0], message: 'Wallet funded successfully' });
  } catch (error) {
    await dbClient.query('ROLLBACK');
    res.status(500).json({ message: 'Funding failed', error: error.message });
  } finally {
    dbClient.release();
  }
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: 'Unexpected server error', error: err.message });
});

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`JALAL DATA HUB backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize backend:', error);
    process.exit(1);
  }
};

startServer();
