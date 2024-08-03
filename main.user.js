// ==UserScript==
// @name         SF/FF Genre sort
// @namespace    https://github.com/Meldo-Megimi/SerienFans/raw/master/main.user.js
// @version      2024-08-03.02
// @description  Sort genre for SerienFans and FilmFans by year of release
// @author       Meldo-Megimi
// @match        https://serienfans.org/genre*
// @match        https://filmfans.org/genre*
// @grant        GM_addStyle
// ==/UserScript==

const stylesheet = `
#sortButtons {
  display: flex;
  align-items: baseline;
}

#sortButtons span {
  margin: 5pt;
}

ul.sorting {
	padding: 0;
	margin-bottom: 10px;
	display: flex;
	flex-wrap: wrap;
	max-height: 50px;
	overflow: hidden;
	gap: 12px;
}

ul.sorting li {
	justify-content: center;
	display: flex;
	height: 36px;
	padding: 0 10px;
	align-items: center;
	flex: 0 1 auto;
}

ul.sorting li.active {
	background: #fff;
	letter-spacing: -.1px;
	color: #000;
	font-weight: 600;
}

ul.sorting li:hover *, ul.sorting li:hover {
	background: #fff;
	color: black;
	cursor: pointer;
}

span.sortOption {
	color: black;
  padding-left: 2pt;
}

span.sortOption.active {
  transform: rotate(180deg);
}
`

const injectStylesheet = () => {
  if (typeof GM_addStyle != "undefined") {
    GM_addStyle(stylesheet);
  } else if (typeof addStyle != "undefined") {
    addStyle(stylesheet);
  } else {
    const stylesheetEl = document.createElement("style");
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
  }
}

const getYear = (row) => {
  var element = row.querySelectorAll("small");
  if (element.length == 0) {
    return 1900;
  }

  return parseInt(element[0].innerText.slice(1, -1));
}

const getTitle = (row) => {
  return row.innerText.toLowerCase();
}

const getSortedList = () => {
  var sortType = document.querySelectorAll("li.sortOption.active")[0].getAttribute("data-id");
  var sortOption = document.querySelectorAll("li.sortOption.active")[0].children[0].classList.contains("active");

  var rows = Array.from(document.querySelectorAll("div .list a"));
  rows.sort(function (a, b) {
    if (sortType == "year") {
      return sortOption ? getYear(a) - getYear(b) : getYear(b) - getYear(a);
    } else {
      var titelA = sortOption ? getTitle(a) : getTitle(b);
      var titelB = sortOption ? getTitle(b) : getTitle(a);

      if (titelA < titelB) {
        return -1;
      }
      if (titelA > titelB) {
        return 1;
      }

      return 0;
    }
  });
  return rows;
}

const sortList = (observer) => {
  observer.disconnect();
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

  observer.observe(document.getElementById("listLeft"), { attributes: false, childList: true, subtree: false });
}

const addSortButtons = () => {
  document.querySelectorAll("ul.actors")[0].insertAdjacentHTML("afterend", `
  <div id="sortButtons">
     <span>Sortierung:</span>
     <ul class="sorting">
        <li class="sortOption active" data-id="year">Jahr<span class="sortOption">&#x25BC;</span></li>
        <li class="sortOption" data-id="titel">Titel<span class="sortOption active">&#x25BC;</span></li>
     </ul>
  </div>`);

  document.querySelectorAll("li.sortOption").forEach((button) => {
    button.addEventListener("click", function (e) {
      var buttonElement = e.target;
      if (buttonElement.localName == "span") {
        buttonElement = buttonElement.parentElement;
      }

      if (buttonElement.classList.contains("active")) {
        buttonElement.children[0].classList.toggle("active");
      } else {
        document.querySelectorAll("li.sortOption").forEach((button) => {
          button.classList.remove("active");
        });
        buttonElement.classList.add("active");
      }

      sortList(leftColumnObserver);
    }, false);
  });
}

const leftColumnObserver = new MutationObserver((mutationList, observer) => {
  sortList(observer);
});

leftColumnObserver.observe(document.getElementById("listLeft"), { attributes: false, childList: true, subtree: false });

injectStylesheet();
addSortButtons();
