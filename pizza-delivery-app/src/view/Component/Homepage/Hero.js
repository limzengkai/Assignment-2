import React from 'react';

export default function Hero() {
  return (
    <section className="bg-cover bg-center h-screen" style={{ backgroundImage: 'url(https://example.com/pizza-hero.jpg)' }}>
      <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">Delicious Pizza Delivered To You</h1>
          <p className="text-2xl mb-6">Freshly baked and delivered hot in 30 minutes</p>
          <a href="#" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded">Order Now</a>
        </div>
      </div>
    </section>
  );
}
