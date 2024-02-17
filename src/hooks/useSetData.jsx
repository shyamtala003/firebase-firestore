import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const useSetData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [response, setResponse] = useState(null);

  const setData = async (path, data, uid) => {
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      // Add data to Firestore
      let response = await setDoc(doc(db, path, uid), data);
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

  return { loading, error, errorMessage, response, setData };
};

export default useSetData;
