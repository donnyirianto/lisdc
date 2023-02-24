module.exports = {
  apps : [{
      name: "pbro_reg1",
      script: "index.js", 
      autorestart: true,
      max_memory_restart: "500M", 
      exec_mode  : "fork"
    },
  ], 
};
