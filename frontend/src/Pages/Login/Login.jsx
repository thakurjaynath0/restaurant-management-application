import React, { useEffect, useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import './login.css'
import Logo from '../../assets/shape1.png';
import { useLoginMutation } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [login, {error, isSuccess, isLoading}] = useLoginMutation();
    const [credentials, setCredentials] = useState({
        username:'',
        password:''
    })
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(credentials);
        e.target.reset();
    }

    useEffect(()=>{
        isSuccess && navigate('/');
    },[navigate, isSuccess])

  return (
    <div className="main-container">
        <div className='login-container'>
            <div className="svg svg-top">
                <img src={Logo} alt="svg" />
            </div>
            <div className="inner-wrapper">
                <div className="title">Login</div>
                <div className="tagline">Please sign in to continue.</div>
                <form className="form-container" onSubmit={handleLogin}>
                    <p className={"login-error "+(error && "active")}>{error?.data?.msg}</p>
                    <p className={"login-success "+(isSuccess && "active")}>{'Logged in successfully !!!'}</p>
                    <div className="form-control">
                        <FaUserAlt/>
                        <input type="text" className='username' placeholder='username...' onChange={(e) => setCredentials({...credentials, username:e.target.value})}/>
                        <small className={"error"}></small>
                    </div>
                    <div className="form-control">
                        <FaLock/>
                        <input type="password" className='password' placeholder='password...' onChange={(e) => setCredentials({...credentials, password: e.target.value})}/>
                        <small className="error">Incorrect password!</small>
                    </div>
                    <div className="btn-container">
                        <button className="login-btn" type='submit' disabled={isLoading}>{isLoading ? "Loading": "Login"}</button>
                    </div>  
                </form>
                {/* <div className="bottom-text">Forgot password? <span className='highlight'>contact admin</span></div> */}
            </div>
            <div className="svg svg-bottom">
                <img src={Logo} alt="svg" />
            </div>
        </div>
    </div>
  )
};

export default Login;
