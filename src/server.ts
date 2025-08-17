import { server } from "./app.ts";

server.listen({ port: 3000 }).then(() => {
  console.log("Server listening on http://localhost:3000");
});
