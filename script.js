
const mapaDiv = document.getElementById('mapa');
const cidades = {}; 
const distancias = {}; 


    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const bloco = document.createElement('div');
            bloco.classList.add('bloco');
            bloco.dataset.coluna = i;
        
        bloco.dataset.linha = j;
            bloco.addEventListener('click', adicionarCidade);
            mapaDiv.appendChild(bloco);
        }
    }


function adicionarCidade(event) {
    if (Object.keys(cidades).length >= 5) {
        alert('Limite de 5 cidades atingido.');
        return;
    }

    // cost coluna e linha pela posição do bloco clicado!
    
    const bloco = event.target;
    const coluna = parseInt(bloco.dataset.coluna);
    const linha = parseInt(bloco.dataset.linha);
    
    console.log(coluna, linha) // tirar

    for (let posicao in cidades) {
        const pos = cidades[posicao].posicao;
        if (pos.coluna === coluna && pos.linha === linha) {
            alert('Já existe uma cidade neste campo.');
            return;
        }
    }

    // Cidade possue --> letra: "A" posicao: {coluna: 2, linha: 7}

    let letra = obterProximaLetra();
    cidades[letra] = { posicao: { coluna, linha }, letra };
    bloco.innerText = letra;
    bloco.classList.add('cidade-selecionada');

    // calcularDistanciasEntreCidades(); 
}


function obterProximaLetra() {
    let letra = 'A';
    while (cidades[letra]) {
        letra = String.fromCharCode(letra.charCodeAt(0) + 1);
    }
    return letra;
}


function calcularDistanciasEntreCidades() { //Ser chamada pelo form
    const letrasCidades = Object.keys(cidades);
    // Percorre todas as cidades returna a letra e posição
    for (let i = 0; i < letrasCidades.length; i++) {
        const cidadeA = letrasCidades[i];
        const posicaoA = cidades[cidadeA].posicao;
    
        for (let j = i + 1; j < letrasCidades.length; j++) {
            const cidadeB = letrasCidades[j];
            const posicaoB = cidades[cidadeB].posicao;
            const distancia = calcularDistanciaEntrePosicoes(posicaoA, posicaoB);
            distancias[`${cidadeA}-${cidadeB}`] = distancia;
            distancias[`${cidadeB}-${cidadeA}`] = distancia;
        }
    }
    // exibirDistancias();
}

// Função para calcular a distância entre duas posições
function calcularDistanciaEntrePosicoes(posicaoA, posicaoB) {
    const colunaA = posicaoA.coluna;
    const linhaA = posicaoA.linha;
    const colunaB = posicaoB.coluna;
    const linhaB = posicaoB.linha;

    const distancia = Math.abs(colunaB - colunaA) + Math.abs(linhaB - linhaA);
    return distancia;
}


function exibirDistancias() {
    const distanciasInfoDiv = document.getElementById('distanciasInfo');
    distanciasInfoDiv.innerHTML = '<h3>Distâncias entre as cidades:</h3>';

    for (let cidadeA in cidades) {
        for (let cidadeB in cidades) {
            if (cidadeA !== cidadeB) {
                const distancia = distancias[`${cidadeA}-${cidadeB}`];
                
                console.log(distancia) //tirar

                const posicaoA = cidades[cidadeA].posicao;
                const posicaoB = cidades[cidadeB].posicao;
                const distanciaHTML = `<p>${cidadeA} (${posicaoA.linha},${posicaoA.coluna}) - ${cidadeB} (${posicaoB.linha},${posicaoB.coluna}): ${distancia}</p>`;
                distanciasInfoDiv.innerHTML += distanciaHTML;
            }
        }
    }
}

// ------- FUNÇÃO REFATORADA DE CALCULAR ROTA MENOR --------// 

function rotaMenor (origem, destino) {

    for (let value of Object.values(cidades)) {
        if (value.letra === origem) {
            origem = [value.posicao.coluna, value.posicao.linha];
        }
        if (value.letra === destino) {
            destino = [value.posicao.coluna, value.posicao.linha];
        }

    }

    // [0,0] e [0,0] exemplo mesma lugar
    if (origem[0] === destino[0] && origem[1] === destino[1]) {
        console.log(0);
        const bloco = document.querySelector(`.bloco[data-coluna="${origem[0]}"][data-linha="${origem[1]}"]`);
        
        
    } else if(origem[0] === destino[0]) {
        // exemplo [0,0] e [0,7] mesma linha
        console.log( origem[1] - destino[1]); // distância a percorrer na mesma linha
        console.log("mesma linha") 

        if (origem[0] - destino[0] < 0) {
            console.log("direita")
        } else {
            console.log("esquerda");
        }

    } else if (origem[1] === destino[1]) {
        // exemplo [0,0] e [7,0] memsa coluna
        console.log( origem[0] - destino[0]); // distância a percorrer na mesma coluna
        console.log("mesma coluna") 

        if (origem[1] - destino[1] < 0) {
            console.log("baixo")
        } else {
            console.log("cima");
        }

    } else {
        // exemplo [0,0] e [7,7] linha e coluna diferentes
        console.log(origem[0] - destino[0]) + Math.abs(origem[1] - destino[1]);
        console.log("diferentes") 

    }
    
};


// ----------- FUNÇÃO MOSTRAR ROTA IDEAL --------------//








// Função para calcular o Rota mais próximo até a cidade destino
function calcularRotaMaisProximo(origem, destino) {
    const vertices = Object.keys(cidades);
    const Rota = [origem]; // Inicia o Rota com a cidade de origem
    let cidadeAtual = origem;

       // Adiciona a cidade de origem ao Rota e marca como percorrida
   
    const blocoOrigem = document.querySelector(`.bloco[data-coluna="${cidades[origem].posicao.coluna}"][data-linha="${cidades[origem].posicao.linha}"]`);
    blocoOrigem.classList.add('cidade-percorrida');
    while (cidadeAtual !== destino) {
        let cidadeMaisProxima = null;
        let menorDistancia = Infinity;

        for (const cidade in cidades) {
            if (!Rota.includes(cidade)) {
                const distancia = distancias[`${cidadeAtual}-${cidade}`];
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    cidadeMaisProxima = cidade;
                }
            }
        }

        Rota.push(cidadeMaisProxima);
        cidadeAtual = cidadeMaisProxima;
         // Alterar a cor do bloco no mapa
         const bloco = document.querySelector(`.bloco[data-coluna="${cidades[cidadeAtual].posicao.coluna}"][data-linha="${cidades[cidadeAtual].posicao.linha}"]`);
         bloco.classList.add('cidade-percorrida');
    }

    return Rota;
}

document.getElementById('calcularRotaBtn').addEventListener('click', function() {
    const origem = document.getElementById('cidadeOrigemInput').value.toUpperCase();
    const destino = document.getElementById('cidadeDestinoInput').value.toUpperCase(); 
    if (!cidades[destino]) {
        alert('Cidade destino inválida.');
        return;
    }
    limparCores(); 
    const RotaMaisProximo = rotaMenor(origem, destino); //calcularRotaMaisProximo removido
});


function limparCores() {
    const blocos = document.querySelectorAll('.bloco');
    blocos.forEach(bloco => {
        bloco.classList.remove('cidade-percorrida');
    });
}
