// Example of creating a payment intent with class dates
const createPaymentIntent = async (cartItems) => {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      currency: 'eur',
      items: cartItems.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        classDate: item.classDate, // Include class date for each item
      })),
      metadata: {
        customer_id: currentUser?.id,
        order_type: 'class_booking',
      }
    }),
  });
  
  return await response.json();
};