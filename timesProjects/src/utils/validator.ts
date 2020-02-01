export const isDescription = (words:string) => {
    if(typeof words == "string"){
      let tokenizedWords = words.split(" ");
      if(tokenizedWords.length > 255) {
        return false;
      } else if(tokenizedWords.length < 10){
        return false;
      } else {
        true;
      }
    }
  }
