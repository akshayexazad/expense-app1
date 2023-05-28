async function forgot_password(event){
    event.preventDefault()
    const email = event.target.reset_email.value;
    const obj = {
        email
    }
    axios.post('http://65.2.9.206:3000/password/forgotpassword',obj).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}