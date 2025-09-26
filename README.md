# tree-sitter-jai

Jai grammar for tree-sitter

Very experimental - use the `shenanigans` branch, as that's where all the action
is.

## How far along is this?

I've only put a couple of days into this so far, and Tree Sitter is anything but
intuitive if you've never seen one before. It's even slower going, as I'm trying
to add test cases and highlighting cases as I go - so that when I inevitably
change something, it doesn't break the world for me.

Compared to the scope of the language, this is not very far along. Based on the
size of other Tree Sitter grammars, my estimate would be 50% complete in the
best case, more like 25-30% complete.

However, compared to the small subset of the language I currently use, and my
general style of coding, it's much further along in terms of what I need - which
is nice Neovim highlighting support. I can go to any given how-to or module, and
it looks respectable (but clearly incomplete).

## What's the goal?

I'm not looking to fully define the language, as I think that will take too
long. I'm looking for 80%/20% based on my needs. I'll keep chipping away
piece-by-piece until I can't particularly see any more progress, and I'm not
getting hit with any parse errors in my code.
