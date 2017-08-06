function createTable(side){
  var tbody = document.getElementById("matrix");
  tbody.innerHTML = '';
  for (var row = 0; row < side; row++){
    var tr = document.createElement("tr");
    for (var col = 0; col < side; col++){
      tr.innerHTML += `<td id='x${row}x${col}'>
                        <div class='dot'></div>
                      </td>`
    }
    tbody.appendChild(tr);
    fadeInDots();
    // then remove animation class from dots
    setTimeout(function() {
      var dots = document.querySelectorAll('.dot');
      for(let i = 0; i < dots.length; i++) {
        dots[i].style.opacity = '1';
        dots[i].classList.remove('appear');
      }
    }, 2400);
  }
}

function fadeInDots() {
  var dots = document.querySelectorAll('.dot');
  for(let i = 0; i < dots.length; i++) {
    setTimeout(function() {
      dots[i].classList.add('appear');
    }, 100 + Math.random() * 1500);
  }
}

module.exports = createTable;
