// Variáveis principais do jogo
let palavra = "";             // Palavra secreta a ser adivinhada
let palavraOculta = "";       // Palavra oculta com "_"
let letrasErradas = [];       // Letras que o jogador errou
let tentativasRestantes = 6;  // Tentativas antes de perder (limite: 6)


// Inicia o jogo quando o usuário digita a palavra secreta
function iniciarJogo() {
  const input = document.getElementById("palavra");
  palavra = input.value.toUpperCase().trim(); // Captura e formata a palavra

  // Verifica se a palavra é válida
  if (palavra.length === 0) {
    alert("Digite uma palavra válida.");
    return;
  }

  // Inicializa as variáveis do jogo
  palavraOculta = "_".repeat(palavra.length); // Cria os "_" da palavra oculta
  letrasErradas = [];
  tentativasRestantes = 6;

  // Exibe a interface do jogo e esconde o input da palavra
  document.getElementById("setup").style.display = "none";
  document.getElementById("jogo").style.display = "block";

  // Ativa input de letra e reseta mensagens e efeitos
  document.getElementById("letra").disabled = false;
  document.getElementById("mensagem").textContent = "";
  document.getElementById("sangue").style.display = "none";

  // Atualiza a interface e reseta o boneco
  atualizarTela();
  desenharBoneco(0);
}


// Função chamada quando o usuário tenta uma letra
function tentarLetra() {
  const inputLetra = document.getElementById("letra");
  const letra = inputLetra.value.toUpperCase(); // Letra em maiúsculo

  inputLetra.value = "";
  inputLetra.focus(); // Mantém o foco no input

  // Validação: só aceitar letras A-Z
  if (letra.length === 0 || !/^[A-Z]$/.test(letra)) return;

  // Se a letra estiver na palavra...
  if (palavra.includes(letra)) {
    let novaOculta = "";

    // Substitui os "_" pelas letras corretas
    for (let i = 0; i < palavra.length; i++) {
      novaOculta += palavra[i] === letra ? letra : palavraOculta[i];
    }

    palavraOculta = novaOculta;

  } else {
    // Se errou e ainda não tinha errado essa letra
    if (!letrasErradas.includes(letra)) {
      letrasErradas.push(letra);
      tentativasRestantes--; // Perde uma tentativa
    }
  }

  atualizarTela(); // Atualiza a interface
  desenharBoneco(letrasErradas.length); // Mostra partes do boneco
  checarFim(); // Verifica se o jogo acabou
}


// Atualiza a exibição da tela
function atualizarTela() {
  // Mostra a palavra oculta com espaços
  document.getElementById("palavraOculta").textContent = palavraOculta.split("").join(" ");

  // Mostra letras erradas
  document.getElementById("erradas").textContent = letrasErradas.join(", ");

  // Mostra tentativas restantes
  document.getElementById("tentativas").textContent = tentativasRestantes;
}


// Verifica se o jogo foi vencido ou perdido
function checarFim() {
  const mensagem = document.getElementById("mensagem");

  // Vitória: todas as letras foram adivinhadas
  if (palavraOculta === palavra) {
    mensagem.textContent = "🎉 Parabéns! Você acertou!";
    dispararConfetes(); // Mostra confetes
    fimDoJogo();
  }

  // Derrota: acabaram as tentativas
  else if (tentativasRestantes <= 0) {
    mensagem.textContent = `💀 Fim de jogo! A palavra era: ${palavra}`;
    document.getElementById("sangue").style.display = "block"; // Mostra sangue
    fimDoJogo();
  }
}


// Desativa o campo de letra após fim de jogo
function fimDoJogo() {
  document.getElementById("letra").disabled = true;
}


// Desenha o boneco da forca conforme a quantidade de erros
function desenharBoneco(erros) {
  const partes = [
    "cabeca",
    "tronco",
    "bracoE",
    "bracoD",
    "pernaE",
    "pernaD"
  ];

  // Exibe as partes do boneco de acordo com o número de erros
  for (let i = 0; i < partes.length; i++) {
    const parte = document.getElementById(partes[i]);
    parte.style.display = i < erros ? "block" : "none";
  }
}


// 🎊 Dispara confetes na tela quando vence
function dispararConfetes() {
  const canvas = document.getElementById('confetes');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const confetes = [];
  const cores = ['#f94144', '#f3722c', '#f9c74f', '#43aa8b', '#577590'];

  // Gera 300 confetes aleatórios
  for (let i = 0; i < 300; i++) {
    confetes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * 10 + 2,
      color: cores[Math.floor(Math.random() * cores.length)],
      tilt: Math.floor(Math.random() * 10) - 5,
      tiltAngle: 0,
    });
  }

  // Função que desenha os confetes
  function desenharConfetes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetes.forEach(c => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.ellipse(c.x, c.y, c.r, c.r / 2, c.tilt, 0, 2 * Math.PI);
      ctx.fill();
    });

    atualizar();
  }

  // Atualiza a posição dos confetes para cair animado
  function atualizar() {
    confetes.forEach(c => {
      c.tiltAngle += 0.1;
      c.y += c.d;
      c.x += Math.sin(c.tiltAngle);
      c.tilt = Math.sin(c.tiltAngle) * 15;

      // Se saiu da tela, reinicia no topo
      if (c.y > canvas.height) {
        c.y = -20;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  // Loop de animação a cada 20ms
  const intervalo = setInterval(desenharConfetes, 20);

  // Para a animação após 5 segundos
  setTimeout(() => {
    clearInterval(intervalo);
    canvas.style.display = 'none';
  }, 5000);
}