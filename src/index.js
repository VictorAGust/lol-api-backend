const express = require("express")
const { json } = require("express")
require("dotenv").config()

const cors = require("cors")
const axios = require("axios")


const app = express()

app.use(json())
app.listen(3333)
app.use(cors())

app.get('/', async (req, res) => {
    res.send("hello world")
})

app.get("/summoner/:summonerName", async (req, res) => {
    const { summonerName } = req.params

    const summonerIdResponse = await axios
        .get(`${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/${summonerName}`,
            { headers: { 'X-Riot-Token': process.env.LOL_KEY } })
        .catch(e => {
            return res.status(e.response.status).json(e.response.data)
        })

    const { id, profileIconId, summonerLevel } = summonerIdResponse.data


    const responseRanked = await axios.get(`${process.env.LOL_URL}/lol/league/v4/entries/by-summoner/${id}`,
        { headers: { 'X-Riot-Token': process.env.LOL_KEY } })
        .catch(e => {
            return res.status(e.response.status).json(e.response.data)
        })

    const { tier, rank, wins, losses, queueType } = responseRanked.data[1] ? responseRanked.data[1] : responseRanked.data[0]

        return res.json({
            summonerLevel,
            tier,
            rank,
            wins,
            losses,
            queueType,
            iconUrl: `${process.env.LOL_ICONS}/${profileIconId}.png`,
            winRate: ((wins / (wins + losses)) * 100).toFixed(1)
        })
})
