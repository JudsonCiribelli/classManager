const http = require("http");

const server = http.createServer((request, reply) => {
  reply.write("Hello, world");
  reply.end();
});

server.listen(3000).on("listening", () => {
  console.log("server is listening on port 3000");
});
