'use strict'
function badResponse(response,message){
  let mess = message || 'Errro al procesar su solicitud'
  return response.status(500).send({message:mess })
}
function makeResponse(response,state,body){
    let res_body = body || {}
    return response.status(state).send(body)
}


module.exports = {
  badResponse,
  makeResponse
}
