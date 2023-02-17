//const CryptoJS = require("crypto-js");
const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/mysql'), {
  connectionString: 'mysql://root@localhost/shopmilano'
})

const setup = async () => {
  await fastify.register(require("@fastify/cors"), {
      origin: "*"
  })
}
setup();


fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/login', function (req, reply) {
  try {
      const { body: { email, password } } = req;
        fastify.mysql.query(
          'SELECT * FROM login where email=? AND password=? ', [email, password],
          function onResult(err, result) {
                 reply.send(err || result)
                   reply.code(401).send({success: false, message: "Unauthorized access"})
                 }
             )
      }catch (err){
        reply.code(400).send({success: false, message: "Unauthorized access"})
      } 
});


fastify.route({
  method: 'POST',
  url: '/registrazione',

  handler: function (req, reply) {
      const registrazione = {
          nome : req.body.nome,
          cognome: req.body.cognome,
          email: req.body.email,
          password : req.body.password,
      }
      console.log(req.user)
      fastify.mysql.query(
          'INSERT INTO registrazione SET ? ', [registrazione],
          function onResult(err, result) {
              reply.send(err || result)
          }
      )
  }
})


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()