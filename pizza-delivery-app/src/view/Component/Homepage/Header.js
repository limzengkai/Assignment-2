import React from 'react';

export default function Header() {
  return (
    <header className="bg-red-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Pizza Delivery</div>
        <nav>
          <a href="#" className="mx-2 hover:underline">Home</a>
          <a href="#" className="mx-2 hover:underline">Menu</a>
          <a href="#" className="mx-2 hover:underline">Contact</a>
          <a href="#" className="mx-2 hover:underline">Order Now</a>
          <a href="/login" className="mx-2 hover:underline">Log In</a>
        </nav>
      </div>
    </header>
  );
}
