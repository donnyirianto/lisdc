module.exports = {
  apps : [{
      name: "lisdc",
      script: "index.js", 
      autorestart: true,
      max_memory_restart: "1000M", 
      cron_restart: '0 */2 * * *',
      exec_mode  : "fork"
    },
  ], 
};
