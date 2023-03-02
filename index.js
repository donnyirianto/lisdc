const cron = require('node-cron');
const logger = require('./utils/logger');
const { exec } = require("child_process");
const Controller = require('./controller/controller');
const dayjs = require("dayjs"); 
const puppeteer = require("puppeteer");
let taskRunning = true 

logger.info("[SERVICE START] Service Cek LISDC : " + dayjs().format("YYYY-MM-DD HH:mm:ss") );

const myPromise = async(a,b)=>{

  const browser = await puppeteer.launch({headless : false, 
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
          })
          
  const pid = browser.process().pid;

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
  await browser.close();
  exec('kill -9 ' + pid, (error, stdout, stderr) => {});   
} 

cron.schedule('*/55 * * * *', async() => { 
//( async() => {   
  if (taskRunning) { 
      taskRunning = false    
      try {  
		      taskRunning = false                        
          logger.info("Memulai Menjalankan Pengecekan LISDC :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
          
          await myPromise(0,30) 
          await myPromise(30,30)
          await myPromise(60,30)
          await myPromise(90,30)
                      
          logger.info("[END] Pengecekan LISDC : " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

});
