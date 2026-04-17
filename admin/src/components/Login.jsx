import React from 'react'
import axios from 'axios'
import { BackendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({setToken}) => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const onSubmitHandler = async(e)=>{
       try {
            e.preventDefault();
           
            const response = await axios.post(BackendUrl + "/api/user/admin", {
                  email,
                  password,
                });
            if(response.data.success){
              setToken(response.data.token);
              } else {
                toast.error(response.data.message);
              }
       } catch (error) {
            toast.error(error.message);
        
       }
   }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
    <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
      Admin Panel
    </h1>

    <form  className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Email Address
        </p>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
          type="email"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">
          Password
        </p>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-gray-400"
          type="password"
          placeholder="password"
          required
        />
      </div>

      <button
        onClick={onSubmitHandler}
        className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-300 cursor-pointer"
        type="submit"
      >
        Login
      </button>
    </form>
  </div>
</div>
  )
}

export default Login
