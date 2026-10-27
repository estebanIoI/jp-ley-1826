(function(){
  'use strict';
  var root=document.querySelector('[data-ova]');if(!root)return;
  var scenes=[].slice.call(root.querySelectorAll('.escena'));
  var number=Number(new URLSearchParams(location.search).get('escena'));
  var fixed=Number.isInteger(number)&&number>0;
  var current=Math.min(Math.max(fixed?number-1:0,0),scenes.length-1);
  var nav=document.createElement('nav');nav.className='ova-nav';nav.setAttribute('aria-label','Escenas del apartado');
  nav.innerHTML='<button type="button" data-step="-1">← Anterior</button><span class="count"></span><button type="button" data-step="1">Siguiente →</button>';
  if(!fixed)root.appendChild(nav);
  var live=document.createElement('span');live.className='sr';live.setAttribute('aria-live','polite');root.appendChild(live);
  function show(index,focus){
    current=Math.min(Math.max(index,0),scenes.length-1);
    scenes.forEach(function(s,i){s.hidden=i!==current});
    nav.querySelector('[data-step="-1"]').disabled=current===0;
    nav.querySelector('[data-step="1"]').disabled=current===scenes.length-1;
    nav.querySelector('.count').textContent=(current+1)+' de '+scenes.length;
    live.textContent=(current+1)+' de '+scenes.length+': '+scenes[current].dataset.titulo;
    if(focus){var h=scenes[current].querySelector('h2');h.tabIndex=-1;h.focus({preventScroll:true})}
  }
  nav.addEventListener('click',function(event){var button=event.target.closest('[data-step]');if(button)show(current+Number(button.dataset.step),true)});
  root.addEventListener('click',function(event){
    var tab=event.target.closest('[role="tab"]');
    if(tab){
      var list=tab.closest('[role="tablist"]');
      [].forEach.call(list.querySelectorAll('[role="tab"]'),function(t){var active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active});
      tab.focus();
    }
    var opener=event.target.closest('[data-open]');if(opener){var dialog=document.getElementById(opener.dataset.open);dialog.showModal();dialog.querySelector('[data-close]').focus()}
    var close=event.target.closest('[data-close]');if(close)close.closest('dialog').close();
  });
  root.addEventListener('keydown',function(event){
    var tab=event.target.closest('[role="tab"]');if(!tab)return;
    var list=[].slice.call(tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
    var delta=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;
    if(delta){event.preventDefault();list[(list.indexOf(tab)+delta+list.length)%list.length].click()}
  });
  if(window.Personajes){
    var P=window.Personajes,C=P.C;
    function svg(kind){
      var s='<rect y="270" width="340" height="24" fill="'+C.niebla+'" opacity=".55"/>';
      if(kind==='people'){
        s+=P.persona({x:95,y:266,s:1.03,pose:'entrega',peinado:'cola',camisa:C.blanco,chaqueta:C.celeste,prop:'documento'})+P.persona({x:246,y:266,s:1.03,mira:-1,pose:'recibe',peinado:'corto',camisa:C.blanco,chaqueta:C.teal});
        s+=P.obj.hoja(164,133,1.2,-8);
      }else if(kind==='compare'){
        s+=P.obj.puerta(37,150,72,105,C.celeste)+P.obj.puerta(231,150,72,105,C.teal);
        s+=P.persona({x:170,y:265,s:.92,pose:'camina',peinado:'cola',camisa:C.blanco,chaqueta:C.marino,propAtras:'maletin'});
        s+='<path d="M110 105 H228" stroke="'+C.oxido+'" stroke-width="5" stroke-linecap="round"/><path d="M218 95 L231 105 L218 115" fill="none" stroke="'+C.oxido+'" stroke-width="5" stroke-linecap="round"/>';
      }else if(kind==='groups'){
        s+=P.obj.puerta(35,105,105,150,C.celeste)+P.obj.puerta(205,105,105,150,C.teal);
        s+=P.persona({x:89,y:264,s:.73,pose:'pie',peinado:'largo',camisa:C.coral})+P.persona({x:260,y:264,s:.73,pose:'pie',peinado:'corto',camisa:C.blanco,chaqueta:C.tealClaro});
      }else if(kind==='catalog'){
        s+=P.obj.carpetas(34,266,7)+P.obj.carpetas(103,266,5);
        s+=P.persona({x:248,y:266,s:.94,pose:'carga',peinado:'moño',camisa:C.blanco,chaqueta:C.teal,prop:'carpeta'});
      }else{
        s+=P.obj.hoja(56,73,2.2,-6)+P.persona({x:235,y:267,s:1.03,pose:'senala',peinado:'cola',camisa:C.blanco,chaqueta:C.teal});
      }
      return s;
    }
    [].forEach.call(root.querySelectorAll('svg[data-visual]'),function(el){el.innerHTML=svg(el.dataset.visual)});
  }
  show(current,false);
})();
