    function readFile(input){
        const reader = new FileReader();
        reader.onload = (e) => {
            // setChangedData({...changedData, profile_pic: reader.result})
        }
        reader.onabort = (e)=> {
            return;
        }
        reader.readAsDataURL(input.files[0]);

        
    } 