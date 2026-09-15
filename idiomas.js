// Idiomas — troca TODAS as letras do site e dos jogos pro idioma escolhido.
// Escolha em /conta/ (⚙️ → 🌍 Idiomas). Usa o tradutor do Google por baixo dos panos.
(function () {
    var LS_KEY = 'cg_idioma';
    window.IDIOMAS = [
        ['pt','🇧🇷','Português'],['en','🇺🇸','English'],['es','🇪🇸','Español'],['fr','🇫🇷','Français'],['de','🇩🇪','Deutsch'],
        ['it','🇮🇹','Italiano'],['ja','🇯🇵','日本語'],['zh-CN','🇨🇳','中文 (简体)'],['zh-TW','🇹🇼','中文 (繁體)'],['ko','🇰🇷','한국어'],
        ['ru','🇷🇺','Русский'],['ar','🇸🇦','العربية'],['hi','🇮🇳','हिन्दी'],['bn','🇧🇩','বাংলা'],['ur','🇵🇰','اردو'],
        ['id','🇮🇩','Bahasa Indonesia'],['ms','🇲🇾','Bahasa Melayu'],['tr','🇹🇷','Türkçe'],['vi','🇻🇳','Tiếng Việt'],['th','🇹🇭','ไทย'],
        ['nl','🇳🇱','Nederlands'],['pl','🇵🇱','Polski'],['uk','🇺🇦','Українська'],['ro','🇷🇴','Română'],['el','🇬🇷','Ελληνικά'],
        ['sv','🇸🇪','Svenska'],['no','🇳🇴','Norsk'],['da','🇩🇰','Dansk'],['fi','🇫🇮','Suomi'],['cs','🇨🇿','Čeština'],
        ['hu','🇭🇺','Magyar'],['he','🇮🇱','עברית'],['fa','🇮🇷','فارسی'],['sw','🇰🇪','Kiswahili'],['ta','🇱🇰','தமிழ்'],
        ['te','🇮🇳','తెలుగు'],['mr','🇮🇳','मराठी'],['pa','🇮🇳','ਪੰਜਾਬੀ'],['gu','🇮🇳','ગુજરાતી'],['tl','🇵🇭','Filipino'],
        ['bg','🇧🇬','Български'],['sr','🇷🇸','Српски'],['hr','🇭🇷','Hrvatski'],['sk','🇸🇰','Slovenčina'],['lt','🇱🇹','Lietuvių'],
        ['ca','🏴','Català'],['af','🇿🇦','Afrikaans'],['am','🇪🇹','አማርኛ'],['la','🏛️','Latina'],['eo','🌍','Esperanto']
    ];
    function get(){ try { return localStorage.getItem(LS_KEY) || 'pt'; } catch(e){ return 'pt'; } }
    function setCookie(lang){
        var v = lang === 'pt' ? '' : '/pt/' + lang;
        var exp = lang === 'pt' ? 'Thu, 01 Jan 1970 00:00:00 GMT' : 'Fri, 31 Dec 2099 23:59:59 GMT';
        var host = location.hostname;
        document.cookie = 'googtrans=' + v + '; expires=' + exp + '; path=/';
        document.cookie = 'googtrans=' + v + '; expires=' + exp + '; path=/; domain=' + host;
        document.cookie = 'googtrans=' + v + '; expires=' + exp + '; path=/; domain=.' + host.replace(/^www\./,'');
    }
    window.idiomaAtual = get;
    window.trocaIdioma = function (lang) {
        try { localStorage.setItem(LS_KEY, lang); } catch(e){}
        setCookie(lang);
        location.reload();
    };

    // ---- carrega o tradutor se o idioma não for português ----
    var atual = get();
    if (atual !== 'pt') {
        setCookie(atual);
        var css = document.createElement('style');
        css.textContent = '.goog-te-banner-frame,.skiptranslate iframe,#goog-gt-tt,.goog-te-balloon-frame{display:none!important}' +
            'body{top:0!important}.goog-text-highlight{background:none!important;box-shadow:none!important}' +
            '#google_translate_element{position:fixed;left:-9999px;top:-9999px}';
        document.head.appendChild(css);
        var div = document.createElement('div'); div.id = 'google_translate_element';
        (document.body || document.documentElement).appendChild(div);
        window.googleTranslateElementInit = function () {
            try { new google.translate.TranslateElement({ pageLanguage: 'pt', autoDisplay: false }, 'google_translate_element'); } catch(e){}
        };
        var s = document.createElement('script');
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        s.async = true; document.head.appendChild(s);
        // avisa o mascote/jogos que a página está traduzida (caso queiram ignorar)
        document.documentElement.setAttribute('data-idioma', atual);
    }


    // ---- tradução de texto DESENHADO nos jogos (canvas) ----
    if (atual !== 'pt' && window.CanvasRenderingContext2D) {
        var CK = 'cg_tr_' + atual, cache = {}, fila = [], pend = {}, ativos = 0, salvarT = 0;
        try { cache = JSON.parse(localStorage.getItem(CK) || '{}') || {}; } catch(e){ cache = {}; }
        function salvar(){ clearTimeout(salvarT); salvarT = setTimeout(function(){ try { localStorage.setItem(CK, JSON.stringify(cache)); } catch(e){} }, 800); }
        function temLetra(t){ return /[A-Za-zÀ-ÿ]{2,}/.test(t); }
        var NUM = /\d[\d.,:]*/g;
        function chave(t){ return t.replace(NUM, '{N}'); }
        function aplica(tpl, orig){
            var nums = orig.match(NUM) || [], i = 0;
            var out = tpl.replace(/\{\s*N\s*\}/g, function(m){ return i < nums.length ? nums[i++] : m; });
            return (i < nums.length) ? null : out;
        }
        function pede(k){ if (pend[k] || (k in cache)) return; pend[k] = 1; fila.push(k); bomba(); }
        function bomba(){
            while (ativos < 3 && fila.length) {
                var k = fila.shift(); ativos++;
                (function(k){
                    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=' + encodeURIComponent(atual) + '&dt=t&q=' + encodeURIComponent(k);
                    fetch(url).then(function(r){ return r.json(); }).then(function(j){
                        var t = ''; try { j[0].forEach(function(p){ if (p && p[0]) t += p[0]; }); } catch(e){}
                        cache[k] = t ? t : k; salvar();
                    }).catch(function(){ cache[k] = k; }).then(function(){ ativos--; delete pend[k]; bomba(); });
                })(k);
            }
        }
        function tr(t){
            if (typeof t !== 'string' || t.length < 2 || t.length > 300 || !temLetra(t)) return t;
            var k = chave(t);
            if (k in cache) { var r = aplica(cache[k], t); return r === null ? t : r; }
            pede(k); return t;
        }
        var P = CanvasRenderingContext2D.prototype;
        ['fillText','strokeText'].forEach(function(fn){
            var o = P[fn];
            P[fn] = function(t){ var a = Array.prototype.slice.call(arguments); a[0] = tr(String(t)); return o.apply(this, a); };
        });
        var oM = P.measureText;
        P.measureText = function(t){ return oM.call(this, tr(String(t))); };
        window.traduzTexto = tr;
    }

    // ---- tela de escolha (50 idiomas) ----
    window.abreIdiomas = function () {
        var old = document.getElementById('modalIdiomas'); if (old) old.remove();
        var m = document.createElement('div'); m.id = 'modalIdiomas'; m.className = 'notranslate'; m.setAttribute('translate','no');
        m.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,20,0.92);overflow:auto;padding:20px;font-family:inherit;color:#fff';
        var cur = get();
        var h = '<div style="max-width:900px;margin:0 auto">' +
            '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px">' +
            '<h2 style="margin:0;font-size:26px">🌍 Idiomas</h2>' +
            '<button onclick="fechaIdiomas()" style="width:auto;margin:0;padding:8px 16px;font-size:18px;background:#ff3355;border:none;border-radius:12px;color:#fff;cursor:pointer">✖ Fechar</button></div>' +
            '<div style="opacity:.8;font-size:14px;margin-bottom:14px">Escolha um idioma e TODAS as letras do site e dos jogos mudam. Pra voltar, escolha Português.</div>' +
            '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px">';
        window.IDIOMAS.forEach(function (l) {
            var sel = l[0] === cur;
            h += '<button onclick="trocaIdioma(\'' + l[0] + '\')" style="margin:0;width:100%;text-align:left;padding:10px 12px;font-size:15px;border-radius:12px;cursor:pointer;color:#fff;' +
                'border:2px solid ' + (sel ? '#00ff88' : '#444') + ';background:' + (sel ? 'rgba(0,255,136,0.18)' : 'rgba(20,20,50,0.9)') + '">' +
                '<span style="font-size:20px;margin-right:8px">' + l[1] + '</span>' + l[2] + (sel ? ' ✅' : '') + '</button>';
        });
        h += '</div></div>';
        m.innerHTML = h;
        document.body.appendChild(m);
    };
    window.fechaIdiomas = function () { var m = document.getElementById('modalIdiomas'); if (m) m.remove(); };
})();
