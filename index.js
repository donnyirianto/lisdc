const cron = require('node-cron');
const logger = require('./utils/logger');
const { exec } = require("child_process");
const Controller = require('./controller/controller');
const dayjs = require("dayjs"); 
const puppeteer = require("puppeteer");
let taskRunning = true 

logger.info("[SERVICE START] Service Cek LISDC : " + dayjs().format("YYYY-MM-DD HH:mm:ss") );

const myPromise = async(browser,a,b)=>{
  const server = await Controller.getServer(a,b)  
 
  const allPromises = [];

  for (let r of server) {
      const promise = new Promise(async (res, rej) => {
        Controller.doitBro(browser,r) 
          .then((val) => { res(val)})
          .catch((e) => { rej(e) })
      });
      allPromises.push(promise);
  }; 
  
  await Promise.allSettled(allPromises);
  
  logger.info(`Job ${a}-${a+b} Done :: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`)
} 

cron.schedule('*/55 * * * *', async() => { 
//( async() => {   
  if (taskRunning) { 
      taskRunning = false    
      try {  
		      taskRunning = false                        
          logger.info("Memulai Menjalankan Pengecekan LISDC :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
          
          const browser = await puppeteer.launch({headless : true, 
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
          })
          
          const pid = browser.process().pid;

          await myPromise(browser,0,20)
          await myPromise(browser,20,20)
          await myPromise(browser,40,20)
          await myPromise(browser,60,20)
          await myPromise(browser,80,20)
          await myPromise(browser,100,20) 

          await browser.close();
          exec('kill -9 ' + pid, (error, stdout, stderr) => {});   
            
          logger.info("[END] Pengecekan LISDC : " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

});
