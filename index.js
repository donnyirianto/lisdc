const cron = require('node-cron');
const logger = require('./utils/logger');
const { exec } = require("child_process");
const Controller = require('./controller/controller');
const dayjs = require("dayjs"); 
const puppeteer = require("puppeteer"); 
let taskRunning = true
let taskRunning2 = true
let taskRunning3 = true
let taskRunning4 = true
let taskRunning5 = true

logger.info("[SERVICE START] Service Cek LISDC : " + dayjs().format("YYYY-MM-DD HH:mm:ss") );

const myPromise = async(a,b,jenis)=>{

  const browser = await puppeteer.launch({headless : true, 
            args: [ '--no-sandbox',
            '--disable-gpu']
          })
          
  const pid = browser.process().pid;

  const server = await Controller.getServer(a,b)  
 
  const allPromises = [];

  for (let r of server) {
      const promise = new Promise(async (res, rej) => {
        Controller.doitBro(browser,r,jenis) 
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

cron.schedule('*/30 * * * *', async() => { 
//( async() => {   
  if (taskRunning) { 
      taskRunning = false    
      try {  
		      taskRunning = false                        
          logger.info("Memulai Menjalankan Pengecekan LISDC NPB:: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
          
          await myPromise(0,20,"NPB")
          await myPromise(20,20,"NPB")
          await myPromise(40,20,"NPB")
          await myPromise(60,20,"NPB")
          await myPromise(80,20,"NPB")
          await myPromise(100,20,"NPB")
          await myPromise(120,20,"NPB")
          await myPromise(140,20,"NPB")
                      
          logger.info("[END] Pengecekan LISDC NPB: " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning = true
      } catch (err) {
          taskRunning = true
          logger.emerg(err);
      }
  }

});

cron.schedule('*/40 * * * *', async() => { 
//( async() => {   
  if (taskRunning2) { 
      taskRunning2 = false    
      try {  
          taskRunning2 = false                        
          logger.info("Memulai Menjalankan Pengecekan LISDC NPR:: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
          
          await myPromise(0,20,"NPR")
          await myPromise(20,20,"NPR")
          await myPromise(40,20,"NPR")
          await myPromise(60,20,"NPR")
          await myPromise(80,20,"NPR")
          await myPromise(100,20,"NPR")
          await myPromise(120,20,"NPR")
          await myPromise(140,20,"NPR")
                      
          logger.info("[END] Pengecekan LISDC NPR: " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
          taskRunning2 = true
      } catch (err) {
          taskRunning2 = true
          logger.emerg(err);
      }
  }

});


cron.schedule('*/50 * * * *', async() => { 
    //  ( async() => {   
        if (taskRunning4) { 
            taskRunning4 = false    
            try {  
                taskRunning4 = false                        
                logger.info("Memulai Menjalankan Pengecekan LISDC NPL:: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
                
                await myPromise(0,20,"NPL")
                await myPromise(20,20,"NPL")
                await myPromise(40,20,"NPL")
                await myPromise(60,20,"NPL")
                await myPromise(80,20,"NPL")
                await myPromise(100,20,"NPL")
                await myPromise(120,20,"NPL")
                await myPromise(140,20,"NPL")
                            
                logger.info("[END] Pengecekan LISDC NPL: " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
                taskRunning4 = true
            } catch (err) {
                taskRunning4 = true
                logger.emerg(err);
            }
        }
      
      });

cron.schedule('0 45 */2 * * *', async() => { 
//  ( async() => {   
    if (taskRunning3) { 
        taskRunning3 = false    
        try {  
            taskRunning3 = false                        
            logger.info("Memulai Menjalankan Pengecekan LISDC NPX:: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
            
            await myPromise(0,20,"NPX")
            await myPromise(20,20,"NPX")
            await myPromise(40,20,"NPX")
            await myPromise(60,20,"NPX")
            await myPromise(80,20,"NPX")
            await myPromise(100,20,"NPX")
            await myPromise(120,20,"NPX")
            await myPromise(140,20,"NPX")
                        
            logger.info("[END] Pengecekan LISDC NPX: " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
            taskRunning3 = true
        } catch (err) {
            taskRunning3 = true
            logger.emerg(err);
        }
    }
  
});

  cron.schedule('0 15 */2 * * *', async() => { 
    //( async() => {   
      if (taskRunning5) { 
          taskRunning5 = false    
          try {  
              taskRunning5 = false                        
              logger.info("Memulai Menjalankan Pengecekan LISDC NPV :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
              
              await myPromise(0,20,"NPV")
              await myPromise(20,20,"NPV")
              await myPromise(40,20,"NPV")
              await myPromise(60,20,"NPV")
              await myPromise(80,20,"NPV")
              await myPromise(100,20,"NPV")
              await myPromise(120,20,"NPV")
              await myPromise(140,20,"NPV")
                          
              logger.info("[END] Pengecekan LISDC NPV: " +  dayjs().format("YYYY-MM-DD HH:mm:ss") )
              taskRunning5 = true
          } catch (err) {
              taskRunning5 = true
              logger.emerg(err);
          }
      }
    
    });
    cron.schedule('0 0 */3 * * *', async() => { 
        const x = await Controller.updateRekap()
        console.log(x)
    });
    