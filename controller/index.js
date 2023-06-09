const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv').config({ path: "././.env" });
const path = require('path');

const thedb = require('../config/dbconfig.js');
let cookieparser = require('cookie-parser');
const { error } = require('console');

const RegexSecureFLN = /^([A-Za-z\d]){3,50}([._-]){0,2}$/;
const RegexSecurePW = /^([A-Za-z\d]){3,255}|([._-]){3,255}$/;
const RegexSecureEmail = /^([-._A-Za-z\d]){3,100}@([a-zA-Z]){3,15}\.([a-zA-Z]){3}$/

const RegexSecureText = /^([A-Za-z\d\s\']){3,100}([!?,:._-]){0,100}$/;

exports.Index = (req, res) => {
    console.log(req.body)
    const reqTextArea = req.body.textpost
    console.log(reqTextArea)
    const IdUser = jwt.decode(req.cookies.tokenUser)
    console.log(req.cookies.tokenUser)
    const textpost = { text: reqTextArea, Iduser: IdUser.Id }

    if (!RegexSecureText.test(reqTextArea)) {
        return res.redirect('/')
    }
    else if (RegexSecureText.test(reqTextArea)) {
        thedb.query('INSERT INTO post SET ?', textpost, (error, result) => {
            if (error) {
                return console.log("error", error)
            } else {
                thedb.query('SELECT * FROM post inner join user using(Iduser)', (error, result) => {
                    if (error) {
                        return console.log("erreurrr", error)
                    } else {
                        return res.redirect('/')
                    }
                })
            }
        })
    }
}

exports.IndexCom = (req, res) => {
    console.log("commmeeee", req.params.params)
    const reqInputCom = req.body.inputcomments
    const IdUser = jwt.decode(req.cookies.tokenUser)
    const textComments = { textCom: reqInputCom, Iduser: IdUser.Id, idPost: req.params.params }
    if (!RegexSecureText.test(reqInputCom)) {
        return res.redirect('/')
    }
    else if (RegexSecureText.test(reqInputCom)) {
        thedb.query('INSERT INTO com SET ?', textComments, (error, result) => {
            if (error) {
                return console.log("error", error)
            } else {
                thedb.query('Select * FROM com', (error, result) => {
                    if (error) {
                        console.log("erreur", error)
                    } else {
                        res.redirect('/')
                        return console.log('resumt', result)
                    }
                })
            }
        })
    }
}

exports.LikePost = (req, res) => {
    const IdUser = jwt.decode(req.cookies.tokenUser)
    const LikePostInfo = { Iduser: IdUser.Id, idPost: parseInt(req.params.paramsPost) }
    thedb.query('SELECT * FROM likepost WHERE Iduser = ? AND idPost = ?', [IdUser.Id, parseInt(req.params.paramsPost)], (error, result) => {
        if (result.length > 0) {
            thedb.query('DELETE FROM likePost WHERE Iduser = ? AND idPost = ?', [IdUser.Id, req.params.paramsPost], (errordel, resultdel) => {
                if (errordel) {
                    console.log(error)
                    return res.redirect('/')
                }
                else if (!errordel) {
                    console.log(resultdel)
                    return res.redirect('/')
                }
            })
        }
        else if (result.length == 0) {
            thedb.query('INSERT INTO likepost SET ?', LikePostInfo, (errorinsert, resultinsert) => {
                if (errorinsert) {
                    console.log(errorinsert)
                    return res.redirect('/')
                }
                else if (!errorinsert) {
                    console.log(resultinsert)
                    return res.redirect('/')
                }
            })
        }
    })
}

exports.LikeCom = (req, res) => {

    const IdUser = jwt.decode(req.cookies.tokenUser)
    const LikeInfo = { idCom: parseInt(req.params.params1), Iduser: IdUser.Id, idPost: parseInt(req.params.params2) }

    thedb.query('SELECT idLikeCom FROM likecom WHERE idCom = ? AND Iduser = ? AND idPost = ?', [parseInt(req.params.params1), parseInt(IdUser.Id), parseInt(req.params.params2)], (error, resultverif) => {
        console.log("resultverif", resultverif)
        console.log("resultverif", error)
        if (resultverif.length < 1) {
            thedb.query('INSERT INTO likecom SET ?', LikeInfo, (errorliked, resultliked) => {
                if (errorliked) {
                    console.log("erreur avec like", errorliked)
                    console.log('rrrrrrrrrrrrrrrrrrrr', resultliked)
                    console.log('reeeeeeeeeeeeeeerrefedfdfdf', resultverif)
                    return res.redirect('/')
                } else {
                    console.log(error)
                    console.log("tu like", resultliked)
                    return res.redirect('/')
                }
            })
        } else {
            thedb.query('DELETE FROM likecom Where idLikeCom = ?', resultverif[0].idLikeCom, (errordellike, resultdellike) => {
                console.log(resultverif)
                console.log(resultverif[0].idLikeCom)
                if (errordellike) {
                    console.log('loooooooooooook', errordellike)
                    return res.redirect('/')
                } else {
                    console.log("retirer like", resultdellike)
                    return res.redirect('/')
                }
            })
        }

    })


}

exports.RegUser = (req, res) => {

    const { firstname, lastname, email, password, passwordconfirm } = req.body

    if (!RegexSecureFLN.test(req.body.firstname && req.body.lastname) || !RegexSecurePW.test(req.body.password && req.body.passwordconfirm) || !RegexSecureEmail.test(req.body.email)) {
        return res.redirect('/register')
    }
    else if (RegexSecureFLN.test(req.body.firstname && req.body.lastname) || RegexSecurePW.test(req.body.password && req.body.passwordconfirm) || RegexSecureEmail.test(req.body.email)) {
        thedb.query('SELECT Email From user WHERE Email = ?', [email], (error, results) => {
            if (error) {
                console.log('Error ' + error)
                return res.redirect('/register')
            }
            else if (results.length > 0) {
                console.log("email déjà utilisé")
                return res.redirect('/register')
            }
            else if (password !== passwordconfirm) {
                console.log('pas le même password')
                return res.redirect('/register')
            }
            else if (password === passwordconfirm && results.length == 0) {
                const salt = bcryptjs.genSaltSync(8)
                const hashedpassword = bcryptjs.hashSync(password, salt)
                console.log('Voici le mdp hasher ' + hashedpassword)

                const newUser = { Firstname: firstname, Lastname: lastname, Email: email, Password: hashedpassword }
                thedb.query('INSERT INTO user SET ?', newUser, (error, results) => {
                    if (error) {
                        console.log("Une erreur s'est produite " + error)
                        return res.redirect('/register')
                    } else {
                        console.log("Enregistrement réussi ", results)
                        return res.redirect('/login')
                    }
                })
            }
        })
    } else {
        res.send('erreur général')
    }
}

exports.LogUser = (req, res) => {
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password


    thedb.query('Select * From User Where Email = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'failed to login' })
        }
        else if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email' })
        }
        else {
            const bcryptjsverify = bcryptjs.compareSync(password, results[0].Password)
            if (bcryptjsverify == true) {
                console.log("result login", results)

                const token = jwt.sign({ Id: results[0].Iduser }, process.env.J_SECRET)

                console.log('you loged', token)
                res.cookie("tokenUser", token)

                return res.redirect('/')
            }
            else if (bcryptjsverify == false) {
                res.status(400).json({ Message: "Wrong password" })
            }
        }
    })
}

exports.Admin = (req, res) => {
    console.log(req.originalUrl);
    const urlAdminMembers = req.originalUrl;
    thedb.query('SELECT * FROM user ORDER BY Iduser', (errorMember, results) => {
        if (errorMember) {
            console.log('Error admin member', error);
        } else if (!errorMember) {
            const urlAdminPost = req.originalUrl;
            thedb.query('SELECT * FROM post INNER JOIN user USING (Iduser) ORDER BY idPost DESC', (errorPost, resultsPost) => {
                if (errorPost) {
                    console.log('Error admin post', errorPost);
                } else if (!errorPost) {
                    const urlAdminCom = req.originalUrl;
                    thedb.query('SELECT * FROM com INNER JOIN user USING (Iduser) ORDER BY idCom DESC', (errorCom, resultsCom) => {
                        if (errorCom) {
                            console.log('Error admin com', errorCom);
                        } else if (!errorCom) {
                            res.render('panel', { results, urlAdminMembers, resultsPost, urlAdminPost, resultsCom, urlAdminCom })
                        }
                    })
                }
            })
        } else {
            const urlAdminPost = req.originalUrl;
            thedb.query('SELECT * FROM post ORDER BY idPost DESC', (errorPost, resultsPost) => {
                if (errorPost) {
                    console.log('Error admin post', errorPost);
                } else if (!errorPost) {
                    res.render('panel', { resultsPost, urlAdminPost })
                }
            })
        }
    })
}

exports.AdminDeleteConfirm = (req, res) => {
    const idPostDelete = req.params.idPost;
    const idComDelete = req.params.idCom;
    if (req.originalUrl == "/admin/panel/post/delete/" + req.params.idPost + "/confirm") {
        thedb.query('DELETE FROM post WHERE idPost =?', idPostDelete, (errorDeletePost, resultsDeletePostConfim) => {
            if (errorDeletePost) {
                console.log('Error admin delete post', errorDeletePost);
            } else if (!errorDeletePost) {
                res.redirect('/admin/panel/posts')
            }
        })
    } else if (req.originalUrl == "/admin/panel/com/delete/" + req.params.idCom + "/confirm") {
        thedb.query('DELETE FROM com WHERE idCom =?', idComDelete, (errorDeleteCom, resultsDeleteComConfim) => {
            if (errorDeleteCom) {
                console.log('Error admin delete com', errorDeleteCom);
            } else if (!errorDeleteCom) {
                res.redirect('/admin/panel/commentaires')
            }
        })
    }
}

exports.AdminDelete = (req, res) => {
    const idPostDelete = req.params.idPost;
    let urlAdminDeletePost = "";
    let urlAdminDeleteCom = "";
    if (req.originalUrl == "/admin/panel/post/delete/" + req.params.idPost) {
        thedb.query('SELECT idPost FROM post WHERE idPost =?', idPostDelete, (errorDeletePost, resultsDeletePost) => {
            if (errorDeletePost) {
                console.log('Error admin delete post', errorDeletePost);
            } else if (!errorDeletePost) {
                urlAdminDeletePost = req.originalUrl;
                res.render('delete', { resultsDeletePost, urlAdminDeletePost, urlAdminDeleteCom })
            }
        })
    } else if (req.originalUrl == "/admin/panel/com/delete/" + req.params.idCom) {
        console.log(req.params.idCom);
        const idComDelete = req.params.idCom;
        thedb.query('SELECT idCom FROM com WHERE idCom =?', idComDelete, (errorDeleteCom, resultsDeleteCom) => {
            if (errorDeleteCom) {
                console.log('Error admin delete Com', errorDeleteCom);
            } else if (!errorDeleteCom) {
                urlAdminDeleteCom = req.originalUrl;
                res.render('delete', { resultsDeleteCom, urlAdminDeleteCom, urlAdminDeletePost })
            }
        })
    }
}

exports.AdminEdit = (req, res) => {
    const idPostEdit = req.params.idPost;
    const idComEdit = req.params.idCom;
    let urlAdminEditPost = "";
    let urlAdminEditCom = "";
    if (req.originalUrl == "/admin/panel/post/edit/" + req.params.idPost) {
        thedb.query('SELECT * FROM post WHERE idPost =?', idPostEdit, (errorEditPost, resultsEditPost) => {
            if (errorEditPost) {
                console.log('Error admin edit post', errorEditPost);
            } else if (!errorEditPost) {
                urlAdminEditPost = req.originalUrl;
                res.render('edit', { resultsEditPost, urlAdminEditPost, urlAdminEditCom })
            }
        })
    } else if (req.originalUrl == "/admin/panel/com/edit/" + req.params.idCom) {
        console.log(req.params.idCom);
        thedb.query('SELECT * FROM com WHERE idCom =?', idComEdit, (errorEditCom, resultsEditCom) => {
            if (errorEditCom) {
                console.log('Error admin edit Com', errorEditCom);
            } else if (!errorEditCom) {
                urlAdminEditCom = req.originalUrl;
                res.render('edit', { resultsEditCom, urlAdminEditCom, urlAdminEditPost })
            }
        })
    }
}

exports.AdminEditConfirm = (req, res) => {
    const idPostEdit = req.params.idPost;
    const idComEdit = req.params.idCom;
    const textPost = req.body.textPost;
    const textCom = req.body.textCom;
    if (req.originalUrl == "/admin/panel/post/edit/" + req.params.idPost + "/confirm") {
        thedb.query('UPDATE post SET ? WHERE idPost =?', [{text:textPost}, idPostEdit], (errorEditPost, resultsEditPostConfim) => {
            if (errorEditPost) {
                console.log('Error admin edit post', errorEditPost);
            } else if (!errorEditPost) {
                res.redirect('/admin/panel/posts')
            }
        })
    } else if (req.originalUrl == "/admin/panel/com/edit/" + req.params.idCom + "/confirm") {
        thedb.query('UPDATE com SET ? WHERE idCom =?', [{textCom:textCom}, idComEdit], (errorEditCom, resultsEditComConfim) => {
            if (errorEditCom) {
                console.log('Error admin edit com', errorEditCom);
            } else if (!errorEditCom) {
                res.redirect('/admin/panel/commentaires')
            }
        })
    }
}
