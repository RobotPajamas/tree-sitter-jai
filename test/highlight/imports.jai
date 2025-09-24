#import "Basic";
// <- keyword.import
//       ^ string   

Compiler :: #import "Compiler";
// <- module
//          ^ keyword.import
//                   ^ string

using Math :: #import "Math"; // TODO: Is "using" a keyword.modifier?
// <- keyword
//    ^ module
//            ^ keyword.import
//                     ^ string

File :: #import,file "files/file.jai"; // TODO: //        keyword.modifier and .special.path
// <- module
//      ^ keyword.import
//                    ^ string

Dir :: #import,dir "files";
#import,dir "examples"; // TODO: //        keyword.modifier and .special.path
// <- keyword.import
//           ^ string

#import,string "x :: 2"; // TODO: //        keyword.modifier
// <- keyword.import
//              ^ string
