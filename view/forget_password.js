async function forgot_password(event){
    event.preventDefault()
    const email = event.target.reset_email.value;
    const obj = {
        email
    }
    axios.post('http://52.66.204.112:3000/password/forgotpassword',obj).then((res)=>{
        const message = document.getElementById('success_forgot_msg');
        message.innerHTML = res.data.message;
    }).catch((err)=>{
        console.log(err)
    })
}