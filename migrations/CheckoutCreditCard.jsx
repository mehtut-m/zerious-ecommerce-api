import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OMISE_SCRIPT_URL, OMISE_PUBLIC_KEY } from '../../config/env';

let OmiseCard;

const CheckoutCreditCard = ({ createCreditCardCharge, cart, subTotal }) => {
  const { order } = cart;

  useEffect(() => {
    OmiseCard = window.OmiseCard;
    OmiseCard.configure({
      publicKey: OMISE_PUBLIC_KEY,
      currency: 'thb',
      frameLabel: 'Zerious',
      submitLabel: 'Pay Now',
    });
  }, []);

  const creditCardConfigure = () => {
    OmiseCard.configure({
      defaultPaymentMethod: 'credit_card',
    });
    OmiseCard.configureButton('#credit-card');
  };

  const omiseCartHandler = () => {
    OmiseCard.open({
      frameDescription: `Order no.${order.id}`,
      amount: subTotal * 100,
      onCreateTokenSuccess: (token) => {
        createCreditCardCharge(
          'test3@gmail.com',
          'Test3',
          subTotal * 100,
          token
        );
      },
      onFormClosed: () => {
        console.log('form Cloased');
      },
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    creditCardConfigure();
    OmiseCard.attach();
    omiseCartHandler();
  };

  return (
    <>
      <div className="own-form">
        <form onSubmit={(e) => e.preventDefault()}>
          <button
            id="credit-card"
            type="button"
            onClick={handleClick}
            className="bg-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white  hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </>
  );
};

export default CheckoutCreditCard;
