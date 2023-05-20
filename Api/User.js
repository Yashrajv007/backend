const express=require('express');
const router=express.Router();

const User=require('../Models/User');

const bcrypt=require('bcrypt');




router.post('/signup',(req,res)=>{
    let {name,email,password,dateOfBirth}=req.body;
    name=name.trim();
    email=email.trim();
    password=password.trim();
    dateOfBirth=dateOfBirth.trim();

    if(name=="" || email=="" || password=="" || dateOfBirth=="")
    {res.json({
        status:"FAILED",
        message:"Empty Input Fields"
    });
    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status:"FAILED",
            message:"Invalid Name Entered"
        });
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status:"FAILED",
            message:"Invalid Email Entered"
        });
    }else if(!new Date(dateOfBirth).getTime()){
        res.json({
            status:"FAILED",
            message:"Invalid date of birth Entered"
        });
    }else if(password.length<8){
        res.json({
            status:"FAILED",
            message:"Password is too short "
        });
    }else{
        // checking if user already exist 
        User.find({email}).then(result=>{
                if(result.length){
                    res.json({
                        status:"FAILED",
                        message:"User with that Email already exist "
                    });
                }else{
                    const SaltRounds=10;
                    bcrypt.hash(password,SaltRounds).then(hashedPassword =>{
                        const newUser=new User({
                            name,
                            email,
                            password:hashedPassword,
                            dateOfBirth
                        });

                        newUser.save().then(result =>{
                            res.json({
                                status:"SUCCESS",
                                message:"User saved successfully",
                                data:result,
                            })
                        })
                        .catch((error) =>{
                            res.json({
                                status:"FAILED",
                                message:"An error occured while saving user "
                            });
                        })

                    }).catch((error)=>{
                        res.json({
                            status:"FAILED",
                            message:"An error occured while hashing password "
                        });
                    })
                }
        }).catch((error)=>{
            console.log(error);
            res.json({
                status:"FAILED",
                message:"An error occured while checking for existing user"
            });
        })
    }

})

router.post('/signin',(req,res)=>{
    console.log(req.body);
    let {email,password}=req.body;
    email=email.trim();
    password=password.trim();


    if(email=="" || password==""){
        res.json({
            status:"FAILED",
            message:"Empty Input Fields"
        });
    }else{
        // check if user exist 
        User.find({email})
        .then(result =>{
            if(result.length){
                // user exists
                const hashedPassword=result[0].password;
                bcrypt.compare(password,hashedPassword)
                .then(data =>{
                    if(data){
                    res.json({
                        status:"SUCCESS",
                        message:"signin successfull",
                        data: result
                    })

                    }else{
                        res.json({
                            status:"FAILED",
                            message:"Invalid password entered"
                        });
                    }
                })
                .catch((error) =>{
                    res.json({
                        status:"FAILED",
                        message:"An error occured while comparing passwords"
                    });
                })
            }else{
                res.json({
                    status:"FAILED",
                    message:"Invalid credentials entered"
                });
            }
        })
        .catch((error) =>{
            res.json({
                status:"FAILED",
                message:"An error occured while checking for existing user"
            });
        })
    }
})

module.exports=router;