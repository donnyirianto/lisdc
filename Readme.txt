Service Scrapping Web LIS DC

 for (let x of pickJenis) {
            const promise = new Promise((res, rej) => {
                readData.read(browser,r.address, x)
                .then((val) => { res(val) })
                .catch((e) => { rej(e) })
            });
            allPromises.push(promise);
        };
        const outcomes = await Promise.allSettled(allPromises);
        const succeeded = outcomes.filter(o => o.status === "fulfilled");
        const succeededIds = succeeded.map(s => s.value);
        