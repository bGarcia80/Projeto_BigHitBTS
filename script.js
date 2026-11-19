const cursorPonto = document.querySelector('.cursor-ponto');
const gifCursor = document.getElementById('gif-cursor');
const isDispositivoTouch = window.matchMedia('(pointer: coarse)').matches;

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

// Cursor animado apenas em dispositivos com mouse (economiza bateria no celular)
if (!isDispositivoTouch) {
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
}

// Explosão de brilhos ao tocar ou clicar
window.addEventListener('click', (e) => {
    const qtdBrilhos = isDispositivoTouch ? 6 : 12;
    for (let i = 0; i < qtdBrilhos; i++) {
        criarBrilho(e.clientX, e.clientY);
    }
});

// ==========================================
// 1. MENU HAMBÚRGUER MOBILE E NAVEGAÇÃO SUAVE
// ==========================================
const header = document.querySelector('.inicio');
const menuToggle = document.getElementById('menu-toggle');
const navegaMenu = document.getElementById('navega-menu');
const linksMenu = document.querySelectorAll('.navegaMenu a[href^="#"]');

function fecharMenuMobile() {
    if (!menuToggle || !navegaMenu) return;
    menuToggle.classList.remove('aberto');
    navegaMenu.classList.remove('aberto');
    menuToggle.setAttribute('aria-expanded', 'false');
}

if (menuToggle && navegaMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const aberto = navegaMenu.classList.toggle('aberto');
        menuToggle.classList.toggle('aberto', aberto);
        menuToggle.setAttribute('aria-expanded', String(aberto));
    });

    document.addEventListener('click', (e) => {
        if (navegaMenu.classList.contains('aberto') && !header.contains(e.target)) {
            fecharMenuMobile();
        }
    });
}

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('rolando');
        } else {
            header.classList.remove('rolando');
        }
    }, { passive: true });
}

linksMenu.forEach((link) => {
    link.addEventListener('click', (e) => {
        const destinoId = link.getAttribute('href');
        const secaoDestino = document.querySelector(destinoId);

        fecharMenuMobile();

        if (secaoDestino) {
            e.preventDefault();
            const tituloAlvo = secaoDestino.querySelector('h1') || secaoDestino;
            const alturaNavbar = header ? header.offsetHeight : 72;
            const posicaoTopo = tituloAlvo.getBoundingClientRect().top + window.scrollY - alturaNavbar - 16;

            window.scrollTo({
                top: Math.max(0, posicaoTopo),
                behavior: 'smooth'
            });
        }
    });
});

// Destaca automaticamente a seção atual no menu ao rolar
const secoesSpy = ['topo', 'sobre', 'integrantes', 'historia', 'musicas']
    .map((id) => document.getElementById(id))
    .filter(Boolean);

window.addEventListener('scroll', () => {
    const posScroll = window.scrollY + (header ? header.offsetHeight : 80) + 60;
    let idAtivo = 'topo';

    secoesSpy.forEach((sec) => {
        if (posScroll >= sec.offsetTop) {
            idAtivo = sec.id;
        }
    });

    linksMenu.forEach((link) => {
        link.classList.toggle('menu-ativo', link.getAttribute('href') === `#${idAtivo}`);
    });
}, { passive: true });

// ==========================================
// 2. FUNÇÃO UNIFICADA DE SLIDESHOW (AUTOMÁTICO + SWIPE TOUCH)
// ==========================================
function iniciarSlideshow(containerId, seletorSlides, intervaloMs) {
    const container = document.getElementById(containerId);
    const listaSlides = document.querySelectorAll(seletorSlides);

    if (!container || listaSlides.length === 0) return;

    let indiceAtual = 0;
    let timer = null;

    function irParaSlide(novoIndice) {
        listaSlides[indiceAtual].classList.remove('ativo');
        indiceAtual = (novoIndice + listaSlides.length) % listaSlides.length;
        listaSlides[indiceAtual].classList.add('ativo');
    }

    function iniciarAuto() {
        clearInterval(timer);
        timer = setInterval(() => irParaSlide(indiceAtual + 1), intervaloMs);
    }

    // Suporte a deslizar o dedo (swipe) no celular
    let toqueInicioX = 0;
    container.addEventListener('touchstart', (e) => {
        toqueInicioX = e.changedTouches[0].clientX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        const deltaX = e.changedTouches[0].clientX - toqueInicioX;
        if (Math.abs(deltaX) > 40) {
            if (deltaX < 0) {
                irParaSlide(indiceAtual + 1);
            } else {
                irParaSlide(indiceAtual - 1);
            }
            iniciarAuto();
        }
    }, { passive: true });

    iniciarAuto();
}

iniciarSlideshow('banner-card', '#banner-card .slide', 6500);
iniciarSlideshow('bio-slideshow', '#bio-slideshow .bio-slide', 7000);

// ==========================================
// 3. INCLINAÇÃO 3D SUAVE NOS BANNERS (APENAS DESKTOP)
// ==========================================
function aplicarInclinacao3D(elemento) {
    if (!elemento || isDispositivoTouch) return;

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
    }, { threshold: 0.25 });

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

        for (let i = 0; i < (isDispositivoTouch ? 5 : 10); i++) {
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

            for (let i = 0; i < (isDispositivoTouch ? 4 : 8); i++) {
                criarBrilho(e.clientX, e.clientY);
            }
        });
    });
}

// ==========================================
// 5. ANIMAÇÕES INTERATIVAS NOS CARDS DOS INTEGRANTES E BOTÃO BTS
// ==========================================
const cardsIntegrantes = document.querySelectorAll('.integrante-card');
const btnFanchantBts = document.getElementById('btn-fanchant-bts');

function mostrarFanchantFlutuante(texto, x, y) {
    if (!texto) return;

    const etiqueta = document.createElement('span');
    etiqueta.classList.add('fanchant-flutuante');
    etiqueta.textContent = texto;

    // Impede que o balão seja cortado nas bordas da tela do celular
    const margemSegura = 95;
    const posX = Math.min(Math.max(x, margemSegura), window.innerWidth - margemSegura);
    const posY = Math.max(y, 70);

    etiqueta.style.left = `${posX}px`;
    etiqueta.style.top = `${posY}px`;
    document.body.appendChild(etiqueta);

    setTimeout(() => {
        etiqueta.remove();
    }, 1100);
}

cardsIntegrantes.forEach((card, index) => {
    card.style.transitionDelay = `${index * 80}ms`;

    const reflexo = card.querySelector('.card-reflexo');

    if (!isDispositivoTouch) {
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
    }

    card.addEventListener('click', (e) => {
        card.style.transitionDelay = '0ms';
        card.classList.remove('pulsando', 'pulo-bts');
        void card.offsetWidth;
        card.classList.add('pulsando');

        mostrarFanchantFlutuante(card.getAttribute('data-fanchant'), e.clientX, e.clientY);

        for (let i = 0; i < (isDispositivoTouch ? 8 : 18); i++) {
            criarBrilho(e.clientX, e.clientY);
        }
    });
});

if (btnFanchantBts) {
    btnFanchantBts.addEventListener('click', (e) => {
        const rect = btnFanchantBts.getBoundingClientRect();
        const cliqueX = e.clientX || rect.left + rect.width / 2;
        const cliqueY = e.clientY || rect.top + rect.height / 2;

        // Exibe apenas a escrita BTS
        mostrarFanchantFlutuante('BTS! 💜', cliqueX, cliqueY);

        // Destaca e faz todos os 7 cards pularem juntos
        cardsIntegrantes.forEach((card) => {
            card.style.transitionDelay = '0ms';
            card.classList.remove('pulsando', 'pulo-bts');
            void card.offsetWidth;
            card.classList.add('pulo-bts');

            clearTimeout(card._timerPuloBts);
            card._timerPuloBts = setTimeout(() => {
                card.classList.remove('pulo-bts');
            }, 620);
        });

        for (let i = 0; i < (isDispositivoTouch ? 10 : 22); i++) {
            criarBrilho(cliqueX, cliqueY);
        }
    });
}

// ==========================================
// 6. PLAYER EMBUTIDO DE MÚSICAS DO ARIRANG
// ==========================================
const audioPlayer = document.getElementById('audio-player');
const listaFaixasContainer = document.getElementById('lista-faixas');
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

    function rolarPlaylistParaFaixa(item) {
        if (!listaFaixasContainer || !item) return;
        const topoAlvo = item.offsetTop - listaFaixasContainer.offsetTop - (listaFaixasContainer.clientHeight / 2) + (item.clientHeight / 2);
        listaFaixasContainer.scrollTo({
            top: Math.max(0, topoAlvo),
            behavior: 'smooth'
        });
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
            rolarPlaylistParaFaixa(itemSelecionado);
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
                    for (let i = 0; i < (isDispositivoTouch ? 6 : 12); i++) criarBrilho(e.clientX, e.clientY);
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
            for (let i = 0; i < (isDispositivoTouch ? 5 : 10); i++) criarBrilho(e.clientX, e.clientY);
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

    // Busca na barra de progresso por clique ou arrasto com o dedo
    if (barraProgressoFundo) {
        const atualizarTempoPorPosicao = (clientX) => {
            if (!audioPlayer.duration) return;
            const rect = barraProgressoFundo.getBoundingClientRect();
            const proporcao = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
            audioPlayer.currentTime = proporcao * audioPlayer.duration;
        };

        barraProgressoFundo.addEventListener('click', (e) => {
            atualizarTempoPorPosicao(e.clientX);
        });

        barraProgressoFundo.addEventListener('touchstart', (e) => {
            atualizarTempoPorPosicao(e.touches[0].clientX);
        }, { passive: true });

        barraProgressoFundo.addEventListener('touchmove', (e) => {
            atualizarTempoPorPosicao(e.touches[0].clientX);
        }, { passive: true });
    }

    if (controleVolume) {
        controleVolume.addEventListener('input', () => {
            audioPlayer.volume = parseFloat(controleVolume.value);
        });
    }
}

// ==========================================
// 7. ANIMAÇÃO DE APARIÇÃO AO ROLAR (SCROLL REVEAL)
// ==========================================
const elementosRevelar = document.querySelectorAll('.revelar');
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visivel');
        }
    });
}, { threshold: 0.1 });

elementosRevelar.forEach((el) => observador.observe(el));