import express from 'express';
const router = express.Router();

const users = []; // tu pourras remplacer par une vraie base de données

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: 'Tous les champs sont obligatoires' });

  const exists = users.find(u => u.email === email);
  if (exists) return res.json({ success: false, message: 'Email déjà utilisé' });

  users.push({ name, email, password });
  res.json({ success: true });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) res.json({ success: true });
  else res.json({ success: false, message: 'Email ou mot de passe incorrect' });
});

export default router;