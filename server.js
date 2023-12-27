const app = require("./src/app");
const NAME_SERVER = "Server WSV eCommerce Express";

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`${NAME_SERVER} start with port ${PORT}`);
});

// process.on('SIGINT', () => {
//     server.close(() => console.log(`Exit ${NAME_SERVER}`))
//     // notify.send( ping...)
// });
