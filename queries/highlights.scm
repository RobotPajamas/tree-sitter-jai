; Variables

(identifier) @variable

; Includes

;[
; "import"
;] @keyword.import

(procedure_declaration (identifier) @function)
(call_expression
  procedure: (identifier) @function)
"return" @keyword.return

[
  "("
  ")"
;  "["
;  "]"
  "{"
  "}"
] @punctuation.bracket

(boolean_literal) @boolean
(integer_literal) @number
(float_literal) @number.float
(string_literal) @string

(primitive_type) @type.builtin

[
 (line_comment)
 (block_comment)
] @comment @spell

(if_statement [ "if" "ifx" ] @keyword.conditional
  (condition "then" @keyword.conditional)
  (else_clause "else" @keyword.conditional))

(for_statement "for" @keyword.repeat)
(while_statement "while" @keyword.repeat)

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

