import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="w-full px-4 sm:px-8 overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[3fr_1fr_1fr] gap-10 my-10 mt-40 text-sm">
        <div>
          <img src={assets.logo} className="mb-5 w-32" alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum, accusantium!
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mt-3 mb-5">COMPANY</p>
          <ul className="flex flex-col mt-2 gap-1 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mt-3 mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col mt-2 gap-1 text-gray-600">
            <li>+1-222-345-67890</li>
            <li className="break-all">contact@forever.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright © 2026 All rights reserved | This template is made by Colorlib
        </p>
      </div>
    </div>
  )
}

export default Footer