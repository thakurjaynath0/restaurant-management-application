const $ = (selector) => document.querySelector(selector);


const loginForm = $("#login-form");

class CustomError extends Error {
    constructor({data, status=500, message='Error'}){
        super(message);
        this.data=data;
        this.status=status;
    }
}


loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    // login 
    try{
        await login({username, password});
    } catch (err) {
        e.target[1].value = "";
        return handleError(err);
    }

    window.location = "/admin/";
}


var login = async ({username, password}) => {
    let response = await fetch("/api/v1/users/auth/login", {
        method:"POST",
        headers:{
            "content-type": "application/json"
        },
        body:JSON.stringify({ username , password })
    })
    if(!(response.status === 200)){
        throw new CustomError({data:await response.json(), status:response.status||500 });
    }

    return true;
};


var handleError = (error) => {
    console.log('Handle error called .')
    const errorContainer = $("#error");
    errorContainer.innerHTML = error?.data?.msg || "Something went wrong .";
    setTimeout(() => {
        errorContainer.innerHTML = "";
    }, 5000)
};


