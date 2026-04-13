import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'


const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t ">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img src={assets.about_img} alt="" className="w-full md:max-w-[450px]" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, ullam illo possimus quam harum voluptates repudiandae ab unde vel quibusdam?</p>
        <p>This is a premium quality product made with soft and comfortable fabric. Designed for daily wear with a modern and stylish look. Perfect for casual outings and all-day comfort.</p>
        <b className="text-gray-800">Our Mission</b>
        <p>Our mission is to create a seamless shopping experience by offering premium quality products, affordable prices, and reliable customer support. We are committed to building trust with our customers and continuously improving our services to meet their needs and expectations.</p>
        </div>
      </div>
      <div className="text-2xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">We are committed to maintaining the highest standards of quality in every product we offer. Each item is carefully selected and inspected to ensure durability, comfort, and customer satisfaction.</p>
        </div>
        <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Convenience:</b>
          <p className="text-gray-600">We focus on making shopping easy, fast, and convenient for our customers. From simple navigation to secure checkout and quick delivery, every step is designed to save time and provide a smooth experience.</p>
        </div>
        <div className="border border-gray-200 px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 ">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">We are dedicated to providing exceptional customer service at every step of your shopping journey. Our support team is always ready to assist with queries, resolve issues quickly, and ensure a smooth and satisfying experience.</p>
        </div>
      </div>
      <NewsletterBox/>
      
    </div>
  )
}

export default About
