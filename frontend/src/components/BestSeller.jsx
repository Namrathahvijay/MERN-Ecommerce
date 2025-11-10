import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const flag = localStorage.getItem('subscribed') === 'true'
    setSubscribed(flag)
  }, [])

  useEffect(() => {
    const bestProduct = products.filter((item) => item.bestSeller);
    const limit = subscribed ? 8 : 5
    setBestSeller(bestProduct.slice(0, limit));
  }, [products, subscribed]);

  return (
    <div className="my-10">
      <div className="py-8 text-3xl text-center">
        <Title text1={"BEST"} text2={"SELLERS"} />
        {subscribed && (
          <p className="mt-2 text-sm text-green-600">Subscriber offer active: extra deals unlocked!</p>
        )}
        <p className="w-3/4 m-auto text-xs text-gray-600 sm:text-sm md:text-base">
          Our best sellers are a curated selection of top-rated items that have
          won over shoppers with their quality, style, and value.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
        {bestSeller.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
