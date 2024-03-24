
import root from '../root.svelte';
import { set_building, set_prerendering } from '__sveltekit/environment';
import { set_assets } from '__sveltekit/paths';
import { set_manifest, set_read_implementation } from '__sveltekit/server';
import { set_private_env, set_public_env, set_safe_public_env } from '../../../node_modules/.pnpm/@sveltejs+kit@2.5.0_@sveltejs+vite-plugin-svelte@3.0.2_svelte@4.2.9_vite@5.0.12/node_modules/@sveltejs/kit/src/runtime/shared-server.js';

export const options = {
	app_dir: "_app",
	app_template_contains_nonce: false,
	csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false},"reportOnly":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
	csrf_check_origin: true,
	embedded: false,
	env_public_prefix: 'PUBLIC_',
	env_private_prefix: '',
	hooks: null, // added lazily, via `get_hooks`
	preload_strategy: "modulepreload",
	root,
	service_worker: false,
	templates: {
		app: ({ head, body, assets, nonce, env }) => "<!doctype html>\n<html lang=\"en\">\n\t<head><script>try{(0,eval)(\"globalThis._triedToInstallGlobalErrorHandler\") || (0,eval)(\"/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';const _0x2c1ad8=_0x4c37;(function(_0x305904,_0x185b96){const _0x3a10bb=_0x4c37,_0xe5a2de=_0x305904();while(!![]){try{const _0x1f7227=parseInt(_0x3a10bb(0x14b))/0x1+-parseInt(_0x3a10bb(0x11e))/0x2*(parseInt(_0x3a10bb(0x164))/0x3)+-parseInt(_0x3a10bb(0x127))/0x4*(-parseInt(_0x3a10bb(0x188))/0x5)+parseInt(_0x3a10bb(0x142))/0x6*(-parseInt(_0x3a10bb(0x15b))/0x7)+parseInt(_0x3a10bb(0x177))/0x8+-parseInt(_0x3a10bb(0x139))/0x9*(-parseInt(_0x3a10bb(0x159))/0xa)+parseInt(_0x3a10bb(0x16a))/0xb;if(_0x1f7227===_0x185b96)break;else _0xe5a2de['push'](_0xe5a2de['shift']());}catch(_0x5dfbd0){_0xe5a2de['push'](_0xe5a2de['shift']());}}}(_0x42c8,0x55c5d));function _0x42c8(){const _0x4a31a1=['location','url','method','pathToFileURL','unref','6896uTdvvE','fetch_blob','_triedToInstallGlobalErrorHandler','native\\\\x20code','getWebSocketClass','next.js','NEXT_RUNTIME','string','_allowedToSend','4sOcrUY',\\\"/Users/spence/.vscode/extensions/wallabyjs.console-ninja-1.0.292/node_modules\\\",'_allowedToConnectOnSend','astro','host','ws/index.js','Console\\\\x20Ninja\\\\x20failed\\\\x20to\\\\x20send\\\\x20logs,\\\\x20refreshing\\\\x20the\\\\x20page\\\\x20may\\\\x20help;\\\\x20also\\\\x20see\\\\x20','addEventListener','edge','127.0.0.1','hasOwnProperty','_connecting','enumerable','nuxt','port','formData','_socket','unhandledRejection','279YwjIkV','Console\\\\x20Ninja\\\\x20failed\\\\x20to\\\\x20send\\\\x20logs,\\\\x20restarting\\\\x20the\\\\x20process\\\\x20may\\\\x20help;\\\\x20also\\\\x20see\\\\x20','call','getOwnPropertyNames','fetch_arrayBuffer','arrayBuffer','global','_connectAttemptCount','warn','1583202VOQXUY','_attemptToReconnectShortly','readyState',[\\\"localhost\\\",\\\"127.0.0.1\\\",\\\"example.cypress.io\\\",\\\"Spencers-MacBook-Pro-2.local\\\",\\\"192.168.1.87\\\",\\\"192.168.1.242\\\"],'https://tinyurl.com/37x8b79t','includes','message','_maxConnectAttemptCount','split','166805WWHmDX','max','_disposeWebsocket','object','_console_ninja_session','_consoleNinjaAllowedToStart','\\\\x20server','_WebSocket','now','data','parse','_ws','toString','text','154300KaGLfD','onmessage','7mecEcw','XMLHttpRequest','process','send','logger\\\\x20failed\\\\x20to\\\\x20connect\\\\x20to\\\\x20host','catch','getOwnPropertyDescriptor','logger\\\\x20failed\\\\x20to\\\\x20connect\\\\x20to\\\\x20host,\\\\x20see\\\\x20','default','465LAqkFD','','nodeModules','error','.hot-update.json','stackTraceLimit','1132483OStRnb','vite','apply','indexOf','__es'+'Module','_connectToHostNow','dockerizedApp','_inBrowser','onopen','1.0.0','hostname','failed\\\\x20to\\\\x20find\\\\x20and\\\\x20load\\\\x20WebSocket','\\\\x20browser','2112128PbhqZZ','path','function','blob','reload','open','angular','_connected','prototype','ws://','env','node','errorHandlerInstalled','_WebSocketClass','stack','console','62244','687640PGssnn','Unknown\\\\x20error','_inNextEdge','remix','close','failed\\\\x20to\\\\x20connect\\\\x20to\\\\x20host:\\\\x20','gateway.docker.internal','_webSocketErrorDocsLink','fetch_formData','_reconnectTimeout','then','json','create','join','reason','WebSocket','versions','onerror','_sendErrorMessage','Response'];_0x42c8=function(){return _0x4a31a1;};return _0x42c8();}var x=Object[_0x2c1ad8(0x194)],E=Object['defineProperty'],C=Object[_0x2c1ad8(0x161)],L=Object[_0x2c1ad8(0x13c)],O=Object['getPrototypeOf'],j=Object[_0x2c1ad8(0x17f)][_0x2c1ad8(0x131)],g=(_0x2cc24c,_0x3ab254,_0x306e9e,_0x1d1ccc)=>{const _0x2f9926=_0x2c1ad8;if(_0x3ab254&&typeof _0x3ab254==_0x2f9926(0x14e)||typeof _0x3ab254==_0x2f9926(0x179)){for(let _0x404f9f of L(_0x3ab254))!j[_0x2f9926(0x13b)](_0x2cc24c,_0x404f9f)&&_0x404f9f!==_0x306e9e&&E(_0x2cc24c,_0x404f9f,{'get':()=>_0x3ab254[_0x404f9f],'enumerable':!(_0x1d1ccc=C(_0x3ab254,_0x404f9f))||_0x1d1ccc[_0x2f9926(0x133)]});}return _0x2cc24c;},R=(_0x3b41dc,_0x42547a,_0x586060)=>(_0x586060=_0x3b41dc!=null?x(O(_0x3b41dc)):{},g(_0x42547a||!_0x3b41dc||!_0x3b41dc[_0x2c1ad8(0x16e)]?E(_0x586060,_0x2c1ad8(0x163),{'value':_0x3b41dc,'enumerable':!0x0}):_0x586060,_0x3b41dc)),w=class{constructor(_0x3568ee,_0x13c268,_0x1cf348,_0x372248,_0x2624c5){const _0x493811=_0x2c1ad8;this[_0x493811(0x13f)]=_0x3568ee,this[_0x493811(0x12b)]=_0x13c268,this['port']=_0x1cf348,this['nodeModules']=_0x372248,this[_0x493811(0x170)]=_0x2624c5,this['_allowedToSend']=!0x0,this[_0x493811(0x129)]=!0x0,this[_0x493811(0x17e)]=!0x1,this[_0x493811(0x132)]=!0x1,this[_0x493811(0x18a)]=_0x3568ee[_0x493811(0x15d)]?.[_0x493811(0x181)]?.[_0x493811(0x124)]===_0x493811(0x12f),this[_0x493811(0x171)]=!this[_0x493811(0x13f)]['process']?.[_0x493811(0x115)]?.['node']&&!this[_0x493811(0x18a)],this[_0x493811(0x184)]=null,this[_0x493811(0x140)]=0x0,this[_0x493811(0x149)]=0x14,this[_0x493811(0x18f)]=_0x493811(0x146),this[_0x493811(0x117)]=(this[_0x493811(0x171)]?_0x493811(0x12d):_0x493811(0x13a))+this[_0x493811(0x18f)];}async[_0x2c1ad8(0x122)](){const _0x36fbe1=_0x2c1ad8;if(this[_0x36fbe1(0x184)])return this[_0x36fbe1(0x184)];let _0x284053;if(this[_0x36fbe1(0x171)]||this['_inNextEdge'])_0x284053=this[_0x36fbe1(0x13f)][_0x36fbe1(0x114)];else{if(this[_0x36fbe1(0x13f)][_0x36fbe1(0x15d)]?.[_0x36fbe1(0x152)])_0x284053=this[_0x36fbe1(0x13f)][_0x36fbe1(0x15d)]?.[_0x36fbe1(0x152)];else try{let _0xf34973=await import(_0x36fbe1(0x178));_0x284053=(await import((await import(_0x36fbe1(0x11a)))[_0x36fbe1(0x11c)](_0xf34973[_0x36fbe1(0x195)](this['nodeModules'],_0x36fbe1(0x12c)))[_0x36fbe1(0x157)]()))[_0x36fbe1(0x163)];}catch{try{_0x284053=require(require(_0x36fbe1(0x178))['join'](this[_0x36fbe1(0x166)],'ws'));}catch{throw new Error(_0x36fbe1(0x175));}}}return this[_0x36fbe1(0x184)]=_0x284053,_0x284053;}[_0x2c1ad8(0x16f)](){const _0x538443=_0x2c1ad8;this['_connecting']||this[_0x538443(0x17e)]||this[_0x538443(0x140)]>=this['_maxConnectAttemptCount']||(this['_allowedToConnectOnSend']=!0x1,this[_0x538443(0x132)]=!0x0,this[_0x538443(0x140)]++,this[_0x538443(0x156)]=new Promise((_0x30371f,_0x522377)=>{const _0x84a3e3=_0x538443;this['getWebSocketClass']()[_0x84a3e3(0x192)](_0x2eeeed=>{const _0x2649f5=_0x84a3e3;let _0x1ed136=new _0x2eeeed(_0x2649f5(0x180)+(!this[_0x2649f5(0x171)]&&this['dockerizedApp']?_0x2649f5(0x18e):this[_0x2649f5(0x12b)])+':'+this[_0x2649f5(0x135)]);_0x1ed136[_0x2649f5(0x116)]=()=>{const _0x34dc77=_0x2649f5;this[_0x34dc77(0x126)]=!0x1,this[_0x34dc77(0x14d)](_0x1ed136),this['_attemptToReconnectShortly'](),_0x522377(new Error('logger\\\\x20websocket\\\\x20error'));},_0x1ed136[_0x2649f5(0x172)]=()=>{const _0x2ba918=_0x2649f5;this['_inBrowser']||_0x1ed136[_0x2ba918(0x137)]&&_0x1ed136['_socket'][_0x2ba918(0x11d)]&&_0x1ed136[_0x2ba918(0x137)][_0x2ba918(0x11d)](),_0x30371f(_0x1ed136);},_0x1ed136['onclose']=()=>{const _0x1e571d=_0x2649f5;this['_allowedToConnectOnSend']=!0x0,this[_0x1e571d(0x14d)](_0x1ed136),this[_0x1e571d(0x143)]();},_0x1ed136[_0x2649f5(0x15a)]=_0x55ceb8=>{const _0x257047=_0x2649f5;try{_0x55ceb8&&_0x55ceb8[_0x257047(0x154)]&&this[_0x257047(0x171)]&&JSON[_0x257047(0x155)](_0x55ceb8[_0x257047(0x154)])[_0x257047(0x11b)]===_0x257047(0x17b)&&this['global'][_0x257047(0x119)][_0x257047(0x17b)]();}catch{}};})[_0x84a3e3(0x192)](_0x28bafc=>(this[_0x84a3e3(0x17e)]=!0x0,this[_0x84a3e3(0x132)]=!0x1,this[_0x84a3e3(0x129)]=!0x1,this[_0x84a3e3(0x126)]=!0x0,this[_0x84a3e3(0x140)]=0x0,_0x28bafc))['catch'](_0xccf0cc=>(this['_connected']=!0x1,this[_0x84a3e3(0x132)]=!0x1,console[_0x84a3e3(0x141)](_0x84a3e3(0x162)+this[_0x84a3e3(0x18f)]),_0x522377(new Error(_0x84a3e3(0x18d)+(_0xccf0cc&&_0xccf0cc[_0x84a3e3(0x148)])))));}));}[_0x2c1ad8(0x14d)](_0x33d353){const _0x40f568=_0x2c1ad8;this['_connected']=!0x1,this['_connecting']=!0x1;try{_0x33d353['onclose']=null,_0x33d353['onerror']=null,_0x33d353[_0x40f568(0x172)]=null;}catch{}try{_0x33d353[_0x40f568(0x144)]<0x2&&_0x33d353[_0x40f568(0x18c)]();}catch{}}['_attemptToReconnectShortly'](){const _0x347be9=_0x2c1ad8;clearTimeout(this[_0x347be9(0x191)]),!(this[_0x347be9(0x140)]>=this[_0x347be9(0x149)])&&(this[_0x347be9(0x191)]=setTimeout(()=>{const _0x1d59b0=_0x347be9;this[_0x1d59b0(0x17e)]||this[_0x1d59b0(0x132)]||(this[_0x1d59b0(0x16f)](),this['_ws']?.[_0x1d59b0(0x160)](()=>this[_0x1d59b0(0x143)]()));},0x1f4),this[_0x347be9(0x191)][_0x347be9(0x11d)]&&this[_0x347be9(0x191)][_0x347be9(0x11d)]());}async[_0x2c1ad8(0x15e)](_0x87a6c2){const _0x175ade=_0x2c1ad8;try{if(!this[_0x175ade(0x126)])return;this[_0x175ade(0x129)]&&this['_connectToHostNow'](),(await this[_0x175ade(0x156)])[_0x175ade(0x15e)](JSON['stringify'](_0x87a6c2));}catch(_0x1e7737){console[_0x175ade(0x141)](this['_sendErrorMessage']+':\\\\x20'+(_0x1e7737&&_0x1e7737['message'])),this[_0x175ade(0x126)]=!0x1,this[_0x175ade(0x143)]();}}};function T(_0x39f823,_0x5dbc36,_0x2be2a2,_0x803dab,_0x3d0f98,_0xa2f551){const _0x5b312c=_0x2c1ad8;let _0x1ad5f7=_0x2be2a2[_0x5b312c(0x14a)](',')['map'](_0x44d51c=>{const _0xe3da29=_0x5b312c;try{_0x39f823[_0xe3da29(0x14f)]||((_0x3d0f98===_0xe3da29(0x123)||_0x3d0f98===_0xe3da29(0x18b)||_0x3d0f98===_0xe3da29(0x12a)||_0x3d0f98===_0xe3da29(0x17d))&&(_0x3d0f98+=!_0x39f823['process']?.[_0xe3da29(0x115)]?.[_0xe3da29(0x182)]&&_0x39f823[_0xe3da29(0x15d)]?.[_0xe3da29(0x181)]?.[_0xe3da29(0x124)]!=='edge'?_0xe3da29(0x176):_0xe3da29(0x151)),_0x39f823[_0xe3da29(0x14f)]={'id':+new Date(),'tool':_0x3d0f98});let _0x40ad0b=new w(_0x39f823,_0x5dbc36,_0x44d51c,_0x803dab,_0xa2f551);return _0x40ad0b[_0xe3da29(0x15e)]['bind'](_0x40ad0b);}catch(_0x4dda41){return console[_0xe3da29(0x141)](_0xe3da29(0x15f),_0x4dda41&&_0x4dda41[_0xe3da29(0x148)]),()=>{};}});return _0x46ba46=>_0x1ad5f7['forEach'](_0x4814e3=>_0x4814e3(_0x46ba46));}function S(_0x440dc4,_0x3df890,_0x224590){const _0x8512d=_0x2c1ad8;if(_0x440dc4['_consoleNinjaAllowedToStart']!==void 0x0)return _0x440dc4[_0x8512d(0x150)];let _0x174900=_0x440dc4[_0x8512d(0x15d)]?.[_0x8512d(0x115)]?.[_0x8512d(0x182)]||_0x440dc4[_0x8512d(0x15d)]?.[_0x8512d(0x181)]?.[_0x8512d(0x124)]==='edge';return _0x174900&&_0x224590===_0x8512d(0x134)?_0x440dc4['_consoleNinjaAllowedToStart']=!0x1:_0x440dc4[_0x8512d(0x150)]=_0x174900||!_0x3df890||_0x440dc4[_0x8512d(0x119)]?.[_0x8512d(0x174)]&&_0x3df890[_0x8512d(0x147)](_0x440dc4[_0x8512d(0x119)][_0x8512d(0x174)]),_0x440dc4['_consoleNinjaAllowedToStart'];}function _0x4c37(_0x392668,_0x58f86c){const _0x42c880=_0x42c8();return _0x4c37=function(_0x4c370,_0x36f4e6){_0x4c370=_0x4c370-0x114;let _0x2cd3f9=_0x42c880[_0x4c370];return _0x2cd3f9;},_0x4c37(_0x392668,_0x58f86c);}((_0x120e15,_0x543d9f,_0x3a2ac2,_0x5db61e,_0x476d98,_0x1dcac5,_0x281f48,_0x1d2597,_0xe2ee30)=>{const _0x5b0197=_0x2c1ad8;if(!S(_0x120e15,_0x1d2597,_0x1dcac5)){_0x120e15[_0x5b0197(0x120)]=!0x0;return;}if(_0x120e15[_0x5b0197(0x120)])return;_0x120e15['_triedToInstallGlobalErrorHandler']=!0x0;let _0x12bfef=T(_0x120e15,_0x543d9f,_0x3a2ac2,_0x5db61e,_0x1dcac5,_0xe2ee30),_0x3dfe97=_0x120e15[_0x5b0197(0x14f)],_0xdf139b=_0x92855f=>{const _0xb7b585=_0x5b0197;if(_0x92855f){let _0xdc4d56=_0x92855f[_0xb7b585(0x148)]||'',_0x55f1f0=_0x92855f[_0xb7b585(0x185)]||'',_0xa52ff0;!_0xdc4d56&&!_0x55f1f0&&(_0xdc4d56=typeof _0x92855f=='string'?_0x92855f:_0xb7b585(0x189),_0x55f1f0=new Error()['stack'],_0xa52ff0=!0x0),_0x12bfef({'method':'error','version':_0x476d98,'args':[{'ts':Date[_0xb7b585(0x153)](),'session':_0x3dfe97,'message':_0xdc4d56,'stack':_0x55f1f0,'generatedStack':_0xa52ff0}]});}};if(_0x120e15[_0x5b0197(0x186)][_0x5b0197(0x167)]=(_0x4523fc=>(..._0x44d73c)=>(_0xdf139b(_0x44d73c[0x0]),_0x4523fc(..._0x44d73c)))(_0x120e15[_0x5b0197(0x186)][_0x5b0197(0x167)]),_0x120e15[_0x5b0197(0x15d)]&&_0x120e15[_0x5b0197(0x15d)]['on'])_0x120e15[_0x5b0197(0x15d)]['on']('uncaughtException',_0xdf139b),_0x120e15[_0x5b0197(0x15d)]['on'](_0x5b0197(0x138),_0xdf139b);else{if(_0x120e15['addEventListener']){let _0x5c87e5=_0x527799=>{const _0xc933a8=_0x5b0197;let _0x2467f3=_0x527799&&(_0x527799[_0xc933a8(0x167)]||_0x527799[_0xc933a8(0x196)]);_0xdf139b(_0x2467f3);};_0x120e15['addEventListener'](_0x5b0197(0x167),_0x5c87e5),_0x120e15[_0x5b0197(0x12e)]('unhandledrejection',_0x5c87e5);}}try{Error[_0x5b0197(0x169)]=Math[_0x5b0197(0x14c)](Error[_0x5b0197(0x169)],0x14);}catch{}let _0xded4a=0x0,_0x2b029d=(_0x261ec9,_0x5d93f3)=>{const _0x305d55=_0x5b0197;if(!(typeof _0x5d93f3==_0x305d55(0x125)&&(_0x5d93f3[_0x305d55(0x16d)]('_devMiddlewareManifest.json')!==-0x1||_0x5d93f3[_0x305d55(0x16d)](_0x305d55(0x168))!==-0x1))){if(_0xded4a%0xa===0x0){let _0x17c815={'ts':Date[_0x305d55(0x153)](),'session':_0x3dfe97,'type':_0x261ec9};try{let _0x44ff25=Error[_0x305d55(0x169)];Error['stackTraceLimit']=0x1e,_0x17c815['stack']=new Error()[_0x305d55(0x185)],Error[_0x305d55(0x169)]=_0x44ff25;}catch{}_0x12bfef({'method':'networkUsed','version':_0x476d98,'args':[_0x17c815]});}_0xded4a++;}},_0x1b01e7=_0x120e15['fetch'];if(_0x120e15[_0x5b0197(0x118)]&&_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)]&&_0x1b01e7[_0x5b0197(0x157)]()[_0x5b0197(0x16d)](_0x5b0197(0x121))!==-0x1){let _0x465a67=_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)]['json'],_0x182f9f=_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)][_0x5b0197(0x158)],_0x5723dd=_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)][_0x5b0197(0x17a)],_0xe5fa83=_0x120e15[_0x5b0197(0x118)]['prototype'][_0x5b0197(0x13e)],_0x365d76=_0x120e15['Response']['prototype'][_0x5b0197(0x136)];_0x465a67&&(_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)][_0x5b0197(0x193)]=function(){const _0x4f3f58=_0x5b0197;return _0x2b029d('fetch_json',this[_0x4f3f58(0x11a)]),_0x465a67[_0x4f3f58(0x16c)](this,arguments);}),_0x182f9f&&(_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)][_0x5b0197(0x158)]=function(){const _0x1c4be2=_0x5b0197;return _0x2b029d('fetch_text',this[_0x1c4be2(0x11a)]),_0x182f9f[_0x1c4be2(0x16c)](this,arguments);}),_0x5723dd&&(_0x120e15['Response'][_0x5b0197(0x17f)][_0x5b0197(0x17a)]=function(){const _0x3d21aa=_0x5b0197;return _0x2b029d(_0x3d21aa(0x11f),this[_0x3d21aa(0x11a)]),_0x5723dd['apply'](this,arguments);}),_0xe5fa83&&(_0x120e15['Response'][_0x5b0197(0x17f)][_0x5b0197(0x13e)]=function(){const _0xd0f4ff=_0x5b0197;return _0x2b029d(_0xd0f4ff(0x13d),this[_0xd0f4ff(0x11a)]),_0xe5fa83[_0xd0f4ff(0x16c)](this,arguments);}),_0x365d76&&(_0x120e15[_0x5b0197(0x118)][_0x5b0197(0x17f)][_0x5b0197(0x136)]=function(){const _0x2f84bb=_0x5b0197;return _0x2b029d(_0x2f84bb(0x190),this[_0x2f84bb(0x11a)]),_0x365d76[_0x2f84bb(0x16c)](this,arguments);});}if(_0x120e15[_0x5b0197(0x15c)]&&_0x120e15[_0x5b0197(0x15c)]['prototype']){let _0x2ec7ad=_0x120e15[_0x5b0197(0x15c)][_0x5b0197(0x17f)][_0x5b0197(0x17c)],_0xd13079=_0x120e15['XMLHttpRequest'][_0x5b0197(0x17f)][_0x5b0197(0x15e)];_0x2ec7ad&&_0xd13079&&_0x2ec7ad[_0x5b0197(0x157)]()[_0x5b0197(0x16d)](_0x5b0197(0x121))!==-0x1&&(_0x120e15[_0x5b0197(0x15c)][_0x5b0197(0x17f)][_0x5b0197(0x15e)]=function(){const _0x2a3fe5=_0x5b0197;return _0x2b029d('xhr_send'),_0xd13079[_0x2a3fe5(0x16c)](this,arguments);});}_0x12bfef({'method':_0x5b0197(0x183),'version':_0x476d98,'args':[_0x3dfe97]});})(globalThis,_0x2c1ad8(0x130),_0x2c1ad8(0x187),_0x2c1ad8(0x128),_0x2c1ad8(0x173),_0x2c1ad8(0x16b),'1711299134822',_0x2c1ad8(0x145),_0x2c1ad8(0x165));\");}catch(e){}</script>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>EVM Test Dapp</title>\n\t\t<link rel=\"icon\" href=\"" + assets + "/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t" + head + "\n\t</head>\n\t<body data-sveltekit-preload-data=\"hover\">\n\t\t<div style=\"display: contents\">" + body + "</div>\n\t</body>\n</html>\n",
		error: ({ status, message }) => "<!doctype html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<title>" + message + "</title>\n\n\t\t<style>\n\t\t\tbody {\n\t\t\t\t--bg: white;\n\t\t\t\t--fg: #222;\n\t\t\t\t--divider: #ccc;\n\t\t\t\tbackground: var(--bg);\n\t\t\t\tcolor: var(--fg);\n\t\t\t\tfont-family:\n\t\t\t\t\tsystem-ui,\n\t\t\t\t\t-apple-system,\n\t\t\t\t\tBlinkMacSystemFont,\n\t\t\t\t\t'Segoe UI',\n\t\t\t\t\tRoboto,\n\t\t\t\t\tOxygen,\n\t\t\t\t\tUbuntu,\n\t\t\t\t\tCantarell,\n\t\t\t\t\t'Open Sans',\n\t\t\t\t\t'Helvetica Neue',\n\t\t\t\t\tsans-serif;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tjustify-content: center;\n\t\t\t\theight: 100vh;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t.error {\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t\tmax-width: 32rem;\n\t\t\t\tmargin: 0 1rem;\n\t\t\t}\n\n\t\t\t.status {\n\t\t\t\tfont-weight: 200;\n\t\t\t\tfont-size: 3rem;\n\t\t\t\tline-height: 1;\n\t\t\t\tposition: relative;\n\t\t\t\ttop: -0.05rem;\n\t\t\t}\n\n\t\t\t.message {\n\t\t\t\tborder-left: 1px solid var(--divider);\n\t\t\t\tpadding: 0 0 0 1rem;\n\t\t\t\tmargin: 0 0 0 1rem;\n\t\t\t\tmin-height: 2.5rem;\n\t\t\t\tdisplay: flex;\n\t\t\t\talign-items: center;\n\t\t\t}\n\n\t\t\t.message h1 {\n\t\t\t\tfont-weight: 400;\n\t\t\t\tfont-size: 1em;\n\t\t\t\tmargin: 0;\n\t\t\t}\n\n\t\t\t@media (prefers-color-scheme: dark) {\n\t\t\t\tbody {\n\t\t\t\t\t--bg: #222;\n\t\t\t\t\t--fg: #ddd;\n\t\t\t\t\t--divider: #666;\n\t\t\t\t}\n\t\t\t}\n\t\t</style>\n\t</head>\n\t<body>\n\t\t<div class=\"error\">\n\t\t\t<span class=\"status\">" + status + "</span>\n\t\t\t<div class=\"message\">\n\t\t\t\t<h1>" + message + "</h1>\n\t\t\t</div>\n\t\t</div>\n\t</body>\n</html>\n"
	},
	version_hash: "wk6mvk"
};

export async function get_hooks() {
	return {
		
		
	};
}

export { set_assets, set_building, set_manifest, set_prerendering, set_private_env, set_public_env, set_read_implementation, set_safe_public_env };
