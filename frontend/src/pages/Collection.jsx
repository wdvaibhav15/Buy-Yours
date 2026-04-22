import React, { useEffect } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {assets} from '../assets/assets'
import Title from '../components/Title' 
import ProductItem from '../components/ProductItem'



const Collection = () => {

   const {products , search, showSearch} = useContext(ShopContext);
   const [showFilter, setShowFilter] = React.useState(false);
   const [filteredProducts, setFilteredProducts] = React.useState([]);
   const[category, setCategory] = React.useState([]);
   const[subcategory, setSubcategory] = React.useState([]);
   const [sortType, setSortType] = React.useState("relevant");

    const toggleCategory =(e)=>{
      if(category.includes(e.target.value)){
        setCategory( prev=> prev.filter((item) => item !== e.target.value))
      }
      else{
        setCategory(prev => [...prev, e.target.value])
      }
    }


     const toggleSubcategory =(e)=>{
      if(subcategory.includes(e.target.value)){
        setSubcategory( prev=> prev.filter((item) => item !== e.target.value))
      }
      else{
        setSubcategory(prev => [...prev, e.target.value])
      }
    }


    const applyFilter = () => {
     let productCopy = products.slice();

     
     if(showSearch && search){
      productCopy = productCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
     }
     if(category.length > 0){
      productCopy = productCopy.filter((item) => category.includes(item.category));
     }
     if(subcategory.length > 0){
      productCopy = productCopy.filter((item) => subcategory.includes(item.subCategory));
     }
     setFilteredProducts(productCopy);
    }

    const sortProducts = () => {
      let filterProductCopy = filteredProducts.slice();
      switch (sortType) {
        case "low-high":
          setFilteredProducts(filterProductCopy.sort((a, b) => a.price - b.price));
          break;

        case "high-low":
          setFilteredProducts(filterProductCopy.sort((a, b) => b.price - a.price));
          break;
        default:
          applyFilter();
          break;

      }
    }

    useEffect(()=>{
      applyFilter();
    },[category, subcategory, search,showSearch,products]);

    useEffect(()=>{
sortProducts();
    },[sortType]);

    
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t ">
      {/* filter options */}
      <div className=" min-w-60">
        <p onClick={()=>{setShowFilter(!showFilter)}} className =" my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* category filters */}
        <div className={`border border-gray-300 pl-5 mt-6 py-3 ${showFilter ? '' : 'hidden'} sm:block` }>
          <p className ="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" onChange={toggleCategory} value={"Men"}/>Man
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" onChange={toggleCategory} value={"Women"}/>Women
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox"  onChange={toggleCategory} value={"Kids"}/>Kids
            </p>
          </div>
        </div>

      {/* subcategories filters */}
      <div className={`border border-gray-300 pl-5 my-5 py-3 ${showFilter ? '' : 'hidden'} sm:block` }>
          <p className ="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" onChange={toggleSubcategory} value={"Topwear"}/>Topwear
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" onChange={toggleSubcategory} value={"Bottomwear"}/>Bottomwear
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" onChange={toggleSubcategory} value={"Winterwear"}/>Winterwear
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
        <div className="flex-1">

          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text={"All"} text2={"Collections"}/>
             {/* product sorting */}
             <select onChange={(e) => setSortType(e.target.value)} className =" border-2 border-gray-300 text-sm px-2">
             <option value="relavent"  >Sort by: Relavent</option>
             <option value="low-high"  >Sort by: Low to High</option>
             <option value="high-low"  >Sort by: High to low</option>
             </select>
          </div>

          {/* map products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 ">
            {filteredProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
            ))}
          </div>
        </div>
    </div>
  )
}


export default Collection
