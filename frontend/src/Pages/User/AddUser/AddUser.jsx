import React, { useState } from "react";
import { useEffect } from "react";
import {
  FaArrowLeft,
  FaChevronDown,
  FaChevronLeft,
  FaChevronUp,
  FaEdit,
  FaLock,
  FaUserAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserIMG from "../../../assets/user.jpg";
import Loader from "../../../components/Loader/Loader";
import {
  useCreateUserMutation,
  useUploadImageMutation,
} from "../../../services/api";

const initialVal = {
  name: "",
  username: "",
  password: "",
  confirmpass: "",
  position: "",
  profile_pic: "",
};
const AddUser = () => {
  const [
    uploadImage,
    {
      data: imageData,
      status: uploadImageStatus,
      error: uploadImageError,
      isSuccess: uploadImageSuccess,
      isLoading: uploadImageLoading,
    },
  ] = useUploadImageMutation();
  const [
    createUser,
    {
      error: createUserError,
      isSuccess: createUserSuccess,
      isLoading: createUserLoading,
    },
  ] = useCreateUserMutation();
  const [data, setData] = useState(initialVal);
  const [frontendError, setFrontendError] = useState({
    status: false,
    msg: "",
  });

  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    let img = new FormData();
    img.append("image", image);
    await uploadImage(img);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmpass) {
      setFrontendError({ status: true, msg: "passwords donot match" });
      setTimeout(() => {
        setFrontendError({ status: false, msg: "" });
      }, 3000);
      return;
    }

    await createUser(data);
  };

  useEffect(() => {
    imageData && setData({ ...data, profile_pic: imageData?.filePath || "" });
  }, [imageData]);

  useEffect(() => {
    if (createUserError) {
      if (typeof createUserError?.data?.msg === "object") {
        Object.keys(createUserError?.data?.msg)
          .slice(0, 1)
          .map((item) =>
            setFrontendError({
              status: true,
              msg: createUserError?.data?.msg[item],
            })
          );
      }
      if (typeof createUserError?.data?.msg === "string") {
        setFrontendError({ status: true, msg: createUserError?.data?.msg });
      }
    }
    if (uploadImageError) {
      setFrontendError({ status: true, msg: uploadImageError?.data?.msg });
    }
    const timer1 = setTimeout(() => {
      setFrontendError({ status: false, msg: "" });
    }, 3000);

    return () => {
      clearTimeout(timer1);
    };
  }, [uploadImageError, createUserError]);


  useEffect(() => {
    createUserSuccess && navigate("/users");
  }, [createUserSuccess, navigate]);

  if(createUserLoading){
    return <Loader/>
  }
  
  return (
    <main className="edit">
        <div className="back-icon" onClick={() => navigate("/users")}>
          <FaArrowLeft />
        </div>
      <div className="edit-user-container">
        <div className="edit-top">
          <div className="edit-title">Add profile</div>
          <div className="edit-image-container">
            <img src={data?.profile_pic || UserIMG} alt="" />
            <div className="edit-icon">
              <FaEdit />
            </div>
            <input
              type="file"
              accept="image/*"
              className="select-image"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <form
          className="form-container edit-form-container"
          onSubmit={handleFormSubmit}
        >
          <small className="error">
            {frontendError.status && frontendError.msg}
          </small>
          <div className="form-control">
            <label htmlFor="username">
              username <small className="red">*</small>
            </label>
            <FaUserAlt />
            <input
              type="text"
              name="username"
              placeholder="username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              required
            />
            <small className="error">username cannot be empty</small>
          </div>
          <div className="form-control">
            <label htmlFor="name">
              name <small className="red">*</small>
            </label>
            <FaUserAlt />
            <input
              type="text"
              name="name"
              placeholder="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
            />
            <small className="error">username cannot be empty</small>
          </div>
          <div className="form-control position-control">
            <label htmlFor="position">
              position <small className="red">*</small>
            </label>
            <select
              name="position"
              id="position"
              value={data.position}
              onChange={(e) => setData({ ...data, position: e.target.value })}
              required
            >
              <option value="" className="null-value">
                select a position
              </option>
              <option value="cook" className="options">
                Cook
              </option>
              <option value="waiter">Waiter</option>
            </select>
          </div>
          <div className="form-control">
            <label htmlFor="password">
              password <small className="red">*</small>
            </label>
            <FaLock />
            <input
              type="password"
              name="password"
              placeholder="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              required
            />
            <small className="error">password cannot be empty</small>
          </div>
          <div className="form-control">
            <label htmlFor="confirm-password">
              {" "}
              confirm password <small className="red">*</small>
            </label>
            <FaLock />
            <input
              type="password"
              name="confirm-pass"
              placeholder="confirm password"
              value={data.confirmpass}
              onChange={(e) =>
                setData({ ...data, confirmpass: e.target.value })
              }
              required
            />
            <small className="error">password cannot be empty</small>
          </div>
          <div className="save-btn-container">
            <button type="submit" className="btn submit-btn">
              Register
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddUser;
