import { useState } from "react";
import "./login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useAuth";

const Login = () => {
  const [error, setError] = useState(false);
  const [data, setData] = useState({});
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  function storeData(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  async function loginHandler(e) {
    e.preventDefault();
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = response.user;
      setAuth(user, true); //1.user details 2.isLoggedIn
      setData({});
      setError(false);
      e.target.reset();
      return navigate("/");
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }
  return (
    <div className="container">
      <form
        method="post"
        className="login_form"
        onSubmit={(e) => loginHandler(e)}
      >
        <input
          required
          type="email"
          name="email"
          placeholder="Enter email"
          onChange={(e) => storeData(e)}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={(e) => storeData(e)}
        />
        <input type="submit" value="Submit" />
        {error && (
          <div className="error">Please provide valid email/password</div>
        )}
      </form>
    </div>
  );
};

export default Login;
