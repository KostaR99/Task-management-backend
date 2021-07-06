var jwt = require('jsonwebtoken')
var express = require('express')
var router = express.Router()
var db = require('./db')

var checkIfLoggedIn = (req, res, next) => {
    var token = req.get('X-AUTH-HEADER');
    var user = jwt.decode(token);
    if (user && user.id) {
      return next();
    }
    return res.status(403).json({msg: 'Please login to access this information'});
}

router.get("/list",checkIfLoggedIn,(req,res)=>{
    var token = req.get('X-AUTH-HEADER');
    var user = jwt.decode(token)
    var id = user.id
    db.query("select * from task where user_iduser = ?",[id],(err,results)=>{
        if(err)
            console.log(err)
        else{
            var tasks = []
            for (let index = 0; index < results.length; index++) {
                tasks.push({idtask:results[index]['idtask'],
                            name:results[index]['name'],
                            description:results[index]['description'],
                            type:results[index]['type'],
                            finished:results[index]['finished'],
                            user_iduser:results[index]['user_iduser']
                            });
            }
            res.json({results:tasks})
        }
    })
})


router.post("/add",checkIfLoggedIn,(req,res)=>{
    var token = req.get('X-AUTH-HEADER')
    var user = jwt.decode(token)
    var id = user.id
    var name = req.body.name
    var type = req.body.type
    var description = req.body.description
    var finished = req.body.finished
    db.query("insert into task (name, type,description,finished,user_iduser) values(? ,?, ?, ?, ?)",
    [name,type,description,finished,id],(err,results)=>{
        if(err)
            console.log(err)
        else{
            res.json({msg:"Successfully saved a task"})
        }
    })
})

router.delete("/delete/:id",checkIfLoggedIn,(req,res)=>{
    let taskId = req.params.id;
    db.query("delete from task where idtask = ?",[taskId],(err,results)=>{
        if(err)
            console.log(err)
        else
            res.json({msg:"Success"})
    })
})


router.patch("/edit/:id",checkIfLoggedIn,(req,res)=>{
    let taskId = req.params.id;
    let finished = req.body.finished;
    let description = req.body.description;

    db.query("update task set finished = ?, description = ? where idtask = ?",[finished,description,taskId],(err,results)=>{
        if(err)
            console.log(err)
    })
    
})

module.exports = router;