import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../services/firebase";

const useAddData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState(null);

  const addData = async (path, data) => {
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      // Add data to Firestore
      let response = await addDoc(collection(db, path), data);
      setResponse("Data written successfully!" + response);
      return response;
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, errorMessage, response, addData };
};

export default useAddData;
