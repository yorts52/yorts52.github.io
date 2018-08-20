const checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};

const buttons = Array.from(document.querySelectorAll('.checklist-item__expand'));
const labels = Array.from(document.querySelectorAll('.checklist-item__title'));

const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
const checkboxesLength = checkboxes.length;

const progress = document.querySelector('.progress__bar');
const counter = document.querySelector('.progress__count');

const reset = document.querySelector('.progress__reset');


// Give descriptive ids & labels to all the checkboxes
function loadIds() {
  for (let i = 0; i < checkboxesLength; i += 1) {
    const compress = s => s.replace(/[ ,.!?;:'-]/g, '');

    // Take the title of each checklist-item and remove punctuation/spaces
    checkboxes[i].id = `${compress(checkboxes[i].nextSibling.nextSibling.innerText).toLowerCase()}`;
    checkboxes[i].nextSibling.setAttribute('for', `${compress(checkboxes[i].nextSibling.nextSibling.innerText).toLowerCase()}`);
  }
}

// Update localstorage with checkbox checked boolean
function updateStorage(el) {
  checkboxValues[el.id] = el.checked;
  localStorage.setItem('checkboxValues', JSON.stringify(checkboxValues));
}


// Update the global counter and scale style of global & section percentage bars
function countChecked() {
  // If the click is from checkbox then only the section percentage bars will be updated, else the
  // click came from window load or reset button and all section percentage bars have to update

  if (this.type === 'checkbox') {
    const thisSection = this.parentNode.parentNode.parentNode;
    const sectionCheckedPercentage = thisSection.querySelectorAll('input:checked').length / thisSection.querySelectorAll('.checklist-item').length;
    thisSection.querySelector('.checklist__percentage-border').style.transform = `scaleX(${sectionCheckedPercentage})`;
  } else {
    Array.from(document.querySelectorAll('.checklist')).forEach((checklist) => {
      const checklistCheckedPercentage = checklist.querySelectorAll('input:checked').length / checklist.querySelectorAll('.checklist-item').length;
      checklist.querySelector('.checklist__percentage-border').style.transform = `scaleX(${checklistCheckedPercentage})`;
    });
  }

  let globalCheckedCounter = 0;
  Array.from(document.querySelectorAll('input:checked')).forEach(() => {
    globalCheckedCounter += 1;
  });

  counter.innerText = `${globalCheckedCounter}/${checkboxesLength}`;
  progress.style.transform = `scaleX(${globalCheckedCounter / checkboxesLength})`;
  checkboxValues.globalCounter = globalCheckedCounter;

  updateStorage(this);
}

// Initialize the global counter and update checkbox checked boolean from localstorage
function loadValues() {
  const initialCounterValue = checkboxValues.globalCounter || 0;
  counter.innerText = `${initialCounterValue}/${checkboxesLength}`;

  Object.keys(checkboxValues).forEach((key) => {
    if (key !== 'globalCounter') document.getElementById(key).checked = checkboxValues[key];
  });

  countChecked();
}


// Toggle the checklist-item__info expansion and checklist-item__expand animation
function toggleExpand() {
  const thisItem = this.parentNode;
  thisItem.querySelector('.line').classList.toggle('closed');
  thisItem.classList.toggle('open');
}

// Uncheck all boxes and reset localstorage
function resetCheckboxes() {
  // Add the wiggle animation class on the reset button
  this.classList.add('progress__reset--pressed');

  checkboxes.forEach(checkbox => checkbox.checked = false);
  Object.keys(checkboxValues).forEach(key => delete checkboxValues[key]);
  countChecked();
}

function shareButtonInit() {
  const twitterButton = document.querySelector('.social-buttons__twitter');
  const facebookButton = document.querySelector('.social-buttons__facebook');

  const left = window.innerWidth / 2 - 600 / 2 + window.screenX;
  const top = window.innerHeight / 2 - 480 / 2 + window.screenY;
  const popParams = `scrollbars=no,width=600,height=480,top=${top},left=${left}`;

  twitterButton.addEventListener('click', function() {
    const newWindow = window.open("https://twitter.com/intent/tweet/?text=A%20better%20web%20launch%20checklist%3A%20persistence%2C%20multiple%20formats%2C%20and%20easy%20to%20contribute%20to%2E&url=https%3A%2F%2Fweblaunchchecklist.com", '', popParams);
    if (window.focus) {
      newWindow.focus();
    }
  });

  facebookButton.addEventListener('click', function() {
    const newWindow = window.open("https://www.facebook.com/dialog/share?app_id=320022855077523&href=https%3A%2F%2Fweblaunchchecklist.com&display=popup&redirect_uri=https%3A%2F%2Fweblaunchchecklist.com&quote=A%20better%20web%20launch%20checklist%3A%20persistence%2C%20multiple%20formats%2C%20and%20easy%20to%20contribute%20to%2E", '', popParams);
    if (window.focus) {
      newWindow.focus();
    }
  });
}


window.onload = function () {
  loadIds();
  loadValues();

  checkboxes.forEach(checkbox => checkbox.addEventListener('click', countChecked));
  buttons.forEach(button => button.addEventListener('click', toggleExpand));
  labels.forEach(label => label.addEventListener('click', toggleExpand));

  reset.addEventListener('click', resetCheckboxes);

  // On animationend remove the wiggle animation class on the reset button
  reset.addEventListener('animationend', function () {
    this.classList.remove('progress__reset--pressed');
  }, false);

  shareButtonInit();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/wlc/sw.js', { scope: '/wlc/' });
  }

  console.info('Designed and Developed by Harris J. Thompson - www.harrisjt.com\nTwitter - www.twitter.com/HarrisJT_\nGitHub - www.github.com/HarrisJT');
};
