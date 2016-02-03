
### A brief detour into emacs
Open emacs and it should automatically download the necessary packages.

```shell
emacs
```

This will take about 5 minutes.  There's a lot of software.  This
makes me nervous.  If you didn't build or download `Emacs 25` the
elisp packages won't download and you're emacs will be baroque like a
harpsichord.

You'll want to configure a theme because the default one is ugly, so
hit `M-x`, type `customize-themes` and hit `Enter`.  This brings you
to the themes configuration panel.  Some themes are a security risk,
so it may be wiser to stick with some of the defaults.  Uncheck the
themes you don't want and check the one you do, this save the
configuration by navigating over the button and hitting enter.

I like the `Cyberpunk` theme, which I have to download.  If you need
to download a theme, hit `M-x list-packages` and `Enter`.  This lists
the packages available to download from Melpa.  Now hit `C-s` to begin
`I-search`.  Now, type `cyberpunk` and `Enter` to bring your curser
over the `cyberpunk-theme` line.  Now, hit `?` to see your options for
the list packages screen.  This works for most emacs menus.  Notice,
you mark packages with `i.  So, hit `q` to escape the packages screen.
If you're hovering over the `cyberpunk-theme` line, hit `i` to mark
it, then `x` to download all marked packages.  You'll also need to hit
`y` to accept them.

`Magit` is your best friend.  It's the emacs git package and you can
do anything.  Again, Magit exposes the git command line interface to
you and if you don't know that very well, you can easily learn it with
`Magit`.  You can send emails from `emacs`

If you want to learn Emacs (or Linux) the first thing you need to know
is how to discover information.  If you don't learn this, you're going
to have problems for a long, long time.  For Linux, this means
learning things like how to use `less` commands to search `man` pages.
Every time you hit Google to search StackOverflow, there is a way to
discover that information without the internet that is 20x faster!
Another thing to learn with Linux is where log files are stored and
where configuration files are stored.

For Emacs, this means learning to use Apropos.  If you need to search
for a function, type `C-h a` to open apropos search.  Type the partial
name of the command you're looking for.  `EVERY BUFFER IS TEXT!` so
you can search anywhere with `C-s` to open `I-search.  If you run into
problems on a menu screen, hit `?` to see your options.  You can run
shell commands on `dired` screens, which contain file listings using
`!` and typing the command.

The greatest advantage of Emacs for programming is the REPL.  For
small programs in scripting languages, you can run a repl and
re-evaluate classes on the fly.  It gets a bit more complicated if
you're trying to build a module in python.  There are even greater
advantages to using the REPL if you're building a lisp like clojure
and with clojure, you can even connect to remote REPL's!

With the REPL, you can also dynamically re-evaluate a class and run
it's tests without having to re-evaluate your environment.  For large
frameworks like Ruby on Rails, this translates into MASSIVE TIME
SAVINGS.  But the configuration and learning curve of emacs often
prevents people from getting to that point.

Also, emacs is configured via `elisp`, which is an awesome
introduction to lisp and functional programming.  It's magical.  So by
learning emacs, you're learning to be a better programmer.  But often,
it's better for beginners to just use a common IDE.

Anyways, moving on... (i'll like convert the above to a blog or
something)
