const conn = require('../services/db'); 
 

const dataServer = async () => {
    try{
        //
            //and kdcab IN('G004','G025','G030','G034','G097','G146','G148','G149','G158','G177','G301','G305')
        const rows = await conn.query(`
            SELECT dc_induk,dc_kode,jenis_dc,nama,ip,address,username,pass,reg FROM m_server_lis
            where dc_induk='G004' limit 1
        `)
        return rows
    }catch(e){
        console.log(e)
        return "Error"
    }
} 
 
const insertPbro = async (querynya) => {
    try{
        
        const rows = await conn.execute(`
           REPLACE INTO m_pbro
           (kdcab, tanggal, kdtk, nama, total_pbro, persen_pbro, total_pbbck, persen_pbbck, total_darurat, persen_darurat, total_gagal, persen_gagal, total_req)
           values ${querynya};
        `)
        return rows
    }catch(e){
        console.log(e)
        return "Error"
    }
}

const insert_data_request = async (querynya) => {
    try{
        
        const rows = await conn.query(`replace into m_pbro_request 
        (id, toko, dc, status, keterangan, addtime, updtime,created_at) values ${querynya};
        delete from m_pbro_request where id='undefined';`)
         
        return rows
    }catch(e){ 
        console.log(e)
        return "Error"
    }
}


const insert_data_rekap = async (querynya) => {
    try{
        
        const rows = await conn.query(`replace into m_pbro 
        (kdcab, tanggal, kdtk, nama, total_pbro, persen_pbro, total_pbbck, persen_pbbck, total_darurat, persen_darurat, total_gagal, persen_gagal, total_req) 
        values ${querynya};
        delete from m_pbro where tanggal='0000-00-00';`)
        return rows
    }catch(e){ 
        console.log(e)
        return "Error"
    }
}
const insert_data_rekap_hold = async (querynya) => {
    try{
        
        const rows = await conn.query(`replace into m_pbro_hold 
        (id, tanggal, taskid, toko, gudang, nilaipb, avgsales, st, addtime,act, created_at) 
        values ${querynya};
        delete from m_pbro_hold where tanggal in('undefined');`)
        return rows
    }catch(e){ 
        console.log(e)
        return "Error"
    }
}
 
module.exports = {
    dataServer,insertPbro,insert_data_request,insert_data_rekap,insert_data_rekap_hold
  }
