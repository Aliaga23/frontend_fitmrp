import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ puntaje }) => {
  const fullStars = Math.floor(puntaje); // Número de estrellas llenas
  const hasHalfStar = puntaje - fullStars >= 0.5; // Verifica si hay media estrella
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Estrellas vacías

  return (
    <div className="flex items-center">
      {/* Estrellas llenas */}
      {Array(fullStars)
        .fill(0)
        .map((_, index) => (
          <FaStar key={`full-${index}`} className="text-yellow-400" />
        ))}
      {/* Media estrella (si corresponde) */}
      {hasHalfStar && <FaStar className="text-yellow-300" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
      {/* Estrellas vacías */}
      {Array(emptyStars)
        .fill(0)
        .map((_, index) => (
          <FaStar key={`empty-${index}`} className="text-gray-300" />
        ))}
    </div>
  );
};

export default StarRating;
