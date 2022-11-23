var votes = null;
var upclick =null ;
var downclick =null ;
document.querySelector("#btn-roll1").addEventListener ('click', function onCLick(){
    var img1= document.querySelector("#img1");
var img2= document.querySelector("#img2");
  
     if(votes == -1){
       
       img2.src ="/images/view/down.png";
        votes = votes + 2;
     document.querySelector("#likes-text").textContent = votes;
    
     img1.src ="/images/view/upvote.png";
     upclick= upclick + 1;
    }
    else if(upclick > 0 && votes== 1){
            img1.src ="/images/view/up.png";
         votes = votes - 1;
      document.querySelector("#likes-text").textContent =  votes;
     
 
      upclick=0;
     }
     else{
       
        img2.src ="/images/view/down.png";
         votes = votes + 1;
      document.querySelector("#likes-text").textContent = votes;
     
      img1.src ="/images/view/upvote.png";
      upclick= upclick + 1;
     }
});


document.querySelector("#btn-roll2").addEventListener ('click', function onCLick(){
    var img1= document.querySelector("#img1");
var img2= document.querySelector("#img2");
 
    if(votes == 1){
       
        img1.src ="/images/view/up.png";
        votes = votes-2;
    document.querySelector("#likes-text").textContent =  votes;
      
    img2.src ="/images/view/downvote.png";
    downclick= downclick + 1;
    }
    else if(downclick> 0 && votes == -1){
        img2.src ="/images/view/down.png";
         votes = votes + 1;
      document.querySelector("#likes-text").textContent = votes;
      downclick=0;
     }
     else{
       
        img1.src ="/images/view/up.png";
        votes = votes-1;
    document.querySelector("#likes-text").textContent = votes;
      
    img2.src ="/images/view/downvote.png";
    downclick= downclick + 1;
    }
});

