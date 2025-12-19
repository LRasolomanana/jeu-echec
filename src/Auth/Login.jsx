import React, { useState } from 'react';
import axios from 'axios';
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

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isLogin) {
      // connexion
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        alert(`Connexion réussie pour ${formData.email}`);
        // ici tu peux rediriger ou stocker un token
      } else {
        alert(response.data.message);
      }

    } else {
      // inscription
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        alert(`Inscription réussie pour ${formData.name}`);
      } else {
        alert(response.data.message);
      }
    }
  } catch (error) {
    console.error(error);
    alert('Erreur serveur, veuillez réessayer.');
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