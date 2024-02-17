import { useState } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState(null);

  const createUser = async (email, password) => {
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      // Add data to Firestore
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setResponse("User created successfully: " + response.user);
      return response.user;
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, errorMessage, response, createUser };
};

export default useCreateUser;
