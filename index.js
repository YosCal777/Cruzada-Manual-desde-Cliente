import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const getVarianteManual = async (type, num1, num2) => {
    try {
        // RESULT VC
        let matriz = [];
        let contador = 1;
        for (let i = 0; i < 12; i++) {
            let fila = [];
            for (let j = 0; j < 3; j++) {
                fila.push(contador);
                contador++;
            }
            matriz.push(fila);
        }

        let colores = {};
        for (let i = 1; i <= 36; i++) {
            if ([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i)) {
                colores[i] = "rojo";
            } else {
                colores[i] = "negro";
            }
        }

        let filaNum1 = Math.floor((num1 - 1) / 3);
        let colNum1 = (num1 - 1) % 3;

        let filaNum2 = Math.floor((num2 - 1) / 3);
        let colNum2 = (num2 - 1) % 3;

        if (filaNum1 === filaNum2 || colNum1 === colNum2) {
            console.log("NO se dan las conciciones para la Variante Cruzada. Los números están en el mismo grupo o en la misma columna.");
        } else {
            let grupoNum1 = Math.floor(filaNum1 / 4);
            let grupoNum2 = Math.floor(filaNum2 / 4);

            let varianteCruzada1 = [];
            for (let i = grupoNum2 * 4; i < (grupoNum2 + 1) * 4; i++) {
                varianteCruzada1.push(matriz[i][colNum1]);
            }

            let varianteCruzada2 = [];
            for (let i = grupoNum1 * 4; i < (grupoNum1 + 1) * 4; i++) {
                varianteCruzada2.push(matriz[i][colNum2]);
            }

            //Variante Cruzada
            console.log("Variante Cruzada:", [varianteCruzada1, varianteCruzada2]);

            //Agarran fuerza
            let agarranMasFuerza = [
                varianteCruzada1.filter(num => colores[num] === colores[num1]),
                varianteCruzada2.filter(num => colores[num] === colores[num2])
            ];
            console.log("Agarran más fuerza:", agarranMasFuerza);

            //Puntos de encuentro
            let puntosDeEncuentro = [matriz[filaNum1][colNum2], matriz[filaNum2][colNum1]];
            console.log("Puntos de encuentro:", puntosDeEncuentro);
            
            return {varianteCruzada: [varianteCruzada1, varianteCruzada2], agarranMasFuerza: agarranMasFuerza, puntosDeEncuentro: puntosDeEncuentro};
        }
    } catch(error) {
        console.error(error);
    }
} 

app.get("/", cors(), async(req, res) => {
    let num1 = req.query.num1;
    let num2 = req.query.num2;
    res.json(await getVarianteManual('lottoActivo', num1, num2));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server funcionando desde:" + PORT));
