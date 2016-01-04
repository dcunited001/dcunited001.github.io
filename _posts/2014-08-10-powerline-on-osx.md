---
title: "Installing Powerline on OSX"
author:
  name: "David Conner"
tags: "powerline localtog bash zsh fish 1337 shell protips python pip homebrew"
---

First we'll need to install `python`, `pip`, and `easy_install`.

### Homebrew and Python

I highly recommend checking out [homebrew's wiki page on python](https://github.com/Homebrew/homebrew/wiki/Homebrew-and-Python),
which offers lots of information on the options offered when building python with homebrew.

The guide I followed used the command `brew install python --universal --framework`, but didn't clarify what these extra options did.
I searched around a bit and found [this article](http://www.thisisthegreenroom.com/2011/installing-python-numpy-scipy-matplotlib-and-ipython-on-lion/),
which explains that `--universal` builds a "universal (32/64 bit) version."  It also explains that the `--framework` option "tells 
it to build as a Framework, which has some downstream niceties."  I'm not sure if these options are still valid for `brew install python`, 
as they weren't documented on the wiki page.  So, I reinstalled without them.

### Installing `Python`, `Pip`, and `EasyInstall`

I started following [this guide](https://gist.github.com/pithyless/1208841) to get Python installed,
but it may be a bit out of date.  I'm not very familiar with the Python ecosystem, but `brew install python` 
seems to install `pip` and `easy_install` as well now.  All I needed to do was run the following commands:

```bash
brew install readline sqlite gdbm
brew install python --universal --framework
```

And I verified with this:

```bash
python --version && la `which python`
# Python 2.7.6 
# /usr/local/bin/python -> ../Cellar/python/2.7.6_1/bin/python

pip --version && la `which pip` 
# pip 1.5.5 
# /usr/local/bin/pip -> ../Cellar/python/2.7.6_1/bin/pip

easy_install --version && la `which easy_install` 
# setuptools 3.6 
# /usr/local/bin/easy_install -> ../Cellar/python/2.7.6_1/bin/easy_install 
```

Then, I configured my environment for `virtualenv`, by adding the following to my `.bashrc`.  Some of these
values will differ for you.

```bash
PATH=${PATH}:/usr/local/share/python
export SITE_PACKAGES=/usr/local/lib/python2.7/site-packages

# setup virtualenv
export WORKON_HOME=$HOME/.virtualenvs
export VIRTUALENVWRAPPER_PYTHON=/usr/local/bin/python2.7
export VIRTUALENVWRAPPER_VIRTUALENV_ARGS='--no-site-packages'
export PIP_VIRTUALENV_BASE=$WORKON_HOME
export PIP_RESPECT_VIRTUALENV=true
if [[ -r /usr/local/bin/virtualenvwrapper.sh ]]; then
    source /usr/local/bin/virtualenvwrapper.sh
else
    echo "WARNING: Can't find virtualenvwrapper.sh"
fi
```

Then, I installed `virtualenv` and `virtualenvwrapper` and tested:

```bash
pip install virtualenv
pip install virtualenvwrapper
```

And I verified with this:

```bash
mkvirtualenv test
rmvirtualenv test
```

`virtualenv` hit a few snags when running its callback scripts, but my zsh setup shows the name
of the active virtualenv profile and that seemed to be working.  I wish I had more time to learn more 
about the python ecosystem, but just haven't had a chance yet.  If I've made a glaring omission, please
drop me a line in the comments!  Thank you!

### Installing and Configuring Powerline 

Installing powerline ended up being much simpler once I read and understood everything.  It's pretty easy: just 
run the `pip install git+git://github.com/Lokaltog/powerline` and boom.  You've got powerline.

Now you need to add some powerline fonts.  So, clone this repo and put it in a safe place, like a lockbox.  I
added it as a git submodule to my dotfiles.  So whenever I'm setting up a new machine and cloning my dotfiles, I
expand the submodules and boom.  All the `powerline-fonts` are there, then I just start double-clicking away! Or
you can also open the Font Book app, hit &#x2318;-O, navigate to the powerline-fonts directory, select it and 
hit enter.

Finally, you need to set up your zsh to load a new prompt.  Powerline includes a base prompt for you.  If you've
added the above `.bashrc` snippet to your zsh profile, you should be able to add `. $SITE_PACKAGES/powerline/bindings/zsh/powerline.zsh`
to the end. 

Now open a fresh terminal and check out your prompt!  It should look something like this.

![Powerline Prompt in ZSH](/img/posts/2014-08-10-powerline-on-osx/zsh-powerline-prompt.png)

Now, navigate to a git repository and you can see the branch on the right, like so:

![Current Branch in ZSH Prompt](/img/posts/2014-08-10-powerline-on-osx/branch-prompt.png)

### Great! Powerline on OSX! 
 
You should now have both Python and Powerline rarin' to go.  I've added a git submodule for my 
[powerline config](https://github.com/dcunited001/dc.files.powerline)
in [dc.files](https://github.com/dcunited001/dc.files) and I'm linking my `~/.config/powerline` here.  In the
powerline submodule, I've set up a custom powerline theme for zsh.  My custom theme includes a battery level indicator
that reads out in hearts.  As in, hearts like Legend of Zelda.  Check it out!

![Legend of Zelda Battery Indicator](/img/posts/2014-08-10-powerline-on-osx/loz-battery-readout.png)

Check the [Configuration](http://powerline.readthedocs.org/en/latest/configuration.html#references) section of the 
Powerline docs.  Specifically, the References pages, which detail themes, colorschemes and how to tweak each option!
Great stuff - make your prompts splash.

Also check out the [plugins](http://powerline.readthedocs.org/en/latest/usage.html#plugins) on the Usage page to see 
how to configure `vim` and `tmux` with a status bar.  Take a look at [this protip](https://coderwall.com/p/trgyrq) to make your 
tmux status bar responsive.  For `emacs`, check out [emacs-powerline](https://github.com/jonathanchu/emacs-powerline) 
and [powerline.el](https://github.com/milkypostman/powerline), which may be available on MELPA.

Richard Guay does a great job of explaining 
[Powerline customizations](http://computers.tutsplus.com/tutorials/getting-spiffy-with-powerline--cms-20740)
for vim/macvim, fish, and zsh.  His blog includes tons of screenshots.  Great resource!