import User from '../models/userModel.js'
import generateToken from '../utilis/generateToken.js'
import sendVerificationToken from '../helpers/sendEmail/sendEmail.js'
import jwt from 'jsonwebtoken'

const getAllUsers = async(req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        res.stat(500).json({message: error})
    }
}

const registerUser = async(req, res) => {
    try {
        const {name, email, password, isContributor} = req.body
        const user = await User.create({
        name,
        email, 
        password,
        isContributor
        })
        
        generateToken(res, user._id)
        res.status(200).json(user)
    } catch (error) {
        // console.log(error)
        if (error.code && error.code === 11000) {
          return res.status(500).json({message: 'Email already exists' });
        }
        Object.values(error.errors).map(({properties}) => {
          console.log(properties.message)
          if(properties.message === "name is required") {
           return res.status(500).json({message: "name is required"}) 
          }else
          if(properties.message === "email is required"){
            return res.status(500).json({message: "email is required"}) 
          }else 
          if(properties.message === "password is required") {
            return res.status(500).json({message: "password is required"})
          }else 
          if(properties.message === "Password must be at least 6 characters") {
            return res.status(500).json({message: "Password must be at least 6 characters"})
          }else {
            return res.status(500).json({message: "fill all fields please"})
          }
        })  
    }
}

const loginUser = async(req, res) => {
    try {
        const {email, password} = req.body

        if(email && password) {
            const user = await User.findOne({email})

            if(user && (await user.checkPassword(password))) {
                generateToken(res, user._id)
            return res.status(200).json(user)
            }else {
                return res.status(400).json({message: "wrong password"})
            }
        }else {
           return res.status(400).json({message: "Invalid Email or password"})
        }
       
       
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
}

const registerByGoogle = async(req, res) => {
try {

  const { accessToken } = req.body;

  const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
  const getPayLoad = await response.json();

  let user = await User.findOne({email: getPayLoad?.email});

  if(user) {
  return res.status(400).json({message: 'This email already exists'})
  }

  const userNameRes = await fetch('https://people.googleapis.com/v1/people/me?personFields=names', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userObjName = await userNameRes.json();
  const userName = userObjName.names[0]?.displayName;

  const defaultPassword = Math.random().toString(36).slice(-8);

  const newUser = await User.create({
    name:userName,
    email: getPayLoad?.email, 
    password: defaultPassword
  })

  generateToken(res, newUser._id)
return   res.status(200).json({
        name: newUser.name, 
        email: newUser.email,
        isAdmin: newUser.isAdmin
    })
} catch (error) {
    console.log(error)
    res.status(500).json({message: error})
}
}

const loginByGoogle = async(req, res) => {
  try {
    const { accessToken } = req.body;
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);

    const getPayLoad = await response.json();

    let user = await User.findOne({email: getPayLoad?.email});
    if(!user) {
      return res.status(400).json({message: 'You do not have an account Register first'})
    }
    
    generateToken(res, user._id)
    return res.status(200).json({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        })

  } catch (error) {
    console.log(error)
    res.status(500).json({message: error})
  }
}


const editUser = async(req, res) => {
    try {
        const user = await User.findById(req.user._id)
        const {name, email, password} = req.body

        if(user) {
            user.name = name || user.name
            user.email = email || user.email

            if(password) {
                user.password = password
            }

            const updatedUser = await user.save()

            res.status(200).json({
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
}

const resetPasswordRequest = async(req, res) => {
    try {
        const {email} = req.body

       const token = jwt.sign({email}, process.env.SECRET, {
        expiresIn: '3d'
      })
      const user = await User.findOne({email})
      const passwordResetContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
      }
      h1 {
        color: #007bff;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Password Reset Request</h1>
      <p>Dear ${user.name},</p>
      <p>We have received a request to reset the password for your account. If you did not initiate this request, please ignore this email, and your password will remain unchanged.</p>
      <p>If you did request a password reset, please click on the following link to reset your password:</p>
      <p><a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Reset Password</a></p>
      <p>This link will expire in 24 hours for security reasons.</p>
      <p>If you have any further questions or concerns, please don't hesitate to contact our support team.</p>
      <p>Thank you for your cooperation.</p>
      <p>Best regards,<br>SUGIRA COMPANY</p>
    </div>
  </body>
</html>
`;
      sendVerificationToken(email, "Password Reset Request",passwordResetContent)
      return res.status(200).json({message: "email sent successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
} 

const resetPassword = async(req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { password } = req.body
  console.log(password)
  if(token) {
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        const user  = await User.findOne({email: decoded.email}).select('-password')
  
        if(user) {

         if(password) {
              user.password = password
          }
            await user.save()
         return res.status(200).json({message: "password edited successfully"})
        }
    } catch (error) {
      console.log(error)
        res.status(400).json({message: "Invalid Token"})
    }
}else {
   res.status(500).json({message: "There is no token"})
   console.log({message: "there is no token"})
}
}

const logoutUser = (req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0
        })
        res.status(200).json({message: 'logout successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
}


const deleteUser = async(req, res) => {
    try {
        const { id } = req.params
        await User.findByIdAndDelete(id)

        res.status(200).json({message: 'deleted successfully'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error})
    }
}

export {
    getAllUsers,
    registerUser,
    loginUser,
    loginByGoogle,
    registerByGoogle,
    resetPasswordRequest,
    resetPassword,
    editUser,
    logoutUser,
    deleteUser
}