const { v4: uuidv4 } = require('uuid')
const Sib = require('sib-api-v3-sdk')
const bcrypt = require('bcryptjs');

require('dotenv').config()

const User = require('../model/usertable');

const Forgotpassword = require('../model/forgotpassword');

// send mail to user


const forgotpassword = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        // console.log(user)

        if (user === null) {
            res.status(404).json({
                status: "fail",
                message:
                    "User with this mail Id no longer exist please use the correct mail id you had provided",
            });
        }
        if (user!== null) {
            const id = uuidv4();

            await Forgotpassword.create({
                id,
                UserId: user.dataValues.id,
                isActive: true,
            });

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications["api-key"];
            apiKey.apiKey = process.env.MAIL_API_KEY;

            const tranEmailApi = new Sib.TransactionalEmailsApi();


            const sender = {
                email: "expensetracker@gmail.com",
                name: "Akshay",
            };
        
            const receivers = [
                {
                    email: email,
                },
            ];

            tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: "Password reset link",
                    textContent: `Please use this link for changing your password `,
                    htmlContent: `<h3>Reset Your Password</h3>
                                <a href="http://52.66.204.112:3000/password/resetpassword/${id}">Click here </a>                     `,
                })
                .then(() => {
                    res.status(202).json({
                        status: "success",
                        message:
                            "Password reset link has send to you via email successfully",
                    });
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    } catch (err) {
        console.log(err)
        res.status(404).json({
            status: "fail",
            message: err.message,
        });
    }

};

// send reset link


const resetpassword = (req, res) => {
    console.log(req.params)
    const id = req.params.id;
    Forgotpassword.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest) {
            forgotpasswordrequest.update({ active: false });
            res.status(200).send(`<html>
            <body>
            <div><h1>EXPENSE TRACKER</h1></div><hr>
                <div class="container">
                  <form  class="form-control form-control-sm">
                    <label for="password" class="form-label">NewPassword:</label><br><br>
                    <input type="password" id="password" class="form-control" required /><br><br>
                    <button class="btn">Reset Password</button>
                  </form>
                </div>
                <script >

                const btnSubmit = document.querySelector(".btn");
                
                btnSubmit.addEventListener("click", async (e) => {
                  try{
                
                    e.preventDefault();
                    const password = document.getElementById("password").value;

                    const newpassword = {
                        password
                    }
                
                
                    if (password) {

                        console.log('password hai')
                   const response =   await axios.post("http://52.66.204.112:3000/password/updatepassword/${id}",newpassword);
                       alert(response.data.message);
                      window.location.replace("http://52.66.204.112:3000/signin.html");
                    }
                
                  }catch(err){
                   alert(err.message)
                  }
                });</script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.0/axios.min.js"></script>
                  </body>
                
                </html>`
            )

            res.end()

        }
    })
}
// update password
const updatepassword = async (req, res) => {

    try {

        const password = req.body.password;
        const { resetpasswordid } = req.params;
        console.log(password)
        const resetpasswordrequest = await Forgotpassword.findOne({ where: { id: resetpasswordid } });

        const user = await User.findOne({ where: { id: resetpasswordrequest.UserId } });

        if (user) {
            const addonstring = 10;

            bcrypt.hash(password, addonstring, async (err, hash) => {
                console.log(hash)
                if (err) {
                    console.log(err)
                }
                else {
                    user.password = hash;
                    await user.save();
                    res.status(201).json({ message: 'Successfully update the new Password' })
                }
            })
        }

    } catch (error) {
        return res.status(403).json({ error, success: false })
    }

}



module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}