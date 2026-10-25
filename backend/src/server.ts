import app from "./app.ts";
import { config } from "./config/environment.ts";

const server = app.listen(config.port, () => {
  console.log(`PharmaSense API server running on port ${config.port} [${config.nodeEnv}]`);
});

export default server;
