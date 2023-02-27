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
          logger.info("Memulai Menjalankan Pengecekan LISDC :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
            const server = await Controller.getServer()  

            // for(const r of server){ 
            //   const browser = await puppeteer.launch({headless : false, 
            //     args: ["--no-sandbox", "--disable-setuid-sandbox"]
            //   })
              
            //   const pid = browser.process().pid;

            //   const a = await Controller.doitBro(browser,r) 
            //   console.log(a)
            //   await browser.close();
            //   exec('kill -9 ' + pid, (error, stdout, stderr) => {});    
            // } 

            const allPromises = [];

            for (let r of server) {
                const promise = new Promise(async (res, rej) => {

                  const browser = await puppeteer.launch({headless : false, 
                    args: ["--no-sandbox", "--disable-setuid-sandbox"]
                  })
                  
                  const pid = browser.process().pid;
    
                  await Controller.doitBro(browser,r) 
                  
                  await browser.close();
                  exec('kill -9 ' + pid, (error, stdout, stderr) => {});   
                });
                allPromises.push(promise);
            };
            
            const outcomes = await Promise.allSettled(allPromises);
            const succeeded = outcomes.filter(o => o.status === "fulfilled");
            
            const hasil = succeeded.map(f => f.value);
            console.log(hasil)
            
            logger.info("[END] Pengecekan LISDC : " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

})();