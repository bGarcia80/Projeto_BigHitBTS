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

// Cursor animado apenas em dispositivos com mouse
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
const btnPortfolio = document.querySelector('.btn-portfolio');

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

if (btnPortfolio) {
    btnPortfolio.addEventListener('click', () => {
        fecharMenuMobile();
    });
}

function atualizarEstadoNavbar() {
    if (!header) return;
    if (window.scrollY > 20) {
        header.classList.add('rolando');
    } else {
        header.classList.remove('rolando');
    }
}

atualizarEstadoNavbar();
window.addEventListener('scroll', atualizarEstadoNavbar, { passive: true });

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
// 5. ANIMAÇÕES INTERATIVAS NOS CARDS (BTS E BT21)
// ==========================================
const todosCardsPersonagens = document.querySelectorAll('.integrante-card');
const cardsMembrosBts = document.querySelectorAll('#integrantes .integrante-card');
const cardsPersonagensBt21 = document.querySelectorAll('#bt21 .integrante-card');
const btnFanchantBts = document.getElementById('btn-fanchant-bts');
const btnFanchantBt21 = document.getElementById('btn-fanchant-bt21');

function mostrarFanchantFlutuante(texto, x, y) {
    if (!texto) return;

    const etiqueta = document.createElement('span');
    etiqueta.classList.add('fanchant-flutuante');
    etiqueta.textContent = texto;

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

todosCardsPersonagens.forEach((card, index) => {
    card.style.transitionDelay = `${(index % 8) * 70}ms`;

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

function configurarBotaoPuloGrupo(botao, listaCards, textoFlutuante) {
    if (!botao) return;

    botao.addEventListener('click', (e) => {
        const rect = botao.getBoundingClientRect();
        const cliqueX = e.clientX || rect.left + rect.width / 2;
        const cliqueY = e.clientY || rect.top + rect.height / 2;

        mostrarFanchantFlutuante(textoFlutuante, cliqueX, cliqueY);

        listaCards.forEach((card) => {
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

configurarBotaoPuloGrupo(btnFanchantBts, cardsMembrosBts, 'BTS! 💜');
configurarBotaoPuloGrupo(btnFanchantBt21, cardsPersonagensBt21, 'BT21! 💜');

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
    let usuarioInteragiu = false;

    audioPlayer.volume = controleVolume ? parseFloat(controleVolume.value) : 0.85;

    function resolverUrlAudio(caminhoRelativo) {
        try {
            return new URL(caminhoRelativo, window.location.href).href;
        } catch {
            return caminhoRelativo;
        }
    }

    function atualizarMediaSession(titulo) {
        if ('mediaSession' in navigator) {
            try {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: titulo,
                    artist: 'BTS',
                    album: 'ARIRANG',
                    artwork: [
                        { src: resolverUrlAudio('./img/capa.jpg'), sizes: '512x512', type: 'image/jpeg' }
                    ]
                });
            } catch {
                // Ignora em navegadores sem suporte completo ao MediaMetadata
            }
        }
    }

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

    function executarPlayMobileSeguro(titulo) {
        usuarioInteragiu = true;
        if (statusPlayer) statusPlayer.textContent = `⏳ Carregando: ${titulo}...`;

        const promessaPlay = audioPlayer.play();
        if (promessaPlay !== undefined) {
            promessaPlay
                .then(() => {
                    atualizarVisualTocando(true);
                    atualizarMediaSession(titulo);
                    if (statusPlayer) statusPlayer.textContent = `💜 Tocando agora: ${titulo}`;
                })
                .catch((erro) => {
                    if (erro && erro.name === 'AbortError') return;
                    atualizarVisualTocando(false);
                    if (statusPlayer) {
                        if (erro && erro.name === 'NotAllowedError') {
                            statusPlayer.textContent = `▶️ Toque novamente em Play para iniciar "${titulo}".`;
                        } else if (erro && erro.name === 'NotSupportedError') {
                            statusPlayer.textContent = `⚠️ Codec de áudio incompatível com este celular em "${titulo}".`;
                        } else {
                            statusPlayer.textContent = `⚠️ Não foi possível reproduzir "${titulo}" (${erro ? erro.name : 'erro'}).`;
                        }
                    }
                });
        }
    }

    function carregarFaixa(indice, tocarAutomaticamente = false) {
        indiceFaixaAtual = (indice + itensFaixa.length) % itensFaixa.length;

        itensFaixa.forEach((item) => item.classList.remove('ativa'));
        const itemSelecionado = itensFaixa[indiceFaixaAtual];
        itemSelecionado.classList.add('ativa');

        const urlAudio = resolverUrlAudio(itemSelecionado.getAttribute('data-src'));
        const titulo = itemSelecionado.getAttribute('data-titulo');
        const duracaoLista = itemSelecionado.querySelector('.faixa-duracao');

        audioPlayer.pause();
        audioPlayer.src = urlAudio;
        audioPlayer.load();

        if (tituloFaixaAtual) tituloFaixaAtual.textContent = titulo;
        if (barraProgressoPreenchida) barraProgressoPreenchida.style.width = '0%';
        if (tempoAtualEl) tempoAtualEl.textContent = '00:00';
        if (tempoTotalEl) {
            tempoTotalEl.textContent = duracaoLista ? duracaoLista.textContent : '00:00';
        }

        if (tocarAutomaticamente) {
            rolarPlaylistParaFaixa(itemSelecionado);
            executarPlayMobileSeguro(titulo);
        } else {
            atualizarVisualTocando(false);
            if (statusPlayer) statusPlayer.textContent = `Faixa selecionada: ${titulo}`;
        }
    }

    carregarFaixa(0, false);

    btnPlayPause.addEventListener('click', (e) => {
        const itemAtual = itensFaixa[indiceFaixaAtual];
        const titulo = itemAtual.getAttribute('data-titulo');
        const urlAudio = resolverUrlAudio(itemAtual.getAttribute('data-src'));

        if (audioPlayer.paused) {
            if (audioPlayer.error || audioPlayer.readyState === 0 || !audioPlayer.currentSrc) {
                audioPlayer.src = urlAudio;
                audioPlayer.load();
            }

            executarPlayMobileSeguro(titulo);
            for (let i = 0; i < (isDispositivoTouch ? 6 : 12); i++) criarBrilho(e.clientX, e.clientY);
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

    if ('mediaSession' in navigator) {
        try {
            navigator.mediaSession.setActionHandler('play', () => {
                const titulo = itensFaixa[indiceFaixaAtual].getAttribute('data-titulo');
                executarPlayMobileSeguro(titulo);
            });
            navigator.mediaSession.setActionHandler('pause', () => {
                audioPlayer.pause();
                atualizarVisualTocando(false);
            });
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                carregarFaixa(indiceFaixaAtual - 1, true);
            });
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                carregarFaixa(indiceFaixaAtual + 1, true);
            });
        } catch {
            // Ignora ações não suportadas no dispositivo
        }
    }

    audioPlayer.addEventListener('loadedmetadata', () => {
        const duracaoFormatada = formatarTempo(audioPlayer.duration);
        if (duracaoFormatada !== '00:00') {
            if (tempoTotalEl) tempoTotalEl.textContent = duracaoFormatada;
            const spanDuracaoLista = itensFaixa[indiceFaixaAtual].querySelector('.faixa-duracao');
            if (spanDuracaoLista) spanDuracaoLista.textContent = duracaoFormatada;
        }
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (!isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) return;
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
        if (!usuarioInteragiu) return;
        const titulo = itensFaixa[indiceFaixaAtual].getAttribute('data-titulo');
        const codigo = audioPlayer.error ? audioPlayer.error.code : 0;
        atualizarVisualTocando(false);

        if (statusPlayer) {
            if (codigo === 3 || codigo === 4) {
                statusPlayer.textContent = `⚠️ Formato/codec incompatível com este celular em "${titulo}" (código ${codigo}).`;
            } else if (codigo === 2) {
                statusPlayer.textContent = `⚠️ Falha de rede ao baixar "${titulo}".`;
            } else {
                statusPlayer.textContent = `⚠️ Erro ao carregar "${titulo}" (código ${codigo}).`;
            }
        }
    });

    if (barraProgressoFundo) {
        const atualizarTempoPorPosicao = (clientX) => {
            if (!isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) return;
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

// ==========================================
// 8. JANELA POPUP E CHEATCODES
// ==========================================
(function iniciarComandosPortal() {
    let modoArmyBombAtivo = false;
    let historicoTeclas = '';
    const konamiSequencia = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let indiceKonami = 0;

    const modalComandos = document.getElementById('modal-comandos');
    const btnAbrirGuia = document.getElementById('btn-abrir-guia');
    const btnFecharModal = document.getElementById('btn-fechar-modal');

    function abrirModalComandos() {
        if (!modalComandos) return;
        fecharMenuMobile();
        modalComandos.classList.add('aberto');
        modalComandos.setAttribute('aria-hidden', 'false');
    }

    function fecharModalComandos() {
        if (!modalComandos) return;
        modalComandos.classList.remove('aberto');
        modalComandos.setAttribute('aria-hidden', 'true');
    }

    if (btnAbrirGuia) {
        btnAbrirGuia.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModalComandos();
        });
    }

    if (btnFecharModal) {
        btnFecharModal.addEventListener('click', fecharModalComandos);
    }

    if (modalComandos) {
        modalComandos.addEventListener('click', (e) => {
            if (e.target === modalComandos) {
                fecharModalComandos();
            }
        });
    }

    function mostrarAvisoPortal(mensagem) {
        const anterior = document.querySelector('.toast-easter-egg');
        if (anterior) anterior.remove();

        const toast = document.createElement('div');
        toast.className = 'toast-easter-egg';
        toast.textContent = mensagem;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('visivel'));

        setTimeout(() => {
            toast.classList.remove('visivel');
            setTimeout(() => toast.remove(), 350);
        }, 3600);
    }

    function dispararChuva(simbolos = ['💜', '✨', '🌟', '🎤', '💫'], quantidade = 36) {
        const total = isDispositivoTouch ? Math.floor(quantidade * 0.65) : quantidade;
        for (let i = 0; i < total; i++) {
            setTimeout(() => {
                const item = document.createElement('span');
                item.className = 'particula-chuva';
                item.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
                item.style.left = `${Math.random() * 96 + 2}vw`;
                item.style.fontSize = `${Math.random() * 16 + 16}px`;
                item.style.animationDuration = `${Math.random() * 2 + 2.4}s`;
                document.body.appendChild(item);

                setTimeout(() => item.remove(), 4600);
            }, i * 55);
        }
    }

    function alternarModoArmyBomb() {
        modoArmyBombAtivo = !modoArmyBombAtivo;
        document.body.classList.toggle('modo-army-bomb', modoArmyBombAtivo);

        if (modoArmyBombAtivo) {
            simbolosBrilho.splice(0, simbolosBrilho.length, '💜', '💣', '✨', '🌟', '🎶');
            mostrarAvisoPortal('💜 MODO ARMY BOMB ATIVADO! Borahae!');
            dispararChuva(['💜', '💣', '✨'], 34);
        } else {
            simbolosBrilho.splice(0, simbolosBrilho.length, '✦', '✨', '★', '✧', '💜');
            mostrarAvisoPortal('🌙 Modo ARMY Bomb desativado.');
        }
    }

    function ativarCelebracaoDebut() {
        mostrarAvisoPortal('🎉 13.06.2013 • Feliz aniversário de estreia, BTS & ARMY! 💜');
        dispararChuva(['💜', '🎂', '✨', '🏆', '7️⃣'], 45);
        if (btnFanchantBts) btnFanchantBts.click();
    }

    function ativarCaravanaBt21() {
        mostrarAvisoPortal('🚀 Universo BT21 em desfile!');
        if (btnFanchantBt21) btnFanchantBt21.click();

        const imagensBt21 = [
            './img/koya.png', './img/rj.png', './img/shooky.png', './img/mang.png',
            './img/chimmy.png', './img/tata.png', './img/cooky.png', './img/van.png'
        ];

        const caravana = document.createElement('div');
        caravana.className = 'caravana-bt21';
        imagensBt21.forEach((src) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'BT21';
            caravana.appendChild(img);
        });

        document.body.appendChild(caravana);
        setTimeout(() => caravana.remove(), 6800);
    }

    function ativarTurboArirang() {
        mostrarAvisoPortal('💿 MODO ARIRANG DOURADO ATIVADO!');
        dispararChuva(['💿', '🎶', '✨', '💜'], 30);

        if (discoVinil) {
            discoVinil.classList.add('modo-turbo');
            setTimeout(() => discoVinil.classList.remove('modo-turbo'), 12000);
        }

        const secaoMusicas = document.getElementById('musicas');
        if (secaoMusicas) {
            secaoMusicas.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (audioPlayer && audioPlayer.paused && btnPlayPause) {
            btnPlayPause.click();
        }
    }

    function ativarOndaBangtan() {
        mostrarAvisoPortal('🕹️ Onda Bangtan + BT21 ativada! 💜');
        dispararChuva(['💜', '🔥', '👑', '✨', '7️⃣'], 50);

        const letreiro = document.querySelector('.letreiro-trilha');
        if (letreiro) {
            letreiro.classList.add('turbo');
            setTimeout(() => letreiro.classList.remove('turbo'), 8000);
        }

        todosCardsPersonagens.forEach((card, idx) => {
            setTimeout(() => {
                card.classList.remove('pulsando', 'pulo-bts');
                void card.offsetWidth;
                card.classList.add('pulo-bts');
            }, idx * 85);
        });
    }

    function ativarAvisoSamara() {
        mostrarAvisoPortal('✌️ Indentação de 2 dedos aprovada pela Profª Samara!');
    }

    // Teclado: palavras-chave, Konami Code e tecla ESC para fechar o popup
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalComandos && modalComandos.classList.contains('aberto')) {
            fecharModalComandos();
            return;
        }

        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

        const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const esperada = konamiSequencia[indiceKonami];

        if (tecla === esperada) {
            indiceKonami++;
            if (indiceKonami === konamiSequencia.length) {
                indiceKonami = 0;
                if (modalComandos && modalComandos.classList.contains('aberto')) fecharModalComandos();
                ativarOndaBangtan();
            }
        } else {
            indiceKonami = tecla === konamiSequencia[0] ? 1 : 0;
        }

        if (e.key.length === 1) {
            historicoTeclas = (historicoTeclas + e.key.toLowerCase()).slice(-15);

            if (historicoTeclas.endsWith('borahae') || historicoTeclas.endsWith('army')) {
                historicoTeclas = '';
                if (modalComandos && modalComandos.classList.contains('aberto')) fecharModalComandos();
                alternarModoArmyBomb();
            } else if (historicoTeclas.endsWith('2013') || historicoTeclas.endsWith('130613')) {
                historicoTeclas = '';
                if (modalComandos && modalComandos.classList.contains('aberto')) fecharModalComandos();
                ativarCelebracaoDebut();
            } else if (historicoTeclas.endsWith('bt21')) {
                historicoTeclas = '';
                if (modalComandos && modalComandos.classList.contains('aberto')) fecharModalComandos();
                ativarCaravanaBt21();
            } else if (historicoTeclas.endsWith('arirang')) {
                historicoTeclas = '';
                if (modalComandos && modalComandos.classList.contains('aberto')) fecharModalComandos();
                ativarTurboArirang();
            } else if (historicoTeclas.endsWith('samara') || historicoTeclas.endsWith('2fingers')) {
                historicoTeclas = '';
                if (modalComandos && modalComandos.classList.contains('aberto')) fecharModalComandos();
                ativarAvisoSamara();
            }
        }
    });

    // Ativação por gestos/toques rápidos na página
    const logoBighit = document.getElementById('bighit');
    if (logoBighit) {
        let cliquesLogo = 0;
        let timerLogo = null;

        logoBighit.addEventListener('click', (e) => {
            cliquesLogo++;
            clearTimeout(timerLogo);

            if (cliquesLogo >= 7) {
                e.preventDefault();
                cliquesLogo = 0;
                alternarModoArmyBomb();
            } else {
                timerLogo = setTimeout(() => {
                    cliquesLogo = 0;
                }, 1800);
            }
        });
    }

    if (discoVinil) {
        let cliquesVinil = 0;
        let timerVinil = null;

        discoVinil.addEventListener('click', () => {
            cliquesVinil++;
            clearTimeout(timerVinil);

            if (cliquesVinil >= 5) {
                cliquesVinil = 0;
                ativarTurboArirang();
            } else {
                timerVinil = setTimeout(() => {
                    cliquesVinil = 0;
                }, 1600);
            }
        });
    }

    document.querySelectorAll('.twofingers').forEach((paragrafo) => {
        let cliquesP = 0;
        let timerP = null;

        paragrafo.addEventListener('click', () => {
            cliquesP++;
            clearTimeout(timerP);

            if (cliquesP >= 3) {
                cliquesP = 0;
                ativarAvisoSamara();
            } else {
                timerP = setTimeout(() => {
                    cliquesP = 0;
                }, 1200);
            }
        });
    });
})();