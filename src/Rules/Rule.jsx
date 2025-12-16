import React from "react";
import "./Rule.css";

export default function Rules({ onClose }) {
  return (
    <div className="rules-overlay">
      <div className="rules-container">
        <button className="close" onClick={onClose}>✖</button>

        <h1>♟ Règles des Échecs</h1>

        <section>
          <h2>🎯 Objectif du jeu</h2>
          <p>
            Le but des échecs est de mettre le roi adverse en <strong>échec et mat</strong>.
            Cela signifie que le roi est menacé et qu’aucun coup ne peut le sauver.
          </p>
        </section>

        <section>
          <h2>♜ Les pièces</h2>
          <ul>
            <li><strong>Roi</strong> : se déplace d’une case dans toutes les directions</li>
            <li><strong>Reine</strong> : se déplace librement (lignes et diagonales)</li>
            <li><strong>Tour</strong> : lignes horizontales et verticales</li>
            <li><strong>Fou</strong> : diagonales</li>
            <li><strong>Cavalier</strong> : en « L » (2 + 1 cases)</li>
            <li><strong>Pion</strong> : avance d’une case (deux au premier coup)</li>
          </ul>
        </section>

        <section>
          <h2>♞ Coups spéciaux</h2>
          <ul>
            <li><strong>Roque</strong> : coup combiné du roi et de la tour</li>
            <li><strong>Prise en passant</strong> : capture spéciale du pion</li>
            <li><strong>Promotion</strong> : le pion devient reine, tour, fou ou cavalier</li>
          </ul>
        </section>

        <section>
          <h2>⚖️ Fin de partie</h2>
          <ul>
            <li>Échec et mat → victoire</li>
            <li>Pat → match nul</li>
            <li>Manque de temps → défaite</li>
            <li>Partie nulle (répétition, matériel insuffisant…)</li>
          </ul>
        </section>

        <section>
          <h2>⏱ Temps</h2>
          <p>
            Chaque joueur dispose d’un temps limité.  
            Si le temps est écoulé → la partie est perdue.
          </p>
        </section>
      </div>
    </div>
  );
}
