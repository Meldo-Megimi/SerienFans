// ==UserScript==
// @name         SF/FF Genre sort
// @namespace    https://github.com/Meldo-Megimi/SerienFans/raw/master/main.user.js
// @version      2024-08-03.01
// @description  Sort genre for SerienFans and FilmFans by year of release
// @author       Meldo-Megimi
// @match        https://serienfans.org/genre*
// @match        https://filmfans.org/genre*
// @grant        GM_addStyle
// ==/UserScript==

const getYear = (row) => {
  var element = row.querySelectorAll("small");
  if (element.length == 0) {
    return 1900;
  }

  return parseInt(element[0].innerText.slice(1,-1));
}

const getSortedList = () => {
  var rows = Array.from(document.querySelectorAll("div .list a"));
  rows.sort(function(a, b) {
    return getYear(b) - getYear(a);
  });
  return rows;
}

const sortList = () => {
  var rows = getSortedList();

  var leftColumn = document.querySelector("#listLeft");
  var rightColumn = document.querySelector("#listRight");
  var isLeft = true

  rows.forEach(row => {
    if (isLeft) {
      leftColumn.appendChild(row);
    } else {
      rightColumn.appendChild(row);
    }
    isLeft = !isLeft;
  });
}

const leftColumnObserver = new MutationObserver((mutationList, observer) => {
  observer.disconnect();
  sortList();
  observer.observe(document.getElementById("listLeft"), { attributes: false, childList: true, subtree: false });
});

leftColumnObserver.observe(document.getElementById("listLeft"), { attributes: false, childList: true, subtree: false });
