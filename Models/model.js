const conn = require('../services/db2');  

const dataServer = async (a,b) => {
    try{
        
        const rows = await conn.query(`
        SELECT dc_induk,dc_kode,jenis_dc,nama,ip,address,username,pass,reg FROM m_server_lis
        order by dc_induk,dc_kode 
        limit ${a},${b};
        `)
        return rows
    }catch(e){
        return "Error"
    }
} 
 
const insertData = async (data,dc,jenis) => {
    try{
    	/*
        await conn.insert(`Delete from m_npdc where dc='${dc}' and 
        jenis='${jenis}' 
        and STR_TO_DATE(tanggal,'%d-%m-%Y') between '${tgl_start}' and '${tgl_end}';`)
        */
        const queryInsert = `REPLACE INTO m_npdc (tanggal,dc,jenis,toko,namaToko,namafile,jamWeb,jamCsv,jamKirim,jamKonfirm,jamToko,docno,jmlItem,jamBpb,bukti_no,jmlBpb,retry,lastupd) values ?`
        
        await conn.insert({sql: queryInsert, values: [data]})
        
        console.log(`Sukses Insert ${dc}-${jenis} : ${data.length} Rows`)
        return "Sukses"
    }catch(e){
        console.log(`"Gagal Insert ${dc}-${jenis} : ${e}`)
        return "Error"
    }
}
  
const updateRekap = async (data,jenis,tgl_start,tgl_end) => {
    try{
        await conn.insert(`update m_npdc_rekap set cek_npb_d = 0 where namafile not in(select namafile from m_npdc);`)        

        console.log("Sukses Insert")
        return "Sukses"
    }catch(e){
        
        return "Error"
    }
}
module.exports = {
    dataServer,insertData,updateRekap
  }
