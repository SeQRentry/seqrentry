(function() {var n=null,o=!1;window.SeQRentry={};window.addEventListener("load",function p(){window.removeEventListener("load",p,o);SeQRentry.install()},o);var q="data-seqrentry-id",s="data-seqrentry-type",t={},u=0;
function x(a){var b=a.getAttribute(q);a.getAttribute(s);b||(b=String(++u),t[b]={i:a,href:n,e:n},a.setAttribute(q,b),a.innerHTML="<img src='../SeQRentry-logo-64.png' style='width: 100%;' />",a.addEventListener("click",function(a){a.stopPropagation();a=b;t[a].href?window.open(t[a].href):y(a)},o),"button"==a.localName&&!a.hasAttribute("onclick")&&a.setAttribute("onclick","return false;"))}
function z(a){var b=document.getElementById("seqrentry-script");b&&b.parentNode.removeChild(b);b=document.body.appendChild(document.createElement("script"));b.setAttribute("id","seqrentry-script");b.setAttribute("src",a)}function y(a){z((SEQRENTRY_PROXY_URL||"http://seqrentry.net/")+"create-proxy.js?ident="+a)}
SeQRentry.proxyCreated=function(a,b){console.log("SeQRentry.proxyCreated",a,b);var f=b.ident;t[f].href="http://seqrentry.net/"+t[f].i.getAttribute(s)+"?p="+encodeURIComponent(b.proxy)+"&t="+encodeURIComponent(b.token);var d=t[f].i,c=new A(10,B);c.g.push(new C(t[f].href));c.f=n;if(1>c.d){for(var g=1,g=1;40>g;g++){for(var k=D(g,c.j),l=new E,i=0,h=0;h<k.length;h++)i+=k[h].h;for(h=0;h<c.g.length;h++)k=c.g[h],l.put(k.mode,4),l.put(k.c(),F(k.mode,g)),k.write(l);if(l.length<=8*i)break}c.d=g}for(i=l=g=0;8>
i;i++){G(c,!0,i);for(var h=c,k=h.a,m=0,j=0;j<k;j++)for(var e=0;e<k;e++){for(var r=0,U=H(h,j,e),v=-1;1>=v;v++)if(!(0>j+v||k<=j+v))for(var w=-1;1>=w;w++)0>e+w||k<=e+w||0==v&&0==w||U==H(h,j+v,e+w)&&r++;5<r&&(m+=3+r-5)}for(j=0;j<k-1;j++)for(e=0;e<k-1;e++)if(r=0,H(h,j,e)&&r++,H(h,j+1,e)&&r++,H(h,j,e+1)&&r++,H(h,j+1,e+1)&&r++,0==r||4==r)m+=3;for(j=0;j<k;j++)for(e=0;e<k-6;e++)H(h,j,e)&&(!H(h,j,e+1)&&H(h,j,e+2)&&H(h,j,e+3)&&H(h,j,e+4)&&!H(h,j,e+5)&&H(h,j,e+6))&&(m+=40);for(e=0;e<k;e++)for(j=0;j<k-6;j++)H(h,
j,e)&&(!H(h,j+1,e)&&H(h,j+2,e)&&H(h,j+3,e)&&H(h,j+4,e)&&!H(h,j+5,e)&&H(h,j+6,e))&&(m+=40);for(e=r=0;e<k;e++)for(j=0;j<k;j++)H(h,j,e)&&r++;h=m+=10*(Math.abs(100*r/k/k-50)/5);if(0==i||g>h)g=h,l=i}G(c,o,l);g="<table style='margin: 0px; padding: 3px; width: 80px; height: 80px; border: 0px; border-collapse: collapse; background-color: #fff'>";for(l=0;l<c.a;++l){g+="<tr style='height: 1px;'>";for(i=0;i<c.a;++i)g+="<td"+(H(c,l,i)?" style='background-color: #000;'></td>":"></td>");g+="</tr>"}d.innerHTML=
g;t[f].e=b.proxy+"?ident="+b.ident+"&token="+b.token;z(t[f].e)};SeQRentry.proxyTimeout=function(a,b){console.log("SeQRentry.proxyTimeout",a,b);z(t[b.ident].e)};SeQRentry.proxyDeleted=SeQRentry.proxyNotFound=SeQRentry.proxyInUse=function(a,b){console.log("SeQRentry.proxyDeleted/proxyNotFound/proxyInUse",a,b);y(b.ident)};
SeQRentry.proxyResponse=function(a,b){console.log("SeQRentry.proxyResponse",a,b);var f=b.ident;t[f].i.innerHTML="<img src='../SeQRentry-logo-64.png' style='width: 100%;' />";t[f].href=n;t[f].e=n};SeQRentry.install=function(){var a=document.getElementsByTagName("*"),b,f=/^(register|change|login)$/;for(b=0;b<a.length;++b)f.test(a[b].getAttribute(s))&&x(a[b])};function C(a){this.mode=I;this.data=a}
C.prototype={c:function(){return this.data.length},write:function(a){for(var b=0;b<this.data.length;b++)a.put(this.data.charCodeAt(b),8)}};function A(a,b){this.d=a;this.j=b;this.b=n;this.a=0;this.f=n;this.g=[]}A.prototype={};function J(a,b,f){for(var d=-1;7>=d;d++)if(!(-1>=b+d||a.a<=b+d))for(var c=-1;7>=c;c++)-1>=f+c||a.a<=f+c||(a.b[b+d][f+c]=0<=d&&6>=d&&(0==c||6==c)||0<=c&&6>=c&&(0==d||6==d)||2<=d&&4>=d&&2<=c&&4>=c?!0:o)}
function G(a,b,f){a.a=4*a.d+17;a.b=Array(a.a);for(var d=0;d<a.a;d++){a.b[d]=Array(a.a);for(var c=0;c<a.a;c++)a.b[d][c]=n}J(a,0,0);J(a,a.a-7,0);J(a,0,a.a-7);d=K[a.d-1];for(c=0;c<d.length;c++)for(var g=0;g<d.length;g++){var k=d[c],l=d[g];if(a.b[k][l]==n)for(var i=-2;2>=i;i++)for(var h=-2;2>=h;h++)a.b[k+i][l+h]=-2==i||2==i||-2==h||2==h||0==i&&0==h?!0:o}for(d=8;d<a.a-8;d++)a.b[d][6]==n&&(a.b[d][6]=0==d%2);for(d=8;d<a.a-8;d++)a.b[6][d]==n&&(a.b[6][d]=0==d%2);d=a.j<<3|f;for(c=d<<10;0<=L(c)-L(1335);)c^=
1335<<L(c)-L(1335);d=(d<<10|c)^21522;for(c=0;15>c;c++)g=!b&&1==(d>>c&1),6>c?a.b[c][8]=g:8>c?a.b[c+1][8]=g:a.b[a.a-15+c][8]=g;for(c=0;15>c;c++)g=!b&&1==(d>>c&1),8>c?a.b[8][a.a-c-1]=g:9>c?a.b[8][15-c-1+1]=g:a.b[8][15-c-1]=g;a.b[a.a-8][8]=!b;if(7<=a.d){d=a.d;for(c=d<<12;0<=L(c)-L(7973);)c^=7973<<L(c)-L(7973);d=d<<12|c;for(c=0;18>c;c++)g=!b&&1==(d>>c&1),a.b[Math.floor(c/3)][c%3+a.a-8-3]=g;for(c=0;18>c;c++)g=!b&&1==(d>>c&1),a.b[c%3+a.a-8-3][Math.floor(c/3)]=g}if(a.f==n){g=a.d;k=a.g;b=D(g,a.j);d=new E;
for(c=0;c<k.length;c++)l=k[c],d.put(l.mode,4),d.put(l.c(),F(l.mode,g)),l.write(d);for(c=g=0;c<b.length;c++)g+=b[c].h;if(d.length>8*g)throw Error("code length overflow. ("+d.length+">"+8*g+")");for(d.length+4<=8*g&&d.put(0,4);0!=d.length%8;)M(d,o);for(;!(d.length>=8*g);){d.put(236,8);if(d.length>=8*g)break;d.put(17,8)}g=c=h=0;k=Array(b.length);l=Array(b.length);for(i=0;i<b.length;i++){var m=b[i].h,j=b[i].l-m,c=Math.max(c,m),g=Math.max(g,j);k[i]=Array(m);for(var e=0;e<k[i].length;e++)k[i][e]=255&d.buffer[e+
h];h+=m;e=j;m=new N([1],0);for(j=0;j<e;j++)m=m.multiply(new N([1,O(j)],0));e=m;m=P(new N(k[i],e.c()-1),e);l[i]=Array(e.c()-1);for(e=0;e<l[i].length;e++)j=e+m.c()-l[i].length,l[i][e]=0<=j?m.get(j):0}for(e=d=0;e<b.length;e++)d+=b[e].l;d=Array(d);for(e=h=0;e<c;e++)for(i=0;i<b.length;i++)e<k[i].length&&(d[h++]=k[i][e]);for(e=0;e<g;e++)for(i=0;i<b.length;i++)e<l[i].length&&(d[h++]=l[i][e]);a.f=d}b=a.f;d=-1;c=a.a-1;g=7;k=0;for(l=a.a-1;0<l;l-=2)for(6==l&&l--;;){for(i=0;2>i;i++)a.b[c][l-i]==n&&(h=o,k<b.length&&
(h=1==(b[k]>>>g&1)),Q(f,c,l-i)&&(h=!h),a.b[c][l-i]=h,g--,-1==g&&(k++,g=7));c+=d;if(0>c||a.a<=c){c-=d;d=-d;break}}}function H(a,b,f){if(0>b||a.a<=b||0>f||a.a<=f)throw Error(b+","+f);return a.b[b][f]}
var I=4,B=1,K=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],
[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]];function L(a){for(var b=0;0!=a;)b++,a>>>=1;return b}function Q(a,b,f){switch(a){case 0:return 0==(b+f)%2;case 1:return 0==b%2;case 2:return 0==f%3;case 3:return 0==(b+f)%3;case 4:return 0==(Math.floor(b/2)+Math.floor(f/3))%2;case 5:return 0==b*f%2+b*f%3;case 6:return 0==(b*f%2+b*f%3)%2;case 7:return 0==(b*f%3+(b+f)%2)%2;default:throw Error("bad maskPattern:"+a);}}
function F(a,b){if(1<=b&&10>b)switch(a){case 1:return 10;case 2:return 9;case I:return 8;case 8:return 8;default:throw Error("mode:"+a);}else if(27>b)switch(a){case 1:return 12;case 2:return 11;case I:return 16;case 8:return 10;default:throw Error("mode:"+a);}else if(41>b)switch(a){case 1:return 14;case 2:return 13;case I:return 16;case 8:return 12;default:throw Error("mode:"+a);}else throw Error("type:"+b);}function R(a){if(1>a)throw Error("glog("+a+")");return S[a]}
function O(a){for(;0>a;)a+=255;for(;256<=a;)a-=255;return T[a]}for(var T=Array(256),S=Array(256),V=0;8>V;V++)T[V]=1<<V;for(V=8;256>V;V++)T[V]=T[V-4]^T[V-5]^T[V-6]^T[V-8];for(V=0;255>V;V++)S[T[V]]=V;function N(a,b){if(void 0==a.length)throw Error(a.length+"/"+b);for(var f=0;f<a.length&&0==a[f];)f++;this.k=Array(a.length-f+b);for(var d=0;d<a.length-f;d++)this.k[d]=a[d+f]}
N.prototype={get:function(a){return this.k[a]},c:function(){return this.k.length},multiply:function(a){for(var b=Array(this.c()+a.c()-1),f=0;f<this.c();f++)for(var d=0;d<a.c();d++)b[f+d]^=O(R(this.get(f))+R(a.get(d)));return new N(b,0)}};function P(a,b){if(0>a.c()-b.c())return a;for(var f=R(a.get(0))-R(b.get(0)),d=Array(a.c()),c=0;c<a.c();c++)d[c]=a.get(c);for(c=0;c<b.c();c++)d[c]^=O(R(b.get(c))+f);return P(new N(d,0),b)}function W(a,b){this.l=a;this.h=b}
var X=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,
20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,
51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,
73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,
54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,
45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]];
function D(a,b){var f=Y(a,b);if(void 0==f)throw Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=f.length/3,c=[],g=0;g<d;g++)for(var k=f[3*g+0],l=f[3*g+1],i=f[3*g+2],h=0;h<k;h++)c.push(new W(l,i));return c}function Y(a,b){switch(b){case B:return X[4*(a-1)+0];case 0:return X[4*(a-1)+1];case 3:return X[4*(a-1)+2];case 2:return X[4*(a-1)+3]}}function E(){this.buffer=[];this.length=0}
E.prototype={get:function(a){return 1==(this.buffer[Math.floor(a/8)]>>>7-a%8&1)},put:function(a,b){for(var f=0;f<b;f++)M(this,1==(a>>>b-f-1&1))}};function M(a,b){var f=Math.floor(a.length/8);a.buffer.length<=f&&a.buffer.push(0);b&&(a.buffer[f]|=128>>>a.length%8);a.length++};
})();
