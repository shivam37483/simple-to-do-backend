const bcrypt = require("bcrypt")
const express = require("express")
const { userModel, todoModel } = require("./db")
const jwt = require("jsonwebtoken")
const mongo = require("mongoose")

const { z } = require("zod")

mongo.connect("mongodb+srv://admin:yINLnskaAukH3uPS@cluster2099.geca1tb.mongodb.net/todos-app")

const JWT_SECRET = "Helpppppppjrlooooo"

const app = express()

app.use(express.json())

app.post('/signup', async (req, res) => {
    const requiredBody = z.object({
        username: z.string().min(3).max(100),
        email: z.string().email().min(3).max(100),
        password: z.string().min(3).max(30)
    })

    const parsedDataResult = requiredBody.safeParse(req.body)

    if (!parsedDataResult.success) {
        return res.json({
            message: "Incorrect Format",
            error: parsedDataResult.error
        })
    }

    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const hashedPassword = await bcrypt.hash(password, 11)

    await userModel.create({
        name: username,
        email: email,
        password: hashedPassword
    })

    res.json({
        op: "Signed up successfully"
    })
})

app.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const response = await userModel.findOne({
        email: email
    })

    if (!response) {
        return res.status(403).json({
            msg: "User does not exist"
        })
    }

    const matchedPassword = await bcrypt.compare(password, response.password)

    if (matchedPassword) {
        const token = jwt.sign({
            userid: response._id.toString()
        },
            JWT_SECRET
        )

        res.json({
            token: token
        })

    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
})

function auth(req, res, next) {
    const token = req.headers.token

    const jwt_response = jwt.verify(token, JWT_SECRET)

    if (jwt_response) {
        req.userid = jwt_response.userid
        next()
    } else {
        res.status(403).json({
            message: "invalid token"
        })
    }
}

app.post('/todos', auth, async (req, res) => {
    const title = req.body.title
    const done = req.body.done
    const userid = req.userid

    await todoModel.create({
        title: title,
        done: done,
        userID: userid
    })

    res.json({
        op: "Added successfully"
    })
})

app.get('/todos', auth, async (req, res) => {
    const userid = req.userid

    const todos = await todoModel.find({
        userID: userid
    })

    res.send(todos)
})

app.listen(3000)