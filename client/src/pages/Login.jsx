import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import '../App.css';
import AuthService from '../utils/auth';
import { LOGIN_USER, SIGNUP_USER } from '../utils/mutations';

// GraphQL mutations

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and sign-up
  const [login, { error: loginError }] = useMutation(LOGIN_USER);
  const [signUp, { error: signUpError }] = useMutation(SIGNUP_USER);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isSignUp) {
        // Ensure passwords match
        if (formState.password !== formState.confirmPassword) {
          alert('Passwords do not match!');
          return;
        }

        const { data } = await signUp({
          variables: { username: formState.username, email: formState.email, password: formState.password },
        });

        AuthService.login(data.signUp.token);
      } else {
        const { data } = await login({
          variables: { email: formState.email, password: formState.password },
        });

        AuthService.login(data.login.token);
      }

      navigate('/home'); // Redirect to home page for logged-in users
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container
      fluid
      id="login-container"
      className="d-flex align-items-center justify-content-center"
    >
      <div className="login-form-container">
        <h2 className="text-center mb-4">{isSignUp ? 'Create an Account' : 'Welcome!'}</h2>
        <Form onSubmit={handleFormSubmit}>
          {isSignUp && (
            <FormGroup>
              <Label for="username">Username</Label>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Enter your username"
                value={formState.username}
                onChange={handleChange}
                required
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          {isSignUp && (
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formState.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormGroup>
          )}
          <Button color="primary" type="submit" block>
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
        </Form>
        {loginError && <p className="text-danger mt-3">Login failed. Please try again.</p>}
        {signUpError && <p className="text-danger mt-3">Sign-up failed. Please try again.</p>}
        <p className="text-center mt-4">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <Button color="link" onClick={() => setIsSignUp(false)}>
                Login here!
              </Button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <Button color="link" onClick={() => setIsSignUp(true)}>
                Sign up!
              </Button>
            </>
          )}
        </p>
      </div>
    </Container>
  );
};

export default Login;