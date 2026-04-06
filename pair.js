let topIndex = 0;
let bottomIndex = 0;

const tops = [
    "tops/top1.jpg",
    "tops/top2.jpg",
    "tops/top3.jpg"
];

const bottoms = [
    "bottoms/bottom1.jpg",
    "bottoms/bottom2.jpg",
    "bottoms/bottom3.jpg"
];

function nextTop() {
    topIndex = (topIndex + 1) % tops.length;
    document.getElementById("topImage").src = tops[topIndex];
}

function prevTop() {
    topIndex = (topIndex - 1 + tops.length) % tops.length;
    document.getElementById("topImage").src = tops[topIndex];
}

function nextBottom() {
    bottomIndex = (bottomIndex + 1) % bottoms.length;
    document.getElementById("bottomImage").src = bottoms[bottomIndex];
}

function prevBottom() {
    bottomIndex = (bottomIndex - 1 + bottoms.length) % bottoms.length;
    document.getElementById("bottomImage").src = bottoms[bottomIndex];
}