const path = require('path');
const express = require('express');
const fetch = require('cross-fetch');
const {SocksProxyAgent} = require('socks-proxy-agent');

const app = express();

app.use(express.static(path.join(__dirname, './dist')));

const fetchTor = async (url) => {
    try {
        return await (await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            agent: new SocksProxyAgent('socks5h://127.0.0.1:9050'),
        })).json()
    } catch (e) {
        return {error: e}
    }
}

app.get("/api/fees", async (req, res) => {
    res.json({
        fees: await fetchTor("http://kx72vljgxk2ao7wqlrjghix6jecbhhb6rsvbscvbqilxekyjmmham2ad.onion/api/mempool/fees"),
        rewards: await fetchTor("http://nqieh33bhvzhm35l4qe4ifzbrbpxk4szwlu42wonqycvmqurlzptigyd.onion/api/v1/mining/reward-stats/144"),
    });
});

app.get("/api/hashrate", async (req, res) => {
    res.json({
        hashrate: await fetchTor("http://kx72vljgxk2ao7wqlrjghix6jecbhhb6rsvbscvbqilxekyjmmham2ad.onion/api/mining/hashrate"),
    });
});

app.get("/api/miners", async (req, res) => {
    res.json({
        miners: await fetchTor("http://kx72vljgxk2ao7wqlrjghix6jecbhhb6rsvbscvbqilxekyjmmham2ad.onion/api/mining/miner-summary?since=1d"),
    });
});

app.get("/api/miningInfo", async (req, res) => {
    res.json({
        coins: await fetchTor("http://kx72vljgxk2ao7wqlrjghix6jecbhhb6rsvbscvbqilxekyjmmham2ad.onion/api/blockchain/coins"),
        difficulty: await fetchTor("http://nqieh33bhvzhm35l4qe4ifzbrbpxk4szwlu42wonqycvmqurlzptigyd.onion/api/v1/difficulty-adjustment"),
    });
});

app.get("/api/poolShare", async (req, res) => {
    res.json({
        pools: await fetchTor("http://nqieh33bhvzhm35l4qe4ifzbrbpxk4szwlu42wonqycvmqurlzptigyd.onion/api/v1/mining/hashrate/pools/1d"),
    });
});


app.listen(3005, function () {
    console.log('listening on port 3005');
});
