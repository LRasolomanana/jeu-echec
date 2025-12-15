import React, { useState } from 'react';
import './LoginRegister.css';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true); // true pour connexion, false pour inscription
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Simulation de connexion
      if (formData.email && formData.password) {
        alert(`Connexion réussie pour ${formData.email}`);
      } else {
        alert('Veuillez remplir email et mot de passe.');
      }
    } else {
      // Simulation d'inscription
      if (formData.name && formData.email && formData.password) {
        alert(`Inscription réussie pour ${formData.name}`);
      } else {
        alert('Veuillez remplir tous les champs.');
      }
    }
  };

  return (
    <div className="container">
      <h2>Plateforme Échec</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Nom complet"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? 'Se connecter' : "S'inscrire"}</button>
      </form>
      <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
      </p>
    </div>
  );
}

export default LoginRegister;