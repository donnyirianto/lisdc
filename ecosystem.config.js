module.exports = {
  apps : [{
      name: "lisdc",
      script: "index.js", 
      autorestart: true,
      max_memory_restart: "1000M", 
      exec_mode  : "fork"
    },
  ], 
};
