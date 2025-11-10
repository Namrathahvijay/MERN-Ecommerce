import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="cursor-pointer group" to={`/product/${id}`}>
      <div className="overflow-hidden bg-white rounded-md border border-slate-200 shadow-sm transition-shadow group-hover:shadow-md">
        <img
          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
          src={image[0]}
          alt="Product"
        />
      </div>
      <p className="pt-3 pb-1 text-sm text-slate-700">{name}</p>
      <p className="text-sm font-semibold text-slate-900">
        {currency}&nbsp;
        {price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </Link>
  );
};

export default ProductItem;
