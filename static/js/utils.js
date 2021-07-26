function isInRange(val, min, max) {
	return val >= min && val <= max;
}

function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

function urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
}