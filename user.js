var express = require('express')
var jwt = require('jsonwebtoken')
var db = require('./db')
var router = express.Router()
var bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
router.post("/register", (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    db.query("select * from user where username = ?",[username],(err,results)=>{
        if(err)
            console.log(err)
        else{
            if(results.length > 0){
                res.json({msg: 'User already exists!'})
            }else{
                db.query("insert into user (username,password) VALUES(?,?)",[username,bcrypt.hashSync(password,salt)],(err1,results1)=>{
                    if(err1)
                        res.status(400).json({msg: 'Error in saving a user'});
                    else
                        res.json({
                            msg: 'Successfully created user, please login'
                        });
                })
            }
        }
    })
});

router.post("/login", (req,res)=>{
    const username = req.body.username
    const password = req.body.password

    db.query("select * from user where username = ?",[username],(err,results)=>{
        if(err)
            console.log(err)
        else{
            if(results.length > 0){
                const validPass = bcrypt.compareSync(password,results[0]['password'])
                if(validPass){
                    res.json({ 
                        token:jwt.sign({id:results[0]['iduser']}, 'SECRET')
                    })
                }
                else{
                    res.json({msg:'Invalid password'})
                }
            }
            else{
                res.json({msg: 'Invalid username'});
            }
        }
    })
});


module.exports = router;