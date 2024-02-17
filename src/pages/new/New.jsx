import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import useCreateUser from "../../hooks/useCreateUser";
import useSetData from "../../hooks/useSetData";
import { serverTimestamp } from "firebase/firestore";
import { storage } from "../../services/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const New = ({ inputs, title }) => {
  const { loading: userCreating, createUser, errorMessage } = useCreateUser();
  const { loading, setData, errorMessage: storeDataError } = useSetData();

  const [file, setFile] = useState(false);
  const [formData, setFormData] = useState([]);
  const [imageUrl, setImageUrl] = useState(undefined);

  function inputHandler(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  // form submit handler
  async function addNewUser(e) {
    e.preventDefault();
    try {
      // 1. create user inside firebase authentication
      let newUser = await createUser(formData.email, formData.password);
      console.log("------------------------------user created----------------");

      // 2. upload profile inside firebase storage
      if (file) {
        let fileName = new Date().getTime() + file.name;
        const imageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(imageRef, file);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              resolve();
            }
          );
        });

        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
      }
      console.log(
        "---------------------------------file upload--------------------------------"
      );

      // 3. store new user record inside firebase fire-store
      await setData(
        "/users",
        { ...formData, profile: imageUrl, timeStamp: serverTimestamp() },
        newUser.uid
      );
      console.log(
        "---------------------------------user record--------------------------------"
      );

      // 3. clean up form and form data state
      setFormData({});
      setFile(false);
      return e.target.reset();
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={addNewUser}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={inputHandler}
                    required
                  />
                </div>
              ))}
              <button disabled={userCreating || loading}>
                {userCreating || loading ? "loading" : "Add User"}
              </button>
            </form>
            {(errorMessage || storeDataError) && (
              <div className="error">{errorMessage || storeDataError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
