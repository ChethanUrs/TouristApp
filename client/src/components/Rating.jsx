import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = 'text-yellow-400' }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star size={16} className={`${color} fill-current`} />
            ) : value >= index - 0.5 ? (
              <StarHalf size={16} className={`${color} fill-current`} />
            ) : (
              <Star size={16} className="text-slate-300" />
            )}
          </span>
        ))}
      </div>
      {text && <span className="text-xs font-medium text-slate-500 ml-1">{text}</span>}
    </div>
  );
};

export default Rating;
