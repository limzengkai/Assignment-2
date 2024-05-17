import React from 'react';

const pizzas = [
  { name: 'Margherita', description: 'Classic cheese and tomato', price: '$10' },
  { name: 'Pepperoni', description: 'Pepperoni and cheese', price: '$12' },
  { name: 'Veggie', description: 'Bell peppers, olives, and onions', price: '$11' },
  { name: 'Meat Feast', description: 'Pepperoni, ham, sausage, and bacon', price: '$14' },
];

export default function Menu() {
  return (
    <section className="py-12">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Our Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pizzas.map((pizza, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">{pizza.name}</h3>
              <p className="text-gray-700 mb-4">{pizza.description}</p>
              <p className="text-red-600 font-bold">{pizza.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
