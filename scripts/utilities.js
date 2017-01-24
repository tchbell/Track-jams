var forEach = function (array, callback) {
    for(var i=0; i<array.length; i++){
    callback(array[i])
    }
};

var animatePoint = function (point) {
         point.style.opacity = 1;
         point.style.transform = "scaleX(1) translateY(0)";
         point.style.msTransform = "scaleX(1) translateY(0)";
         point.style.WebkitTransform = "scaleX(1) translateY(0)";
}

forEach(pointsArray, animatePoint);