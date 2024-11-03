import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.SECRET, {
        expiresIn: '3d'
    })

    res.cookie('jwt', token, {
        maxAge: 3 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    }) 

    return token
}

export default generateToken