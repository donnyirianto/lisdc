const cron = require('node-cron');
const logger = require('./utils/logger');
const { exec } = require("child_process");
const Controller = require('./controller/controller');
const dayjs = require("dayjs"); 
const puppeteer = require("puppeteer");
let taskRunning = true 
  
logger.info("[SERVICE START] Service Cek PBRO Region 4 : " + dayjs().format("YYYY-MM-DD HH:mm:ss") );
//cron.schedule('*/1 * * * *', async() => { 
( async() => {   
  if (taskRunning) { 
      taskRunning = false    
      try {  
		  taskRunning = false      
          let today = dayjs().format("YYYY-MM-DD")               
          logger.info("Memulai Menjalankan Pengecekan LISDC :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
            const server = await Controller.getServer() 
            
            
            const browser = await puppeteer.launch({headless : false, args: ["--no-sandbox", "--disable-setuid-sandbox"] })
            const pid = browser.process().pid;

            for(const r of server){ 
              await Controller.doitBro(browser,r) 
            }

            await browser.close();
            exec('kill -9 ' + pid, (error, stdout, stderr) => {});
            
			 
            logger.info("[END] Pengecekan LISDC : " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

})();