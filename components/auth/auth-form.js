import { useRef, useState } from 'react';
import classes from './auth-form.module.css';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';

const createUser = async (email, password) => {
  const res = await fetch(`/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
};

function AuthForm() {
  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(e) {
    e.preventDefault();

    const emailVal = emailRef.current.value;
    const pwdVal = pwdRef.current.value;

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email: emailVal,
        password: pwdVal,
      });
      console.log(result);

      if (!result.error) {
        router.replace('/profile');
      }
    } else {
      try {
        const result = await createUser(emailVal, pwdVal);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth} onSubmit={submitHandler}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={pwdRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
