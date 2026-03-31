main :: () {
  while j_loop := j < 2 {
  // <- keyword.repeat    
  //    ^ ???
    while true {
    // <- keyword.repeat
    //    ^ boolean
      break j_loop;
      // <- keyword.repeat
      //    ^ ???
    }
    continue;
    // <- keyword.repeat
  }

  for 1..2 {
  // <- keyword.repeat
    for 3..4 {
    // <- keyword.repeat
      break;
      // <- keyword.repeat
    }
    continue;
    // <- keyword.repeat
  }
}
