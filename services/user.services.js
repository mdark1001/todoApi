'user strict'
var jwt = require('jwt-simple');
var moment = require('moment');
const secret = '4a63f76ca6f6'
const delimiter = '/';
createToken = function(user) {
  var payload = {
    sub: user._id,
    name: user.name,
    surmane: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };

  return jwt.encode(payload, secret)
}

function getValidImageExtend(file_name) {
  var file_ext = 'png|jpeg|jpg';
  var regExp = /\.(jpg|jpeg|png)$/g;
  regExp = new RegExp(regExp);
  if (!regExp.test(file_name.toLowerCase())) {
    return false;
  }
  return true;

}

function getDataFileByPath(file_path) {

  let array_file_data = file_path.split(delimiter);
  let file_name = array_file_data[array_file_data.length - 1];
  let extenson = array_file_data[array_file_data.length - 1].split('.');

  let data_file = {
    name: file_name,
    extension: extenson[1],
    full_path: file_path,
    valid_extend: getValidImageExtend(file_path),
  };
  return data_file;
}

function getHashPassword(password) {
    let hashed_pass = '';
    return new Promise(function (resolve, resject) {
        if (password == '' || password == undefined) {
            resolve(hashed_pass);
        }
        bcrypt.hash(password, null, null, (err, hash) => {
            if (err) {
                reject("Error al encryptar el password");
            } else {
                resolve(hash);
            }
        });
    });

}
function getUserJson(user){
  return {
    name: user.name,
    alias: user.alias,
    image: user.image,
    email: user.email,
    user_id: user._id
  }

}

module.exports = {
  createToken,
  getDataFileByPath,
  getHashPassword,
  getUserJson
}
