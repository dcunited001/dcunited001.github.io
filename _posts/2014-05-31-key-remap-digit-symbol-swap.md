---
title: "Key Remap - The Digit-Symbol Hack"
author:
  name: "David Conner"
tags: "keyboard keyremap keyremap4macbook osx xkb xmodmap protips"
---

### Devs, you going to love this keyboard hack!

If you've spent a lot of time in the shell, you may find yourself wishing to move at the **Speed of Thought**,
yet encumbered by that pesky shift key.  How are you supposed to throw down that *regex*, when you've got
to strain your fingers with alternate shift strokes?  Want to exit VIM using **q!** without hitting shift?
Want to type any strong password without hitting shift?

> ... Well, i guess you do need shift to type caps ... But who types passwords anymore?

# Map your FN Keys to Digits

And now you have an extra row of keys for text entry!  It's *almost* like having **extra fingers**.  Don't
worry about those **Function Keys**, you'll still be able to use those with the Mac FN button.  As for the
**Consumer Keys**, a.k.a. Media Keys, I have a modkey hack you can use to get those back.

# Map your Digits to Symbols

And now you don't have to press shift to type **!@#$%^&*()**!  Suddenly, there's a lot less friction when
typing in the shell.

## Here's my keyboard layout:

> Yep, I have an **Uber** key.  And a **Hyper** key, which is only active where needed: in Terminal and Emacs.

<img src="/img/keyboard-digits-symbols.jpeg" class="img-responsive img-rounded" alt="OSX Keyboard Layout">

> Oh, and I think I just experienced a moment of extacy, as I realized my Hyper Key configuration for GUI Emacs
> is magically working!  Yes, there's a separate configuration required for Hyper in Terminal Emacs and GUI Emacs.
> And the script that mysteriously did nothing in the past is now working.  Ahhh, yeah!

### [Here](https://github.com/dcunited001/dc.files.kbd/blob/master/KeyRemap4Macbook/consumer_to_symbols.xml) is the config I've been using for over a year now

This is a config file for [KeyRemap4MacBook](https://pqrs.org/macosx/keyremap4macbook/),
my absolute **FAVORITE** OSX customization tool.  This is **THE KING** of customizing your Mac's keyboard.
Honestly, no other tool comes close.  Not [XModMap](https://wiki.archlinux.org/index.php/xmodmap).
No, not even Linux's [XKB](https://wiki.archlinux.org/index.php/X_KeyBoard_extension).  AFAIK, XKB cannot
remap simultaneous keypresses.  **IF** anyone can correct me here, plz let me know, as I would be absolutely
blissful to discover this in Linux.

#### What's a Simultaneous Keypress?

You can map **<** and **>** to say, **X+Space** and **,+Space**, which is also a configuration I have set
with KeyRemap.  So when I use two fingers to hit **X** and **Space** within a threshold time limit, **<** is substituted
instead.

> Again, if there's anything like this in *Linux*, please let me know!

This seems like a minor hack, but I really enjoy typing my HTML's like this.  I have simultaneous keypresses
configured for **<** **{** **~** **"** **|** **}** **>** and I find them fun to type.  I wish I had more time to do some
exploring with configs like these.  But alas, I digress...

## The Ultimate Developer's Keyboard!

> Isn't that *Dvorak*?

Well, this hack works with *both* QWERTY *and* DVORAK, when using OSX keyboard layouts.  I also have config samples for XModMap
in Linux, which are in my [dc.files.kbd](https://github.com/dcunited001/dc.files.kbd) repo as well.

### What are you waitin for?

# Get to configurating yer keyboards!
