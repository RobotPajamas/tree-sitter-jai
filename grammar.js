/**
 * @file Jai grammar for tree-sitter
 * @author SJ <suresh@robotpajamas.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "jai",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
