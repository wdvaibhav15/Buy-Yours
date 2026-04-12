import { createContext, useEffect } from "react";
import {products} from '../assets/assets'
import React from 'react'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();


const ShopContextProvider = (props) => {

    const currency = "$";
    const delivery_fee = 10;
    const [search, setSearch] = React.useState("");
    const [showSearch, setShowSearch] = React.useState(false);
    const [cartItems, setCartItems] = React.useState({});
    const navigate = useNavigate();

     const addToCart =async (itemId, size) => {

        if(!size){
            toast.error('Please select size');
            return;
        }

       let cartData= structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
     }

    const getCartCount=() => {
        let totalCount = 0;
        for(const items in cartItems){
            for(const item in cartItems[items]){
                try{
                    if(cartItems[items][item]>0) {}
                   totalCount += cartItems[items][item];
                }
                catch(e){
                    console.log(e);
                }
            }
        }
        return totalCount;
    }

    const updateQuantity= async(itemId, size, quantity)=>{
        const cartData= structuredClone(cartItems);
         cartData[itemId][size] = quantity;
         setCartItems(cartData);
    }

const getCartAmount = () => {
  let totalAmount = 0;

  for (const itemId in cartItems) {
    const itemInfo = products.find((product) => product._id === itemId);

    if (!itemInfo) continue;

    for (const size in cartItems[itemId]) {
      try {
        if (cartItems[itemId][size] > 0) {
          totalAmount += itemInfo.price * cartItems[itemId][size];
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return totalAmount;
};


    
    const value = {
        products, currency,delivery_fee,
        search, setSearch,showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity,getCartAmount,navigate
    }
    return (
         <ShopContext.Provider value={value}>
         {props.children}  
         </ShopContext.Provider>

    )
}

export default ShopContextProvider;