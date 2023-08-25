/* eslint-disable */

const stripe = Stripe(
  'pk_test_51Niz2LSErVQGEZfAUf6JvlEJqKKVcP9CQZjnULf4ABjZt6AsuQhonlX1uFanLFjO9FXYxAeSa08RU2MHwkHdNKJN0013Og0nGU',
);

const bookTour = async (tourId) => {
  // 1) Get checkout session from API
  try {
    let strip_session = await fetch(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );

    strip_session = await strip_session.json();

    // 2) Create checkout form + charge
    await stripe.redirectToCheckout({
      sessionId: strip_session.session.id,
    });
  } catch (err) {
    console.log(err);
    alert('error: ', err.message);
  }
};

const bookButton = document.getElementById('book-tour');

if (bookButton) {
  bookButton.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
