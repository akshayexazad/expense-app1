const pagination = document.getElementById('pagination');
const selectElement = document.getElementById('rowPerPage');


// console.log(selectElement.value)


selectElement.addEventListener("change", async () => {
  let token = localStorage.getItem('token')

  const selectedOption = selectElement;
  const rowsize = selectedOption.value;
  localStorage.setItem('pagesize', rowsize);
  const pageno = localStorage.getItem('pageno')
  const expenseLI = await axios.get(`http://52.66.204.112:3000/expense/getExpense?param1=${pageno}&param2=${rowsize}`, { headers: { "Authorization": token } });
  console.log(expenseLI);
  showPagination(
      expenseLI.data.currentPage,
      expenseLI.data.hasNextPage,
      expenseLI.data.nextPage,
      expenseLI.data.hasPreviousPage,
      expenseLI.data.previousPage,
      expenseLI.data.lastPage)
  for (let index = 0; index < expenseLI.data.users.length; index++) {
    showOrderOnSreen(expenseLI.data.users[index]);
  }

})

async function expense(event) {
  event.preventDefault();
  const obj = {
    price: event.target.price.value,
    category: event.target.category.value,
    description: event.target.description.value
  };

  const token = localStorage.getItem('token')
  //for post
  await axios.post('http://52.66.204.112:3000/expense/add-expensedata', obj, { headers: { "Authorization": token } })
    .then((Res) => {

      showOrderOnSreen(Res.data.newuser);

    }).catch((err) => {
      document.body.innerHTML = document.body.innerHTML + "somthing went wrong";
      console.log(err.message);
    })
};

// already premium user
function showPremiumUserMessage() {
  document.getElementById('rze-pay-btn').style.visibility = "hidden";
  document.getElementById('add-premium').innerHTML = 'You Are a Premium User'

}
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

// for get Request 

window.addEventListener("DOMContentLoaded", async () => {
  const objUrlParams = new URLSearchParams(window.location.serach);
  var pageno = objUrlParams.get("pageno") || 1;
  // console.log(pageno)
  localStorage.setItem('pageno', pageno);
  var pagesize = localStorage.getItem('pagesize') || 5
  // console.log(pagesize)
  const token = localStorage.getItem('token')
  const decodeToken = parseJwt(token)
  // console.log(decodeToken)
  const isAdmin = decodeToken.ispremiumuser;
  if (isAdmin) {
    showPremiumUserMessage()
    showLeaderBord()

  }

  const expenseLI = await axios.get(`http://52.66.204.112:3000/expense/getExpense?param1=${pageno}&param2=${pagesize}`, { headers: { "Authorization": token } });

  showPagination(
    expenseLI.data.currentPage,
    expenseLI.data.hasNextPage,
    expenseLI.data.nextPage,
    expenseLI.data.hasPreviousPage,
    expenseLI.data.previousPage,
    expenseLI.data.lastPage)
  for (var i = 0; i < expenseLI.data.users.length; i++) {
    showOrderOnSreen(expenseLI.data.users[i])
  }

});
// pagination 
function showPagination(currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage) {
  pagination.innerHTML = '';
  if (hasPreviousPage) {
    const btn2 = document.createElement('button')
    btn2.innerHTML = previousPage
    btn2.addEventListener('click', function (event) {
      event.preventDefault()
      getProducts(previousPage)
    })
    pagination.appendChild(btn2)

  }

  const btn1 = document.createElement('button')
  btn1.innerHTML = `<h3>${currentPage}</h3>`
  btn1.addEventListener('click', function (event) {
    event.preventDefault()
    localStorage.setItem('pageno', currentPage)
    getProducts(currentPage)
  })
  pagination.appendChild(btn1)

  if (hasNextPage) {
    pagination.innerHTML = '';
    const btn3 = document.createElement('button')
    btn3.innerHTML = nextPage
    btn3.addEventListener('click', function (event) {
      event.preventDefault()
      getProducts(nextPage)
    })
    pagination.appendChild(btn3)
  }

}

async function getProducts(page) {
  const token = localStorage.getItem("token")
  var rowsize = localStorage.getItem('pagesize')
  localStorage.setItem('pageno', page)
  pagination.innerHTML = '';
  const expenseLI = await axios.get(`http://52.66.204.112:3000/expense/getExpense?param1=${page}&param2=${rowsize}`, { headers: { "Authorization": token } })
  console.log(expenseLI.data)

  for (let i = 0; i < expenseLI.data.users.length; i++) {
    const parentNode = document.getElementById("listOfUsers");
    parentNode.innerHTML = '';
    showOrderOnSreen(expenseLI.data.users[i]);
  }

  showPagination(
    expenseLI.data.currentPage,
    expenseLI.data.hasNextPage,
    expenseLI.data.nextPage,
    expenseLI.data.hasPreviousPage,
    expenseLI.data.previousPage,
    expenseLI.data.lastPage
  )


}

// for Showuser on screen

function showOrderOnSreen(order) {
  document.getElementById("price").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  const parentNode = document.getElementById("listOfUsers");
  const childHTML = `<li id=${order.id}> ₹${order.price} - ${order.category} - ${order.description} 
     <button onclick=deleteUser('${order.id}')> Delete</button> </li>`;
  parentNode.innerHTML = parentNode.innerHTML + childHTML;
}

//for edit User 

function editUserDetails(price, category, description, userid) {
  document.getElementById("price").value = price;
  document.getElementById("category").value = category;
  document.getElementById("description").value = description;
  edituserid = userid;
  removeUserFromScreen(userid);


}


// for Delete user

function deleteUser(user) {
  let token = localStorage.getItem('token')

  axios.delete(`http://52.66.204.112:3000/expense/delete-expense/${user}`, { headers: { 'Authorization': token } })
    .then((res) => {
      removeUserFromScreen(user);
    }).catch((err) => {
      let error = err.response.data.message;
      document.getElementById('color-for-error').innerHTML = `<span style='color: red;'>${error}</span>`;
    });
};

// for remove user from screen

function removeUserFromScreen(user) {
  const parentNode = document.getElementById("listOfUsers");
  const childNodeToBeDeleted = document.getElementById(user);
  if (childNodeToBeDeleted) {
    parentNode.removeChild(childNodeToBeDeleted);
  }
};

// for razor pay payment

document.getElementById('rze-pay-btn').onclick = async function (e) {

  const token = localStorage.getItem('token');
  const response = await axios.get('http://52.66.204.112:3000/purchase/premiummembership', { headers: { 'Authorization': token } })

  var options = {
    "key": response.data.key_id,
    "order_id": response.data.order.id,
    "handler": async function (response) {
      const res = await axios.post('http://52.66.204.112:3000/purchase/premiumUpdateStatus', {
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,

      }, { headers: { 'Authorization': token } });
      // remove button

      const dltbtn = document.getElementById("rze-pay-btn");
      dltbtn.parentNode.removeChild(dltbtn);
      // add list item
      const node = document.createElement("h3");
      const textnode = document.createTextNode("You are a Premium user");
      node.appendChild(textnode);
      document.getElementById("add-premium").appendChild(node);
      localStorage.setItem('token', res.data.token);
      //premium user features
      showLeaderBord()

    }
  }



  const rzpl = new Razorpay(options);
  rzpl.open();
  e.preventDefault();
  rzpl.on('payment fail', function (response) {
    alert("somthing went wrong")
  })

};
//leader bord 

function showLeaderBord() {

  const inputElement = document.createElement("input");
  inputElement.type = "button";
  inputElement.value = 'Show Leaderboard';
  inputElement.onclick = async () => {
    const token = localStorage.getItem('token');
    const userLeaderboardArray = await axios.get('http://52.66.204.112:3000/premium/showleaderboard', { headers: { "Authorization": token } });
    const leaderboardElm = document.getElementById('leader-board');
    leaderboardElm.innerHTML += `<h1>Leader Board </h1>`;
    userLeaderboardArray.data.forEach((user) => {
      leaderboardElm.innerHTML += `<li> Name :- ${user.name} and Total Expense :- ${user.totalExpenses}`
    })

  }
  document.getElementById('userleader-button').appendChild(inputElement)
}




// for download features
function download() {
  const token = localStorage.getItem('token');
  axios.get('http://52.66.204.112:3000/user/download', { headers: { "Authorization": token } })
    .then((response) => {
      if (response.status === 200) {
        // console.log(response.data.fileURL)
        var a = document.createElement("a");
        a.href = response.data.fileURL;
        a.download = 'myexpense.csv';
        a.click();
      } else {
        throw new Error(response.data.message)
      }

    })
    .catch((err) => {
      console.log(err)
    });
};

async function downloadfiledata(){
  const token = localStorage.getItem('token')
  try {
    const downloaddetail = await axios.get('http://52.66.204.112:3000/user/downloadfiledata', { headers: { "Authorization": token } })

    // console.log(downloaddetail)
    var downloadElem = document.getElementById('downloadedfile')
    downloadElem.innerHTML += '<h1> All Downloads </<h1>'
    for (let i = 0; i <= downloaddetail.data.downloadFileData.length; i++) {
      // console.log(downloaddetail.data.downloadFileData[i].downloaddate)
      downloadElem.innerHTML += `<li>downloadDate - ${downloaddetail.data.downloadFileData[i].downloaddate}
          URL - ${downloaddetail.data.downloadFileData[i].filename} 
          <button onClick = downloadFile('${downloaddetail.data.downloadFileData[i].filename}')>download</button></li>`
    }


  } catch (err) {
    console.log(err)
  }
};

function downloadFile(fileUrl) {
  var url = fileUrl; // replace with your file URL
  var a = document.createElement('a');
  a.href = url;
  a.download = 'Expense.pdf'; // replace with your desired file name
  a.click();
}