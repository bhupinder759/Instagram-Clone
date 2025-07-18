import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import axios from "axios"
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();   // refresh per data not to be lost
        console.log(input)
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials:true 
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate("/");
                toast.success(res.data.message);
                setInput({ email: "", password: "" });
                setLoading(false);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    })
  return (
    <div className='flex items-center w-screen h-screen justify-center'>

      <form onSubmit={signupHandler} action="" className='shadow-lg flex flex-col gap-5 p-8'>
        <div className='my-4'>
         <h1 className='text-center font-bold text-xl'>LOGO</h1>
         <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
        </div>

        <div>
            <Label className="py-2 font-medium">Email</Label>
            <Input type="email"
             value={input.email}
             onChange={changeEventHandler}             
             className="focus-visible:ring-transparent"
             name="email"></Input>
        </div>

        <div>
            <Label className="py-2 font-medium">Password</Label>
            <Input type="password"
             value={input.password}
             onChange={changeEventHandler}
             className="focus-visible:ring-transparent"
             name="password"></Input>
        </div>

        {
            loading ? (
                <Button>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please Wait
                </Button>
            ) : ( 
            <Button type="submit">Login</Button>
            )
        }

        <span className='text-center'>Dosent have an account? <Link to='/signup' className='text-blue-600'>Signup</Link></span>

      </form>
    </div>
  )
}

export default Login
