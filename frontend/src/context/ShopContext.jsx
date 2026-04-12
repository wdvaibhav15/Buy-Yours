import { createContext, useEffect } from "react";
import {products} from '../assets/assets'
import React from 'react'
import { toast } from "react-toastify";

export const ShopContext = createContext();


const ShopContextProvider = (props) => {

    const currency = "$";
    const delevery_fee = 10;

    const [search, setSearch] = React.useState("");
    const [showSearch, setShowSearch] = React.useState(false);
    const [cartItems, setCartItems] = React.useState({});

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

    const value = {
        products, currency,delevery_fee,
        search, setSearch,showSearch, setShowSearch,
        cartItems, setCartItems, addToCart,
        getCartCount, updateQuantity
    }
    return (
         <ShopContext.Provider value={value}>
         {props.children}  
         </ShopContext.Provider>

    )
}

export default ShopContextProvider;