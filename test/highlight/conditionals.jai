main :: () {
  if true then false;
  // <- keyword.conditional  
  //      ^ keyword.conditional  

  if true {
  // <- keyword.conditional  
  } else if false {
    // <- keyword.conditional
  } else {
    // <- keyword.conditional
  }

  ifx (true) {
  // <- keyword.conditional
  } else {
    // <- keyword.conditional
  }
}
