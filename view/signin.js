function submitForm(event){
    event.preventDefault()
    let email = event.target.email.value;
    let password = event.target.password.value;

    const obj = {
        email,
        password
    }

    axios.post('http://52.66.204.112:3000/user/sign-in',obj)
    .then((res)=>{
      // console.log('hello')
      // console.log(res)
      localStorage.setItem('token',res.data.token)
        if(res.data.newuser===null){
            const node = document.createElement("li");
            const textnode = document.createTextNode("404 Error found deu to email");
            node.appendChild(textnode);
            document.getElementById("myList").appendChild(node);
        }else{
          
          const node = document.createElement("li");
          const textnode = document.createTextNode(res.data.newuser);
          node.appendChild(textnode);
          document.getElementById("myList").appendChild(node);

          alert('click to Login')
          window.location = "./addExpense.html";
        }
    
    })
    .catch((err)=>{
      document.body.innerHTML= document.body.innerHTML+"user not authorised";
      console.log(err.message);
    })

};
function showUserOnScreen(data){
  document.body.innerHTML+=data;
}
function paymentpage(){
  location.href ="https://dashboard.razorpay.com/app/dashboard";
}