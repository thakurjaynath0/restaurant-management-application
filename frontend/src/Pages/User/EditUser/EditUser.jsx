import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaChevronDown, FaChevronLeft, FaChevronUp, FaEdit, FaLock, FaUserAlt } from 'react-icons/fa';
import "./edit.css";
import UserIMG from "../../../assets/user.jpg"
import { useDeleteUserMutation, useEditUserMutation, useResetPasswordMutation, useSingleUserQuery, useUploadImageMutation } from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/Loader/Loader';


const EditUser = () => {
    // params
    const {id} = useParams();
    // single user fetch
    const { data:fetchedData, isLoading: dataLoading, isFetching: dataFetching } = useSingleUserQuery(id);

    // used for change password container in css 
    const [isDropdownActive, setIsDropdwonActive] = useState(false);

    // changing the button according the status of is allowed to login
    const [isAllowedToLogin, setIsAllowedToLogin] = useState(fetchedData?.user?.isAllowedToLogin);
     
    const [data, setData] = useState(fetchedData?.user);

    // for all the changed data
    const [changedData, setChangedData] = useState(data);

    const [newPass, setNewPass] = useState({password: "", confirmPass: ""});
    
    const [editUser, {error: editUserError, isSuccess: editUserSuccess, isLoading: editUserLoading}] = useEditUserMutation();
    const [deleteUser, {error: deleteUserError, isSuccess: deleteUserSuccess, isLoading: deleteUserLoading}] = useDeleteUserMutation();
    const [resetPassword, {error: resetError,isSuccess: resetSuccess, isLoading: resetLoading}] = useResetPasswordMutation();
    const [uploadImage, {data: imageData, status:uploadImageStatus ,error: uploadImageError,isSuccess: uploadImageSuccess, isLoading: uploadImageLoading}] = useUploadImageMutation();
    const [passwordError, setPasswordError] = useState({status: false, message :  ""});
    const [frontendError, setFrontendError] = useState({status: false, msg: ""});

    const navigate = useNavigate();

    const handlePasswordSubmit = async (e)=> {
        e.preventDefault();

        if(newPass.password.length < 1 || newPass.confirmPass.length < 1){
            setPasswordError({status: true, message: "Password or confirm password cannot be empty"});
            setTimeout(()=> {
                setPasswordError({status: false, message: ""});
            }, 3000);
            return;
        }
        if(newPass.password !== newPass.confirmPass){
            setPasswordError({status: true, message: "Passwords donot match"});
            setTimeout(()=> {
                setPasswordError({status: false, message: ""});
            }, 3000);
            return;
        }
        await resetPassword({_id: id, password: newPass.password});

    }
    const handleImageUpload = async (e)=> {
        const image = e.target.files[0];
        let img = new FormData();
        img.append("image", image);
        await uploadImage(img);
    }

    const handleEditDetailsSubmit  = async(e)=> {
        e.preventDefault();
        await editUser(changedData);
    }

    const handleUserDelete = async (e) => {
        e.preventDefault();
        await deleteUser({_id :id});
    }

    const handleBlockUser = async() => {
        await editUser({...data, isAllowedToLogin: false});
    }

    const handleUnblockUser = async () => {
        await editUser({...data, isAllowedToLogin: true});
    }

    useEffect(()=>{
        setData(fetchedData?.user)
        setChangedData(fetchedData?.user);
        setIsAllowedToLogin(fetchedData?.user?.isAllowedToLogin);
    },[fetchedData, editUserSuccess, data]);
    
    useEffect(()=> {
        uploadImageSuccess && setChangedData({...changedData, profile_pic: imageData.filePath})
    }, [uploadImageSuccess]);
    
    useEffect(()=> {
        deleteUserSuccess && navigate("/users");
    } , [ deleteUserSuccess, navigate]);

    useEffect(()=> {
        if(editUserError){
            if(typeof editUserError?.data?.msg === "object"){
                Object.keys(editUserError?.data?.msg).slice(0,1).map(item => setFrontendError({status: true, msg: editUserError?.data?.msg[item]}))
            }
            if(typeof editUserError?.data?.msg === "string"){
                setFrontendError({status: true, msg: editUserError?.data?.msg});
            }
        }
        if(uploadImageError){
            setFrontendError({status: true, msg: uploadImageError?.data?.msg});
        }
        const timer1 = setTimeout(()=> {
            setFrontendError({status: false, msg: ""});
        }, 5000);
        return (()=> {
            clearTimeout(timer1);
        })
    }, [uploadImageError, editUserError]);



    if(editUserLoading || dataLoading){
        return (
            <Loader/>
        )
    }  
    
  return (
      <main className='edit'>
        <div className="back-icon" onClick={()=> navigate("/users")}><FaArrowLeft/></div>
       <div className="edit-user-container">
           <div className="edit-top">
                <div className="edit-title">Edit Profile</div>
                <div className="edit-image-container">
                    {uploadImageLoading?
                        <div className="loading"><div className="small-loader"></div></div>
                    :
                        <>
                            <img src={changedData?.profile_pic || UserIMG} alt="" />
                            <div className="edit-icon">
                                <FaEdit/>
                            </div>
                            <input type="file" accept='image/*' className='select-image'  onChange={handleImageUpload}/>
                        </>
                
                    }
                </div>
                <div className="user-name">{data?.name}</div>
                <div className="user-position">{data?.position}</div>
           </div>

           <form className="form-container edit-form-container" onSubmit={handleEditDetailsSubmit}>
               <small className="error">
                   {frontendError && frontendError.msg}

               </small>
                <div className="form-control">
                    <label htmlFor="">Name <span className='red'>*</span></label>
                    <FaUserAlt/>
                    <input type="text" name="name" placeholder='name' value={changedData?.name} onChange={(e)=> setChangedData({...changedData, name: e.target.value })} required/>
                    <small className="error">username cannot be empty</small>
                </div>
                <div className="form-control">
                    <label htmlFor="">Username <span className='red'>*</span></label>
                    <FaUserAlt/>
                    <input type="text" name="username" placeholder='username' value={changedData?.username} onChange={(e)=> setChangedData({...changedData, username: e.target.value })} required/>
                    <small className="error">username cannot be empty</small>
                </div>
               <div className="form-control position-control">
                    <label htmlFor="">Position <span className='red'>*</span></label>
                   <select name="position" id="position" value={changedData?.position} onChange={(e)=> setChangedData({...changedData, position: e.target.value })} required>
                       <option value="cook" className='options'>Cook</option>
                       <option value="waiter">Waiter</option>
                       <option value="accountant">Accountant</option>
                   </select>
               </div>
               <div className="save-btn-container">
                   <button type="submit" className='btn submit-btn' >{editUserLoading ? "Loading": "Save"}</button>
               </div>
            </form>
            <br />
            <div className="details">Other actions</div>
            <div className="seperator"></div>
            <div className="change-password-container">
                {
                    (passwordError.status || resetError)&& 
                        <small className="small-error active">{passwordError.message || resetError?.data?.msg?.password || resetError?.data?.msg}</small>
                }
                {
                    resetSuccess &&
                    <small className='small-success active'>Passowrd successfully changed</small>
                }
                <span>change password</span>
                <div className="edit-dropdown-icon" onClick={()=>setIsDropdwonActive(!isDropdownActive)}>
                    {isDropdownActive ? <FaChevronUp/> : <FaChevronDown/>}

                </div>
                <div className={isDropdownActive ? "form-container active": "form-container"}>
                    <div className="form-control">
                        <FaLock/>
                        <input type="password" name="change-password" placeholder='enter the new password' value={newPass.password} onChange={(e)=> setNewPass({...newPass, password: e.target.value})}/>
                    </div>
                    <div className="form-control">
                        <FaLock/>
                        <input type="password" name="confirm-password" placeholder='confirm password' value={newPass.confirmPass} onChange={(e)=> setNewPass({...newPass, confirmPass: e.target.value})}/>

                    </div>
                    <button type='submit' className="btn submit-btn" onClick={handlePasswordSubmit} disabled={resetLoading}>
                        {resetLoading ? "Loading" : "Save"}
                    </button>
                </div>

            </div>
           {/* </form> */}
           {deleteUserError && <small className='delete-error active'>{deleteUserError?.data?.msg}</small>}
           <div className="actions-btn-container">
               { isAllowedToLogin?
                    <button className='btn block-unblock unblocked' onClick={handleBlockUser} disabled={dataFetching}>{(editUserLoading || dataFetching)? "Loading" : "Block user"}</button>
                    :
                    <button className='block-unblock-btn blocked' onClick={handleUnblockUser } disabled={dataFetching}>{(editUserLoading || dataFetching)? "Loading" : "Unblock user"}</button>
                }
               <button className="delete-user-btn" onClick={handleUserDelete}>{deleteUserLoading ? "Deleting user": "Delete user"}</button>
           </div>
       </div>
      </main>

  )
}

export default EditUser