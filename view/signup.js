function submitForm(event){
    event.preventDefault()
    let name = event.target.name.value;
    let email = event.target.email.value;
    let password = event.target.password.value;

    const obj = {
        name,
        email,
        password
    }

    axios.post('http://52.66.204.112:3000/user/sign-up',obj)
    .then((res)=>{
      alert('click to sign-in')
      window.location.href = "./signin.html";
    })
    .catch((err)=>{
      document.body.innerHTML = document.body.innerHTML + "<h4> Something went wrong </h4>"
      console.log(err)
    })

};
function showUserOnScreen(data){
  document.body.innerHTML+=data;
}