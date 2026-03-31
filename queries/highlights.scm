; Variables

(identifier) @variable

; Constants - order matter for specificity, this fails if above Variables

(const_declaration 
  name: (identifier) @constant)

; Imports

[
 "#import"
] @keyword.import


(import_declaration
  namespace: (identifier) @module
  ; modifier: (identifier) @keyword.modifier ; TODO: Not working
)

(struct_declaration
  (identifier) @type)

(procedure_declaration (identifier) @function)
(call_expression
  procedure: (identifier) @function)
"return" @keyword.return

; Punctuation

[
  "(" ")"
; "[" "]"
  "{" "}"
] @punctuation.bracket

[
  ";"
] @punctuation.delimiter

; Literals

(boolean_literal) @boolean
(integer_literal) @number
(float_literal) @number.float
(string_literal) @string

(builtin_type) @type.builtin

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

; TODO: Name this
[
":"
] @operator ; Not sure if this is an operator or punctuation

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