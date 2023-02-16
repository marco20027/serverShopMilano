const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/mysql'), {
  connectionString: 'mysql://root@localhost/shopmilano'
})


fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})

fastify.post('/login', function (req, reply) {
  try {
      const { body: { email, password } } = req;
      const sha1_password = String(CryptoJS.SHA1(password));
      console.log(sha1_password)

fastify.mysql.query(
   'SELECT * FROM user where email=? AND password=? ', [email, sha1_password],
   function onResult(err, result) {
              console.log(err)
              if (result.length > 0) {
                  const token = fastify.jwt.sign({ id: result[0].id})
                  reply.send({token})
                  console.log(token)
              } else {
               reply.code(401).send({success: false, message: "Unauthorized access"})
                  
              }
          }
      )
  } catch (err) {

  }
});


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()