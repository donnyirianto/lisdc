const cron = require('node-cron');
const logger = require('./utils/logger');
const { exec } = require("child_process");
const Controller = require('./controller/controller');
const dayjs = require("dayjs"); 
const puppeteer = require("puppeteer"); 
let taskRunning = true 

logger.info("[SERVICE START] Service Cek LISDC : " + dayjs().format("YYYY-MM-DD HH:mm:ss") );

const myPromise = async(a,b)=>{
  const browser = await puppeteer.launch({headless : true, 
    args: [ '--no-sandbox',
    '--disable-gpu']
  })
  const pid = browser.process().pid;

  try { 
     
    const server = await Controller.getServer(a,b)  

    const allPromises = [];

    for (let r of server) {
      //await Controller.doitBro(browser,r);
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
  } catch (error) {
    console.log(`Error myPromise ${a} - ${b} :: ${e}`)
    await browser.close();
    exec('kill -9 ' + pid, (error, stdout, stderr) => {});   
  }
  
} 

//cron.schedule('0 */1 * * *', async() => { 
( async() => {   
  if (taskRunning) { 
      taskRunning = false    
      try {  
		      taskRunning = false                        
          logger.info("Memulai Menjalankan Pengecekan LISDC NPB:: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
          await myPromise(0,10)
          await myPromise(10,10)
          await myPromise(20,10)
          await myPromise(30,10)
          await myPromise(40,10)
          await myPromise(50,10)
          await myPromise(60,10)
          await myPromise(70,10)
          await myPromise(80,10)
          await myPromise(90,10)
          await myPromise(100,10)
          await myPromise(110,10)
          await myPromise(120,10)
          await myPromise(130,10)
          await myPromise(140,10) 
          await myPromise(150,10) 
                      
          logger.info("[END] Pengecekan LISDC NPB: " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

})();

    
