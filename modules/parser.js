"use strict"

const $ = require('cheerio');
const axios = require('axios');

module.exports = async function parser(url,num) {
        const danamat = url.split('/wiki/')[0];

        const first =await axios({url:encodeURI(url)}).then(function (res){
        const links = $('a',res.data); 
        
        const arr = [];
       
        
        $(links).map(function(a,links){
            
            if($(links).attr('href') && $(links).attr('href').indexOf('wiki/')>0  ) arr.push({name:$(links).text() ,url: ($(links).attr('href').indexOf('/wiki/',1) == -1 ? danamat+$(links).attr('href'):$(links).attr('href'))});
                
        });
        return arr.filter(a=>a.name);
        
    }).catch(err=>console.log(err,url));

    console.log(first.length,100);

    const next = await new Promise((resolve,reject) =>{
        // const arr = [
        //         {
        //         name: 'Cookie statement',
        //         url: 'https://foundation.wikimedia.org/wiki/Cookie_statement',
        //         count: 2
        //       },
        //       {
        //         name: 'შემქმნელები',
        //         url: 'https://www.mediawiki.org/wiki/Special:MyLanguage/How_to_contribute',
        //         count: 1
        //       }
        // ];
        const arr = [];
                
        (async function foo(i = first.length-1) {
            try {
                
                await axios({url:first[i].url}).then(a=>{
                    let links = $('a',a.data);
                    let count = 0;
                    console.log(links.length);
                    links.map((a,b)=>{
                       if( $(b).attr('href') && $(b).attr('href').indexOf(encodeURI(url))>-1){
                            count++;
                            console.log($(b).attr('href'));
                       };
                    }); 
                    count > 0 && count <= num ? arr.push({name:encodeURI(first[i].name),url:first[i].url,count}):null;


                }).catch(err=>err);

                if(i == 0) return resolve(arr);
                console.log(i,first.length);
                if(i >0 ) return foo(i - 1);
            } catch (err) {
                //return reject(err)
                console.log(err);
                
            }
        })()
        
 
    });

 return next;
}