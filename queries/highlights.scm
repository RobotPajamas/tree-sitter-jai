; Constants

(const_declaration 
  name: (identifier) @constant)

; Variables

(identifier) @variable

; Imports

[
 "#import"
] @keyword.import


(import_declaration
  namespace: (identifier) @module
  ; modifier: (identifier) @keyword.modifier ; TODO: Not working
)

(procedure_declaration (identifier) @function)
(call_expression
  procedure: (identifier) @function)
"return" @keyword.return

; Punctuation

[
  "("
  ")"
;  "["
;  "]"
  "{"
  "}"
] @punctuation.bracket

; Literals

(boolean_literal) @boolean
(integer_literal) @number
(float_literal) @number.float
(string_literal) @string

(primitive_type) @type.builtin

[
 (line_comment)
 (block_comment)
] @spell @comment

(if_statement [ "if" "ifx" ] @keyword.conditional
  (condition "then" @keyword.conditional)
  (else_clause "else" @keyword.conditional))

;(directive (identifier)) @keyword.directive

; Assignment operators
[
  "="
  ":="
  "*="
  "/="
  "%="
  "+="
  "-="
  "<<="
  ">>="
  "&="
  "^="
  "|="
] @operator

; Unary/Binary expression operators
[
  "&&"
  "||"
  "&"
  "|"
  "^"
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "<<"
  ">>"
  "+"
  "-"
  "*"
  "/"
  "%"
  "!"
  "~"
] @operator

; Keywords (from Jai_Lexer)

[
  "using"
] @keyword

[
  "for"
  "while"
  "continue"
  "break"
] @keyword.repeat

[
  "if"
  "ifx"
  "then"
  "else"
] @keyword.conditional