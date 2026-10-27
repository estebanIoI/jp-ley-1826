(function(){
  'use strict';
  var root=document.querySelector('[data-ova]');if(!root)return;
  if(window.Personajes){var P=window.Personajes,C=P.C;
    var court='<path d="M20 86 89 54l69 32" fill="none" stroke="'+C.teal+'" stroke-width="7" stroke-linejoin="round"/>'+
      '<path d="M30 87h119v9H30zm8 12h14v73H38zm31 0h14v73H69zm31 0h14v73h-14zm31 0h14v73h-14zM24 173h131v9H24z" fill="'+C.niebla+'"/>';
    var paper='<rect x="30" y="59" width="107" height="121" rx="6" fill="'+C.niebla+'"/>'+
      '<path d="M49 90h69M49 108h69M49 126h48" stroke="'+C.marino+'" stroke-width="6" stroke-linecap="round"/>'+
      '<path d="m112 154 15 15 28-34" fill="none" stroke="'+C.oxido+'" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
    root.querySelector('[data-paso-figura=audiencia]').innerHTML=court+P.persona({x:205,y:210,s:.61,pose:'pie',peinado:'corto',camisa:C.blanco,chaqueta:C.teal});
    root.querySelector('[data-paso-figura=escrito]').innerHTML=paper+P.persona({x:204,y:210,s:.61,pose:'entrega',peinado:'cola',camisa:C.blanco,chaqueta:C.celeste,prop:'documento'});
  }
  var steps=[].slice.call(root.querySelectorAll('.paso'));
  steps.forEach(function(button){button.addEventListener('click',function(){
    steps.forEach(function(other){var open=other===button;other.setAttribute('aria-expanded',String(open));document.getElementById(other.dataset.panel).hidden=!open});
    if(!button.querySelector('.fa-circle-check'))button.insertAdjacentHTML('beforeend','<i class="fas fa-circle-check" aria-hidden="true"></i>');
  })});
  steps[0].click();
  var tabs=[].slice.call(root.querySelectorAll('[role=tab]'));
  function progress(){var count=tabs.filter(function(t){return t.dataset.seen==='true'}).length;
    root.querySelector('#vistas').textContent=count+' de '+tabs.length;
    var bar=root.querySelector('.tabla-avance');bar.setAttribute('aria-valuenow',String(count));bar.firstElementChild.style.width=(count/tabs.length*100)+'%';}
  tabs.forEach(function(t){t.addEventListener('click',function(){t.dataset.seen='true';progress()})});
  tabs[0].dataset.seen='true';progress();
  var quiz=root.querySelector('.quiz-red'), cards=[].slice.call(quiz.querySelectorAll('.q-card'));
  var score=quiz.querySelector('#q-score');
  cards.forEach(function(card){[].forEach.call(card.querySelectorAll('[data-choice]'),function(button){
    button.addEventListener('click',function(){var answer=button.dataset.choice,correct=answer===card.dataset.answer;
      [].forEach.call(card.querySelectorAll('[data-choice]'),function(b){b.setAttribute('aria-pressed',String(b===button))});
      card.classList.toggle('correct',correct);card.classList.toggle('incorrect',!correct);
      var fb=card.querySelector('.q-feedback');fb.hidden=false;
      fb.innerHTML='<i class="fas '+(correct?'fa-circle-check':'fa-triangle-exclamation')+'" aria-hidden="true"></i> '+
        (correct?'Correcto. ':'Revisa la tabla. ')+(card.dataset.answer==='ordinario'?'Procedimiento ordinario (Ley 906 de 2004).':'Procedimiento especial abreviado (Ley 1826 de 2017).');
      score.textContent='Aciertos: '+cards.filter(function(c){return c.classList.contains('correct')}).length+' de '+cards.length;
    });
  })});
  quiz.querySelector('#q-reset').addEventListener('click',function(){cards.forEach(function(card){card.classList.remove('correct','incorrect');card.querySelector('.q-feedback').hidden=true;[].forEach.call(card.querySelectorAll('[data-choice]'),function(b){b.setAttribute('aria-pressed','false')})});score.textContent='Aciertos: 0 de '+cards.length;cards[0].querySelector('button').focus()});
})();
