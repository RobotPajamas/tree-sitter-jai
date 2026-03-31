"use strict";
/**
 * @file Jai grammar for tree-sitter
 * @author SJ
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// TODO: Review https://en.cppreference.com/w/c/language/operator_precedence.html
// TODO: Review: https://en.cppreference.com/w/cpp/language/operator_precedence.html
// TODO: Review: https://doc.rust-lang.org/reference/expressions.html#expression-precedence
// Copied from: https://raw.githubusercontent.com/tree-sitter/tree-sitter-c/refs/heads/master/grammar.js
// Weakest to Strongest ordering TODO: Flip this to match sites
const PREC = {
  PAREN_DECLARATOR: -10,
  ASSIGNMENT: -2,
  CONDITIONAL: -1,
  DEFAULT: 0,
  LOGICAL_OR: 1,
  LOGICAL_AND: 2,
  BITWISE_OR: 3,
  BITWISE_XOR: 4,
  BITWISE_AND: 5,
  EQUAL: 6,
  RELATIONAL: 7,
  OFFSETOF: 8,
  BITWISE_SHIFT: 9,
  ADD: 10,
  MULTIPLY: 11,
  CAST: 12,
  SIZEOF: 13,
  UNARY: 14,
  CALL: 15,
  FIELD: 16,
  SUBSCRIPT: 17,
};

// TODO: Pull these further down
// const DEC_DIGITS = token(sep1(/[0-9]+/, /_+/));
// const HEX_DIGITS = token(sep1(/[0-9a-fA-F]+/, /_+/));
// const BIN_DIGITS = token(sep1(/[01]+/, /_+/));
// const REAL_EXPONENT = token(seq(/[eE]/, optional(/[+-]/), DEC_DIGITS));

module.exports = grammar({
  name: "jai",

  word: ($) => $.identifier,

  extras: ($) => [
    /\s/,
    $.line_comment,
    $.block_comment,
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    ///////////////////////////////////////
    // Lexical Structure - syntax of tokens
    ///////////////////////////////////////

    identifier: (_) =>
      /(\p{XID_Start}|\$|_|\\u[0-9A-Fa-f]{4}|\\U[0-9A-Fa-f]{8})(\p{XID_Continue}|\$|\\u[0-9A-Fa-f]{4}|\\U[0-9A-Fa-f]{8})*/,

    _comment: ($) =>
      choice(
        $.line_comment,
        $.block_comment,
      ),

    line_comment: (_) => token(seq("//", /.*/)),

    block_comment: (_) =>
      seq(
        "/*",
        /[^*]*\*+([^/*][^*]*\*+)*/,
        "/",
      ),

    _literal: ($) =>
      choice(
        $.boolean_literal,
        $.float_literal,
        $.integer_literal,
        //$.regex_literal,
        $.string_literal,
      ),

    boolean_literal: (_) => choice("true", "false"),

    float_literal: (_) => {
      const digits = repeat1(/[0-9]+_?/);
      return token(seq(
        optional("-"),
        choice(
          /0h[0-9a-fA-F_]+/,
          seq(digits, ".", optional(digits)),
        ),
      ));
    },

    integer_literal: (_) =>
      token(seq(
        optional("-"),
        choice(
          /[0-9][0-9_]*/,
          /0[xX][0-9a-fA-F_]+/,
          /0[bB][01_]+/,
        ),
      )),

    string_literal: ($) =>
      seq(
        '"',
        repeat(choice(
          alias(token.immediate(prec(1, /[^\\"\n]+/)), $.string_content),
          $.escape_sequence,
        )),
        '"',
      ),

    escape_sequence: (_) => token(prec(1, seq("\\", /[^xuU]/))),

    ///////////////////////////////////////
    // Types
    ///////////////////////////////////////

    _type: ($) =>
      choice(
        $.builtin_type,
      ),

    builtin_type: (_) =>
      token(choice(
        "bool",
        "int",
        "float",
        ...[8, 16, 32, 64].map((n) => `u${n}`),
        ...[8, 16, 32, 64].map((n) => `s${n}`),
        ...[32, 64].map((n) => `float${n}`),
        "string",
      )),

    // TODO: Is this a valid case?
    //procedure_type: $ => seq(
    //),
    ////

    _statement: ($) =>
      choice(
        // TODO: Come back and organize these
        $._declaration,
        $._expression_statement,
        $.if_statement,
        $.break_statement,
        $.continue_statement,
        $.while_statement,
        $.for_statement,
      ),

    for_statement: ($) =>
      seq(
        "for",
        optional(field("direction", "<")),
        //optional(field('label', $.identifier)),
        optional(seq(field("label", $.identifier), ":")),
        field("iterable", $._expression),
        field("body", choice($._block, $._statement)),
      ),

    directive: ($) =>
      seq(
        "#",
        $.identifier,
      ),

    while_statement: ($) =>
      seq(
        "while",
        field("condition", $.condition), // TODO: condition includes "then", which while doesn't?
        field("body", choice($._block, $._statement)),
      ),

    break_statement: ($) =>
      seq(
        "break",
        optional($.identifier),
        ";",
      ),
    continue_statement: ($) =>
      seq(
        "continue",
        optional($.identifier),
        ";",
      ),

    if_statement: ($) =>
      prec.right(
        -1,
        seq(
          choice("if", "ifx"),
          field("condition", $.condition),
          field("consequence", choice($._block, $._statement)), // TODO: Might have to generalize "statement" to be anything
          optional(field("alternative", $.else_clause)),
        ),
      ),

    condition: ($) =>
      seq(
        optional("("),
        choice($._expression, $.variable_declaration),
        optional(")"),
        optional("then"),
      ),

    // TODO: Using this as an else-if seems to lead to a deep nesting problem - could a large elseif chain break this?
    else_clause: ($) => seq("else", choice($._block, $._statement)), // TODO: Might have to generalize "statement" to be anything

    _declaration: ($) =>
      choice(
        $.const_declaration,
        $.const_type_declaration,
        $.enum_declaration,
        $.import_declaration,
        $.procedure_declaration,
        $.struct_declaration,
        $.variable_declaration,
      ),

    const_declaration: ($) =>
      seq(
        field("name", $.identifier),
        "::",
        $._expression,
        ";",
      ),

    // TODO: Needed this to disambiguate between proc/imports/const - feels inelegant - maybe revisit if I still care later
    const_type_declaration: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $._type),
        ":",
        $._expression,
        ";",
      ),

    // TODO: Not sure if this makes for the best highlighting - as we want all enum fields to be the same - maybe need a "fields"
    enum_declaration: ($) =>
      seq(
        $.identifier,
        "::",
        "enum",
        optional($._type),
        "{",
        repeat(choice($.const_declaration, seq($.identifier, ";"))),
        "}",
      ),

    import_declaration: ($) =>
      seq(
        optional("using"), // TODO: Using should be a statement, as it has it's own modifiers as well (only/except/etc) and used in multiple places
        optional(seq(field("namespace", $.identifier), "::")),
        "#import",
        optional(seq(",", field("modifier", choice("file", "dir", "string")))), // TODO: Not working in parse
        $.string_literal,
        ";",
      ),

    procedure_declaration: ($) =>
      seq(
        $.identifier,
        "::",
        $.parameters,
        optional($.return_type),
        $._block,
      ),

    parameters: ($) =>
      seq(
        "(",
        optional(commaSep($.parameter)),
        ")",
      ),

    parameter: ($) =>
      seq(
        $.identifier,
        ":",
        $._type,
      ),

    struct_declaration: ($) =>
      seq(
        $.identifier,
        "::",
        "struct",
        "{",
        repeat($._statement), // TODO: Start simple - constrain this later as it makes less sense
        "}",
      ),

    return_type: ($) =>
      seq(
        "->",
        $._type,
      ),

    _block: ($) =>
      seq(
        "{",
        repeat($._statement),
        "}",
      ),

    variable_declaration: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        choice(
          field("type", $._type),
          seq(
            optional(field("type", $._type)),
            "=",
            $._expression,
          ),
        ),
        optional(";"), // TODO: Declarations should be split out from terminated statements I think (while loop)
        // TODO: Alternatively, can call the labeled while condition something else (but have to handle key,val = ...)
      ),

    _expression_statement: ($) =>
      choice(
        $.call_expression, // TODO: Put directly in expression?
        $.return_expression,
        seq($._expression, ";"),
      ),

    _expression: ($) =>
      choice(
        $.range_expression,
        $.identifier,
        $._literal,
        $.assignment_expression,
        $.binary_expression,
        $.unary_expression,
        $.directive,
        $.cast_expression,
      ),

    range_expression: ($) =>
      prec.left(
        9,
        choice(
          seq(
            $._expression,
            "..",
            $._expression,
          ),
          //"..",
        ),
      ),

    call_expression: ($) =>
      seq(
        field("procedure", $.identifier),
        field("arguments", $.arguments),
        optional(";"),
      ),

    arguments: ($) =>
      seq(
        "(",
        commaSep(choice($._expression, $.call_expression)), // TODO: I've really blundered the semi-colons - this should just be "expression"
        ")",
      ),

    cast_expression: ($) =>
      seq(
        "cast",
        optional(seq(",", choice("force", "no_check", "trunc"))),
        "(",
        $._type,
        ")",
        $._expression,
      ),

    return_expression: ($) =>
      seq(
        "return",
        optional($._expression),
        ";",
      ),

    // Pulled from https://raw.githubusercontent.com/tree-sitter/tree-sitter-c/refs/heads/master/grammar.js
    assignment_expression: ($) =>
      prec.right(
        PREC.ASSIGNMENT,
        seq(
          field("left", $._expression), // TODO: This should be a bounded set of expressions
          field(
            "operator",
            choice(
              "=",
              // ":=", // TODO: Should this be here - or under a declaration?
              "*=",
              "/=",
              "%=",
              "+=",
              "-=",
              "<<=",
              ">>=",
              "&=",
              "^=",
              "|=",
            ),
          ),
          field("right", $._expression),
        ),
      ),

    // Pulled from https://raw.githubusercontent.com/tree-sitter/tree-sitter-c/refs/heads/master/grammar.js
    unary_expression: ($) =>
      prec.left(
        PREC.UNARY,
        seq(
          field("operator", choice("!", "~", "-", "+")),
          field("argument", $._expression),
        ),
      ),

    binary_expression: ($) => {
      const table = [
        [PREC.LOGICAL_AND, "&&"],
        [PREC.LOGICAL_OR, "||"],
        [PREC.BITWISE_AND, "&"],
        [PREC.BITWISE_OR, "|"],
        [PREC.BITWISE_XOR, "^"],
        [PREC.EQUAL, choice("==", "!=")],
        [PREC.RELATIONAL, choice("<", "<=", ">", ">=")],
        [PREC.BITWISE_SHIFT, choice("<<", ">>")],
        [PREC.ADD, choice("+", "-")],
        [PREC.MULTIPLY, choice("*", "/", "%")],
      ];

      return choice(
        ...table.map(([precedence, operator]) =>
          prec.left(
            precedence,
            seq(
              field("left", $._expression),
              field("operator", operator),
              field("right", $._expression),
            ),
          )
        ),
      );
    },
  },
});

/**
 * Creates a rule to optionally match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @returns {ChoiceRule}
 */
function commaSep(rule) {
  return optional(commaSep1(rule));
}

/**
 * Creates a rule to match one or more of the rules separated by a comma
 *
 * @param {Rule} rule
 *
 * @returns {SeqRule}
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

// /**
//  * Creates a rule to match one or more of the rules separated by an arbitrary separator
//  *
//  * @param {Rule} rule
//  * @param {String} separator
//  *
//  * @returns {SeqRule}
//  */
// function sep1(rule, separator) {
//   return seq(rule, repeat(seq(separator, rule)));
// }
