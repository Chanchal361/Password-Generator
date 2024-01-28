const PasswordDisplay = document.querySelector('[PasswordDisplay]')
const copyBtn = document.querySelector('[copyBtn]')
const copyMsg = document.querySelector('[copyMsg]')
const PasswordLength = document.querySelector('[PasswordLength]')
const datalengthSlider = document.querySelector('[data-lengthSlider]')
const lowercase = document.querySelector('#lowercase')
const uppercase = document.querySelector('#uppercase')
const number = document.querySelector('#number')
const symbol = document.querySelector('#symbol')
const allcheckbox = document.querySelectorAll('.check-Box')
const strengthIndicator = document.querySelector('[strengthIndicator]')
const generatePassword = document.querySelector('#generatePassword')
const symbols = '~!@#$%^&*()`_+=-<>?/"}{[]'

let password = ""
let passwordlength = 10;
checkCount = 0;
SliderHandaler()
setIndicatorColor("#ccc");
function SliderHandaler() {
    datalengthSlider.value = passwordlength;
    PasswordLength.innerText = passwordlength;
}

function setIndicatorColor(color) {
    strengthIndicator.style.backgroundColor = color;
    strengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateUpperCase() {
    return String.fromCharCode(randomNumber(65, 91))
}
function generateLowerCase() {
    return String.fromCharCode(randomNumber(97, 123))
}
function generateInteger() {
    return randomNumber(0, 9)
}

function generateSymbol() {
    let Sym = randomNumber(0, symbols.length)
    return symbols.charAt(Sym);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (number.checked) hasNum = true;
    if (symbol.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicatorColor("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordlength >= 6
    ) {
        setIndicatorColor("#ff0");
    } else {
        setIndicatorColor("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(PasswordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}

function PasswordMixed(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function allCheckboxHandle() {
    checkCount = 0;
    allcheckbox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        } 
    });

    if (PasswordLength < checkCount) {
        PasswordLength = checkCount;
        SliderHandaler()
    }

}

allcheckbox.forEach((checkbox) => {
    checkbox.addEventListener('change',allCheckboxHandle);
})

datalengthSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    SliderHandaler();
})

copyBtn.addEventListener('click', () => {
    if (PasswordDisplay.value)
        copyContent();
})

generatePassword.addEventListener('click', () => {
    // if (checkCount == 0) return;

    if ( passwordlength<checkCount) {
         passwordlength=checkCount
        SliderHandaler();
    }
    password = " ";
    let funcArr = [];
    if (uppercase.checked)
        funcArr.push(generateUpperCase);

    if (lowercase.checked)
        funcArr.push(generateLowerCase);

    if (number.checked)
        funcArr.push(generateInteger);

    if (symbol.checked)
        funcArr.push(generateSymbol);
    /// necerary 
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    /// remainaing 
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = randomNumber(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    password = PasswordMixed(Array.from(password));
    PasswordDisplay.value = password;
    calcStrength();
})