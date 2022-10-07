Dropzone.autoDiscover = false;

const init =()=>{
    let dz = new Dropzone("#dropzone" , {
        url: "/" , 
        maxFiles:1,
        addRemoveLinks: true,
        dictDeaultMessage: "Some Message"  ,
        autoProcessQueue : false
    });

    dz.on("addfile" , function(){
        if(dz.files[1] != null){
            dz.removeFile(dz.files[0]);
        }
    });

    dz.on("complete" , function(file){
        let imageData = file.dataURL ; 
        var url = "http://127.0.0.1:5000/classify_image";

        $.post(url , {
            image_data: file.dataURL
        } , function(data , status){
            console.log(data);
            if(!data || data.length == 0){
                $("#resultHolder").hide();
                $("#divClassTable").hide();
                $("#result").show();
                $("#result").html("Can't recognize the face and eyes . ")
                return ;
            }
            let faces = ["gates" , "jack",  "modi" , "musk" , "trump"];
            let match = null ;
            let bestScore = -1 ; 
            for (let i=0 ; i<data.length;++i){
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass> bestScore){
                    match = data[i];
                    bestScore = maxScoreForThisClass ; 
                }
            }
            if (match){
                $("#result").show();
                $("#result").html($(`[name="${match.class}"`).html());
                $("#resultHolder").show();
                $("#divClassTable").show();
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];
                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore); 
                }            
            }
        });
    }) ;

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#divClassTable").hide();

    init();
});
