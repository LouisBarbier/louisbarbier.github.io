// I fetch them now so i don't have to do it everytime the function is executed (for maximum efficiency/speed)
const arrayElem = document.getElementById('array');
const meanElem = document.getElementById('mean');
const greaterElem = document.getElementById('greater');

function arrayWork () {
    let array = [];
    let sum = 0;

    for (let i = 0; i < 10; i++) {
        let value = Math.floor(Math.random() * 100);

        array.push(value);
        sum += value;
    }

    let mean = sum / array.length;

    let greater = array.filter(v => v > mean);
    
    console.log('array : ' + array);
    console.log('mean : ' + mean);
    console.log('greater : ' + greater);

    arrayElem.innerText = array.toString();
    meanElem.innerText = mean.toString();
    greaterElem.innerText = greater.toString();
}