import React, {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from '../components/Alert.tsx';
import { Loader } from '../components/Loader.tsx';
import { SignIn, SignUp } from '../APIServices/User.ts';

const LogInPage: React.FC = () => {
    const [alertVisible, setAlertVisibility] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let response;
            if (isSignUp) {
                response = await SignUp(username, password);
            } else {
                response = await SignIn(username, password);
            }
            sessionStorage.setItem('access_token', response.access_token);
            sessionStorage.setItem('username', username);
            navigate('/home/me');
        } catch (error) {
            setAlertVisibility(true);
            console.error('Erreur lors de la soumission:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loader/>
            ) : (
                <div>
                    <h1 className="text-center display-4 font-weight-bolder text-secondary mt-4">
                        Welcome to our Fake SocialNetwork !
                    </h1>
                    <div className="container mt-5">
                        <div className="container mt-5 d-flex justify-content-center">
                            <img src="../../public/file.png" alt="FREE RIGHTS LOGO" width="125" height="125"/>
                        </div>
                        <div className="row">
                            <div className="col-12 col-sm-8 col-md-6 m-auto">
                                {alertVisible &&
                                    <Alert onClose={() => setAlertVisibility(false)}>An error occurred</Alert>}

                                <div className="card border-0 shadow">
                                    <div className="card-title d-flex justify-content-between align-items-center pt-2 mt-5">
                                        <h1 className="text-center flex-grow-1">
                                            {isSignUp ? 'Sign In' : "Sign Up"}
                                        </h1>
                                    </div>

                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text">
                                                    <i className="bi bi-person"></i>
                                                </span>
                                                <input
                                                    className="form-control"
                                                    placeholder="username"
                                                    type="text"
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text">
                                                    <i className="bi bi-lock"></i>
                                                </span>
                                                <input
                                                    className="form-control"
                                                    placeholder="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                                                </button>
                                            </div>

                                            <div className="d-flex justify-content-between mt-3">
                                                <div className="text-start">
                                                    <button className="btn btn-outline-primary" type="submit">
                                                        {isSignUp ? 'Sign In' : 'Sign Up'}
                                                    </button>
                                                </div>
                                                <div className="text-end">
                                                    <Link to="#"
                                                          className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                                                          onClick={() => setIsSignUp(!isSignUp)}>
                                                        <small>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</small>
                                                    </Link>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LogInPage;
