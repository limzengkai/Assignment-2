import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { selectedPizzas } = state || { selectedPizzas: [] };

  const totalAmount = selectedPizzas.reduce(
    (total, pizza) => total + pizza.price,
    0
  );

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-2xl w-full p-10 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Checkout
        </h2>
        <ul className="mt-8 space-y-4">
          {selectedPizzas.map((pizza, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                {pizza.name} - ${pizza.price}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-8 text-right text-lg font-medium text-gray-900">
          Total: ${totalAmount}
        </div>
        <button
          onClick={handlePlaceOrder}
          className="mt-8 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
