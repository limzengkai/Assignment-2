import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderPage() {
  const [selectedPizzas, setSelectedPizzas] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3001/")
      .then((response) => {
        if (response.data.valid) {
          setUsername(response.data.username);
        } else {
          // navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const pizzas = [
    { id: 1, name: "Margherita", price: 10 },
    { id: 2, name: "Pepperoni", price: 12 },
    { id: 3, name: "Hawaiian", price: 11 },
  ];

  const handleSelectPizza = (pizza) => {
    setSelectedPizzas([...selectedPizzas, pizza]);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { selectedPizzas } });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full p-10 bg-white rounded-lg shadow">
        <h1 className="text-4xl mb-9">
          Welcome, {username}! 
          <br />
          What would you like to order?
        </h1>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Order Pizza
        </h2>
        <ul className="mt-8 space-y-4">
          {pizzas.map((pizza) => (
            <li key={pizza.id} className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                {pizza.name} - ${pizza.price}
              </span>
              <button
                onClick={() => handleSelectPizza(pizza)}
                className="bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
              >
                Add to Order
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={handleCheckout}
          className="mt-8 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          disabled={selectedPizzas.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default OrderPage;
