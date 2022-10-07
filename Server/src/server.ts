import  express  from "express";  // isso serve para a importação do express
import { convertHoursToMinutes } from "./utils/convert-hour-string-to-minutes";
import cors from "cors";
// para que ele seja importado desata forma precisa ir no json,  "type": "module",
// e salvar o arquivo vomo server.mjs
const { PrismaClient } = require('@prisma/client')

const app = express();

app.use(express.json())

app.use(cors()) // para proteger o seu back-end

const prisma = new PrismaClient()

// HTTP METHODS / API RESTful / HTTP CODES (200 sucesso) (300 redirecionamento ) (400 erro que foi gerado pela aplicação) (500) erros inesperados tipo de resposta   

/** 
 * query params servem para que o estado da pagina fique no mesmo momento
 * Route: não são nomeados irão identificar onde você esta na aplicação pela url, para identificar um recurso 
 * Body: Para enviar informações em uma unica requisição, recomendado para requisições senciveis, como senha 
*/


app.get('/games', async (request, response) => {

    const games = await prisma.game.findMany({
        include:{
            _count:{
                select:{
                    ads: true,
                }
            }
        } // para incluir os anuncios no game
    }) // o await faz o programa esperar ate que a linha seja carregada completamente

    return response.json(games)
});

app.post('/games/:id/ads', async (request, response) => {    // post serve para criação
    const gameId = request.params.id
    const body : any = request.body


    const ad = await prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yearsPlaying:body.yearsPlaying,
            discord: body.discord,
            weekDays: body.weekDays.join(','),
            hourStart: convertHoursToMinutes( body.hourStart),
            hourEnd: convertHoursToMinutes (body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,

        }
    })

    return response.status(201).json(ad)
});

// '/games/id/ads' listar do game o id e os anuncios que ele possui nesse caso foi usado o metodo Route 

app.get('/games/:id/ads', async (request, response) => {
     const gameId = request.params.id

     const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart:  true,
            hourEnd: true,
        },

        where: { gameId: gameId},

       
     })

    return response.json(ads)
})

app.get('/ads/:id/discord', async (request, response) => {
     const adId = request.params.id

    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord: true,
        },
        where:{
            id: adId,
        }

    })

    return response.json({
        discord: ad.discord,
    })
})

// o get o primeiro parametro é o enderoço que o usuario estara acessando
// (/users) o segundo é qual a função que o users vai acessar quando entrar 
// nessa pagina 
// response.send('acessou ads') da uma resposta para o usuario 

app.listen(3333)
// serve para que a aplicação fique ouvindo ate que o usuario pessa para parar 


// com npm run build o type faz um arquivo igual ao arquivo ts so que em js