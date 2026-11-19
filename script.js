const cursorPonto = document.querySelector('.cursor-ponto');
const gifCursor = document.getElementById('gif-cursor');

let mouseX = 0;
let mouseY = 0;
let tanqueX = 0;
let tanqueY = 0;

// Distância do tanque em relação ao ícone BTS
const offsetX = 60;
const offsetY = 15;

// Brilhos temáticos (roxo BTS, dourado e branco)
const simbolosBrilho = ['✦', '✨', '★', '✧', '💜'];
const coresBrilho = ['#c77dff', '#e0aaff', '#ffd166', '#ffffff', '#9d4edd'];

function criarBrilho(x, y) {
    const brilho = document.createElement('span');
    brilho.classList.add('brilho');

    brilho.textContent = simbolosBrilho[Math.floor(Math.random() * simbolosBrilho.length)];
    brilho.style.color = coresBrilho[Math.floor(Math.random() * coresBrilho.length)];
    brilho.style.fontSize = `${Math.random() * 14 + 10}px`;
    brilho.style.textShadow = `0 0 8px ${brilho.style.color}`;

    brilho.style.left = `${x}px`;
    brilho.style.top = `${y}px`;

    const dx = (Math.random() - 0.5) * 90;
    const dy = (Math.random() - 0.5) * 90 - 20;
    brilho.style.setProperty('--dx', `${dx}px`);
    brilho.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(brilho);

    setTimeout(() => {
        brilho.remove();
    }, 900);
}

// Movimento do mouse: atualiza ícone e solta brilhos
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorPonto) {
        cursorPonto.style.left = `${mouseX}px`;
        cursorPonto.style.top = `${mouseY}px`;
    }

    if (Math.random() < 0.35) {
        criarBrilho(mouseX, mouseY);
    }
});

// Explosão de brilhos ao clicar em qualquer lugar
window.addEventListener('click', (e) => {
    for (let i = 0; i < 12; i++) {
        criarBrilho(e.clientX, e.clientY);
    }
});

// Movimento suave com atraso para o tanque
function animarCursor() {
    if (gifCursor) {
        const alvoX = mouseX + offsetX;
        const alvoY = mouseY + offsetY;

        tanqueX += (alvoX - tanqueX) * 0.12;
        tanqueY += (alvoY - tanqueY) * 0.12;

        gifCursor.style.left = `${tanqueX}px`;
        gifCursor.style.top = `${tanqueY}px`;
    }

    requestAnimationFrame(animarCursor);
}

animarCursor();

// ==========================================
// 1. SLIDESHOW AUTOMÁTICO DO BANNER PRINCIPAL (6.5s)
// ==========================================
const slides = document.querySelectorAll('#banner-card .slide');
const indicadoresContainer = document.getElementById('slide-indicadores');

let slideAtual = 0;

if (slides.length > 0 && indicadoresContainer) {
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('ativo');
        indicadoresContainer.appendChild(dot);
    });

    const dots = indicadoresContainer.querySelectorAll('.dot');

    function proximoSlide() {
        slides[slideAtual].classList.remove('ativo');
        dots[slideAtual].classList.remove('ativo');

        slideAtual = (slideAtual + 1) % slides.length;

        slides[slideAtual].classList.add('ativo');
        dots[slideAtual].classList.add('ativo');
    }

    setInterval(proximoSlide, 6500);
}

// ==========================================
// 2. SOMBRA NA NAVBAR E ROLAGEM PARA O TÍTULO
// ==========================================
const header = document.querySelector('.inicio');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('rolando');
        } else {
            header.classList.remove('rolando');
        }
    });
}

document.querySelectorAll('.navegaMenu a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const destinoId = link.getAttribute('href');
        const secaoDestino = document.querySelector(destinoId);

        if (secaoDestino) {
            e.preventDefault();
            const tituloAlvo = secaoDestino.querySelector('h1') || secaoDestino;
            const alturaNavbar = header ? header.offsetHeight : 80;
            const posicaoTopo = tituloAlvo.getBoundingClientRect().top + window.scrollY - alturaNavbar - 18;

            window.scrollTo({
                top: Math.max(0, posicaoTopo),
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// 3. INCLINAÇÃO 3D SUAVE NOS BANNERS (PRINCIPAL E BIOGRAFIA)
// ==========================================
function aplicarInclinacao3D(elemento) {
    if (!elemento) return;

    elemento.addEventListener('mousemove', (e) => {
        const rect = elemento.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        elemento.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    elemento.addEventListener('mouseleave', () => {
        elemento.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
}

aplicarInclinacao3D(document.getElementById('banner-card'));
aplicarInclinacao3D(document.getElementById('bio-slideshow'));

// ==========================================
// 4. INTERAÇÕES DA SEÇÃO QUEM SOMOS (BIGHIT)
// ==========================================
const secaoSobre = document.getElementById('sobre');
const contadorAno = document.getElementById('contador-ano');
const sobreLogo = document.getElementById('sobre-logo');
const sobreLema = document.getElementById('sobre-lema');
const itensDestaque = document.querySelectorAll('.destaque-item');
const detalheDestaque = document.getElementById('detalhe-destaque');

let contadorJaRodou = false;
if (secaoSobre && contadorAno) {
    const obsAno = new IntersectionObserver((entradas) => {
        if (entradas[0].isIntersecting && !contadorJaRodou) {
            contadorJaRodou = true;
            let anoAtual = 1985;
            const intervaloAno = setInterval(() => {
                anoAtual++;
                contadorAno.textContent = anoAtual;
                if (anoAtual >= 2005) {
                    clearInterval(intervaloAno);
                }
            }, 45);
        }
    }, { threshold: 0.3 });

    obsAno.observe(secaoSobre);
}

if (sobreLogo && sobreLema) {
    const lemas = [
        '“Music & Artist for Healing”',
        '“Big Hit Entertainment (2005) ➔ BIGHIT MUSIC (2021)”'
    ];
    let indiceLema = 0;

    sobreLogo.addEventListener('click', (e) => {
        indiceLema = (indiceLema + 1) % lemas.length;
        sobreLema.textContent = lemas[indiceLema];

        sobreLogo.classList.remove('girar');
        void sobreLogo.offsetWidth;
        sobreLogo.classList.add('girar');

        for (let i = 0; i < 10; i++) {
            criarBrilho(e.clientX, e.clientY);
        }
    });
}

if (itensDestaque.length > 0 && detalheDestaque) {
    itensDestaque.forEach((item) => {
        item.addEventListener('click', (e) => {
            itensDestaque.forEach((el) => el.classList.remove('ativo'));
            item.classList.add('ativo');

            detalheDestaque.style.opacity = '0';
            setTimeout(() => {
                detalheDestaque.textContent = item.getAttribute('data-detalhe');
                detalheDestaque.style.opacity = '1';
            }, 150);

            for (let i = 0; i < 8; i++) {
                criarBrilho(e.clientX, e.clientY);
            }
        });
    });
}

// ==========================================
// 5. ANIMAÇÕES INTERATIVAS NOS CARDS DOS INTEGRANTES
// ==========================================
const cardsIntegrantes = document.querySelectorAll('.integrante-card');

cardsIntegrantes.forEach((card, index) => {
    card.style.transitionDelay = `${index * 90}ms`;

    const reflexo = card.querySelector('.card-reflexo');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateY = ((x / rect.width) - 0.5) * 14;
        const rotateX = -((y / rect.height) - 0.5) * 14;

        card.style.transitionDelay = '0ms';
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

        if (reflexo) {
            reflexo.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(224, 170, 255, 0.35), transparent 65%)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });

    card.addEventListener('click', (e) => {
        card.classList.remove('pulsando');
        void card.offsetWidth;
        card.classList.add('pulsando');

        const textoFanchant = card.getAttribute('data-fanchant');
        if (textoFanchant) {
            const etiqueta = document.createElement('span');
            etiqueta.classList.add('fanchant-flutuante');
            etiqueta.textContent = textoFanchant;
            etiqueta.style.left = `${e.clientX}px`;
            etiqueta.style.top = `${e.clientY}px`;
            document.body.appendChild(etiqueta);

            setTimeout(() => {
                etiqueta.remove();
            }, 1100);
        }

        for (let i = 0; i < 18; i++) {
            criarBrilho(e.clientX, e.clientY);
        }
    });
});

// ==========================================
// 6. SLIDESHOW AUTOMÁTICO DA BIOGRAFIA (IGUAL AO BANNER PRINCIPAL, 7s)
// ==========================================
const bioSlides = document.querySelectorAll('#bio-slideshow .bio-slide');
const bioIndicadores = document.getElementById('bio-indicadores');

let bioSlideAtual = 0;

if (bioSlides.length > 0 && bioIndicadores) {
    bioSlides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('ativo');
        bioIndicadores.appendChild(dot);
    });

    const bioDots = bioIndicadores.querySelectorAll('.dot');

    function proximoBioSlide() {
        bioSlides[bioSlideAtual].classList.remove('ativo');
        bioDots[bioSlideAtual].classList.remove('ativo');

        bioSlideAtual = (bioSlideAtual + 1) % bioSlides.length;

        bioSlides[bioSlideAtual].classList.add('ativo');
        bioDots[bioSlideAtual].classList.add('ativo');
    }

    setInterval(proximoBioSlide, 7000);
}

// ==========================================
// 7. PLAYER EMBUTIDO DE MÚSICAS DO ARIRANG
// ==========================================
const audioPlayer = document.getElementById('audio-player');
const itensFaixa = document.querySelectorAll('.faixa-item');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnFaixaAnterior = document.getElementById('btn-faixa-anterior');
const btnProximaFaixa = document.getElementById('btn-proxima-faixa');
const btnRepetir = document.getElementById('btn-repetir');
const controleVolume = document.getElementById('controle-volume');
const tituloFaixaAtual = document.getElementById('faixa-atual-titulo');
const statusPlayer = document.getElementById('player-status');
const discoVinil = document.getElementById('disco-vinil');
const equalizador = document.getElementById('equalizador');
const barraProgressoFundo = document.getElementById('barra-progresso-fundo');
const barraProgressoPreenchida = document.getElementById('barra-progresso-preenchida');
const tempoAtualEl = document.getElementById('tempo-atual');
const tempoTotalEl = document.getElementById('tempo-total');

function formatarTempo(segundos) {
    if (isNaN(segundos) || !isFinite(segundos)) return '00:00';
    const min = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60);
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

if (audioPlayer && itensFaixa.length > 0) {
    let indiceFaixaAtual = 0;
    let repetirAtivo = false;

    audioPlayer.volume = controleVolume ? parseFloat(controleVolume.value) : 0.85;

    function atualizarVisualTocando(tocando) {
        if (btnPlayPause) btnPlayPause.textContent = tocando ? '⏸' : '▶';
        if (discoVinil) discoVinil.classList.toggle('tocando', tocando);
        if (equalizador) equalizador.classList.toggle('tocando', tocando);
    }

    function carregarFaixa(indice, tocarAutomaticamente = false) {
        indiceFaixaAtual = (indice + itensFaixa.length) % itensFaixa.length;

        itensFaixa.forEach((item) => item.classList.remove('ativa'));
        const itemSelecionado = itensFaixa[indiceFaixaAtual];
        itemSelecionado.classList.add('ativa');

        const arquivoSrc = itemSelecionado.getAttribute('data-src');
        const titulo = itemSelecionado.getAttribute('data-titulo');
        const duracaoLista = itemSelecionado.querySelector('.faixa-duracao');

        audioPlayer.src = arquivoSrc;
        if (tituloFaixaAtual) tituloFaixaAtual.textContent = titulo;
        if (barraProgressoPreenchida) barraProgressoPreenchida.style.width = '0%';
        if (tempoAtualEl) tempoAtualEl.textContent = '00:00';
        if (tempoTotalEl) {
            tempoTotalEl.textContent = duracaoLista ? duracaoLista.textContent : '00:00';
        }

        if (tocarAutomaticamente) {
            audioPlayer.play()
                .then(() => {
                    atualizarVisualTocando(true);
                    if (statusPlayer) statusPlayer.textContent = `💜 Tocando agora: ${titulo}`;
                })
                .catch(() => {
                    atualizarVisualTocando(false);
                    if (statusPlayer) {
                        statusPlayer.textContent = `⚠️ Áudio de "${titulo}" ainda não disponível.`;
                    }
                });
        } else {
            atualizarVisualTocando(false);
            if (statusPlayer) statusPlayer.textContent = `Faixa selecionada: ${titulo}`;
        }
    }

    carregarFaixa(0, false);

    btnPlayPause.addEventListener('click', (e) => {
        const titulo = itensFaixa[indiceFaixaAtual].getAttribute('data-titulo');

        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    atualizarVisualTocando(true);
                    if (statusPlayer) statusPlayer.textContent = `💜 Tocando agora: ${titulo}`;
                    for (let i = 0; i < 12; i++) criarBrilho(e.clientX, e.clientY);
                })
                .catch(() => {
                    atualizarVisualTocando(false);
                    if (statusPlayer) {
                        statusPlayer.textContent = `⚠️ Áudio de "${titulo}" ainda não disponível.`;
                    }
                });
        } else {
            audioPlayer.pause();
            atualizarVisualTocando(false);
            if (statusPlayer) statusPlayer.textContent = '⏸ Reprodução pausada.';
        }
    });

    btnProximaFaixa.addEventListener('click', () => {
        carregarFaixa(indiceFaixaAtual + 1, true);
    });

    btnFaixaAnterior.addEventListener('click', () => {
        carregarFaixa(indiceFaixaAtual - 1, true);
    });

    btnRepetir.addEventListener('click', () => {
        repetirAtivo = !repetirAtivo;
        audioPlayer.loop = repetirAtivo;
        btnRepetir.classList.toggle('ativo', repetirAtivo);
        if (statusPlayer) {
            statusPlayer.textContent = repetirAtivo ? '🔁 Repetição da faixa ativada.' : '🔁 Repetição desativada.';
        }
    });

    itensFaixa.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            carregarFaixa(index, true);
            for (let i = 0; i < 10; i++) criarBrilho(e.clientX, e.clientY);
        });
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
        const duracaoFormatada = formatarTempo(audioPlayer.duration);
        if (tempoTotalEl) tempoTotalEl.textContent = duracaoFormatada;
        const spanDuracaoLista = itensFaixa[indiceFaixaAtual].querySelector('.faixa-duracao');
        if (spanDuracaoLista) spanDuracaoLista.textContent = duracaoFormatada;
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!audioPlayer.duration) return;
        const porcentagem = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (barraProgressoPreenchida) barraProgressoPreenchida.style.width = `${porcentagem}%`;
        if (tempoAtualEl) tempoAtualEl.textContent = formatarTempo(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('ended', () => {
        if (!repetirAtivo) {
            carregarFaixa(indiceFaixaAtual + 1, true);
        }
    });

    audioPlayer.addEventListener('error', () => {
        const titulo = itensFaixa[indiceFaixaAtual].getAttribute('data-titulo');
        atualizarVisualTocando(false);
        if (statusPlayer) {
            statusPlayer.textContent = `⚠️ Áudio de "${titulo}" ainda não disponível.`;
        }
    });

    if (barraProgressoFundo) {
        barraProgressoFundo.addEventListener('click', (e) => {
            if (!audioPlayer.duration) return;
            const rect = barraProgressoFundo.getBoundingClientRect();
            const cliqueX = e.clientX - rect.left;
            audioPlayer.currentTime = (cliqueX / rect.width) * audioPlayer.duration;
        });
    }

    if (controleVolume) {
        controleVolume.addEventListener('input', () => {
            audioPlayer.volume = parseFloat(controleVolume.value);
        });
    }
}

// ==========================================
// 8. ANIMAÇÃO DE APARIÇÃO AO ROLAR (SCROLL REVEAL)
// ==========================================
const elementosRevelar = document.querySelectorAll('.revelar');
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
        }
    });
}, { threshold: 0.12 });

elementosRevelar.forEach((el) => observador.observe(el));