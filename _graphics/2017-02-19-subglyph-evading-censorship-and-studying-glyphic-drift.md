---
title: "Subglyph: Evading Censorship And Studying Glyphic Drift"
categories: "graphics"
tags: "graphics linguistics"
headline: "Subglyph It For Great Good"
author:
  name: "David Conner"
excerpt: "
As society gravitates towards virtualized communication tools, we
asymptotically approach 100% of surveillable, indexable conversations.
The difference between a surveillable conversation and an indexable
converstaion is that indexing is cheap and can be automated, whereas
surveilling conversations requires human intelligence."
---

Subglyph is basically a one-way substitution cipher, with a twist:
it's based on homoglyphic similarity and allows one to copy and paste
text that is legible by humans, but unindexible by computers without
preprocessing. This is problematic for text-based data-science. The
ideas behind the as-yet-incomplete machine learning component of
Subglyph could be used to measure linguistic and glyphic "drift"
whereby one could study the components of written languages and the
ways in which they drifted across regions.

## Subglyph for Great Good, Free Beer and Free Internets

#### [Communication Is Corralled Into Surveillable & Indexable Media](#communication-is-corralled-into-surveillable-and-indexable-media)

#### [Governments Need Censorship to be Cheap](#governments-need-censorship-to-be-cheap)

#### [Subglyph Could Never Provide Perfect Secrecy](#subglyph-could-never-provide-perfect-secrecy)

#### [Subglyph is So Simple, A Five Year Old Could Code This](#subglyph-is-so-simple-a-five-year-old-could-code-this)

#### [Staving Off Deletion of Religious Texts](#staving-off-deletion-of-religious-texts)

#### [Machine Learning to Produce Custom Homoglyphic Unicode Dictionaries](#machine-learning-to-produce-custom-homoglypic-unicode-dictionaries)

#### [Generation of Unindexable Text with iOS/Android Keybords](#generation-of-unindexable-text-with-ios-android-keyboards)

#### [For Information Warfare, Subglyph Can Penetrate Balkanized Internets](#for-information-warfare-subglyph-can-penetrate-balkanized-internets)

### Dear Watson, Do You Have A Twinny For The Witnesses?

![Dear Watson, Do You Have A Twinny For The Witnesses](/img/graphics/2017-02-19-subglyph-evading-censorship-and-studying-glyphic-drift/dear-watson-do-you-have-a-twenty-for-the-witnesses.png)

<a name="communication-is-corralled-into-surveillable-and-indexable-media" />

### [Communication Is Corralled Into Surveillable & Indexable Media](#communication-is-corralled-into-surveillable-and-indexable-media)

As society gravitates towards virtualized communication tools, we
asymptotically approach 100% of surveillable, indexable conversations.
The difference between a surveillable conversation and an indexable
converstaion is that indexing is cheap and can be automated, whereas
surveilling conversations requires human intelligence.

<a name="governments-need-censorship-to-be-cheap" />

### [Governments Need Censorship to be Cheap](#governments-need-censorship-to-be-cheap)

Governments want filtering and indexing to be cheap. In cases where
this filters messages from radical organizations like ISIS, that's
fine. In cases where indexing of textual communications helps isolate,
psychologically profile and harass political dissidents, that's not
OK. Increasingly often, we're seeing governments use technology to
psychologically disrupt and sociologically stifle people who have
simply been labelled. Unfairly and invisibly labelling people who are
different invites sociopathic, carnivorous behavior and creates
serious mental health issues.

<a name="subglyph-could-never-provide-perfect-secrecy" />

### [Subglyph Could Never Provide Perfect Secrecy](#subglyph-could-never-provide-perfect-secrecy)

No, Subglyph is not a tool one would hope to use for perfect secrecy,
but one that provides a mask from indexing to prevent automated
newsfeed-based censorship. That is if enough people used it.
Otherwise, it becomes filterable in its similarity to spammy emails.

> Full Disclaimer: I am not a spam lord, nor do I ever plan to be. I
> am, however, passionate in all things linguistic.

<a name="subglyph-is-so-simple-a-five-year-old-could-code-this" />

### [Subglyph is So Simple, A Five Year Old Could Code This](#subglyph-is-so-simple-a-five-year-old-could-code-this)

So far, Subglyph is a simple hand-coded dictionary, with between 5 and
15 possible subsitutions per Latin alphanumeric character. The genius
is that it's about 50 lines of code that could change online
communication if an idea like it took off. It requires the social
momentum of casual use to create an adequate "mask" against
indexing. Sure, there is the "zomg terrorists could use this"
argument, *but that is ludicrous*: have you ever read a spam email?
OK, now calm your alarmism down a notch.

{% highlight javascript %}

  this.glyphIt = function(el, options) {
    var html = el.innerHTML;
    var insideTag = false;
    var insideEncoding = false;

    // memoize htmlTree into shadowDom
    // - notate status of memoization in data-subglyph of tag

    var sg = this;
    var newHTML = _.reduce(html, function (memo,char) {
      var charIsAlphanum = /[a-zA-Z0-9]/.test(char);
      var newChar = char;

      switch (char) {
        // probably not RFC compliant.
        case '<': insideTag = true; break;
        case '>': insideTag = false; break;
        case '&': insideEncoding = true; break;
        case ';': insideEncoding = false; break;
        default:
          if (charIsAlphanum) {
            if (!(insideTag || insideEncoding)) {
              //TODO: fix to sample from dictionary by key
              var dict = Object.keys(sg.dictionary[char]);
              var dictIndex = Math.floor(Math.random() * dict.length);
              newChar = dict[dictIndex];
            }
          }
      }

      return memo + newChar;
    }, "");

    return newHTML;
  };

{% endhighlight %}

<a name="staving-off-deletion-of-religious-texts" />

### [Staving Off Deletion of Religious Texts](#staving-off-deletion-of-religious-texts)

If one wanted to save their religious texts from deletion from the
Internet Archive, they could use Subglyph to encode them before
overlaying them on meme images and, finally, storing them on the
archive. This ensures that the problem of data discovery is
sufficiently hard, but not too hard, as cryptography requires
preservation of a key to reconstitute and can't be serendipitously
rediscovered.

> Another great idea for preserving crucial data: put a USB stick on a
> fucking comet and let it sail out to the Oort Cloud. It would need a
> basic solar-powered faraday cage for protection against ionizing
> radiation.

<a name="machine-learning-to-produce-custom-homoglypic-unicode-dictionaries" />

### [Machine Learning to Produce Custom Homoglyphic Unicode Dictionaries](#machine-learning-to-produce-custom-homoglypic-unicode-dictionaries)

That's just the start. The second, more complicated portion of
Subglyph is about training a machine learning algorithm to produce
custom dictionaries. As this training component of subglyph gets
closer to completion, updates will be made to this page with a
graphical interface for visualizing the training process.

<a name="generation-of-unindexable-text-with-ios-android-keyboards" />

### [Generation of Unindexable Text with iOS/Android Keybords](#generation-of-unindexable-text-with-ios-android-keyboards)

Once the machine learning algorithms are sufficient, Subglyph can be
used to create keyboards with custom homoglyphic dictionaries that
rotate chars out as they've been used. This helps achieve the minimum
social momentum to spur widespread adoption, which forces tech
companies to adapt their products and algorithms to be more friendly
to what was formerly seen as spam text. Meh, it's a mixed bag.

<a name="for-information-warfare-subglyph-can-penetrate-balkanized-internets" />

### [For Information Warfare, Subglyph Can Penetrate Balkanized Internets](#for-information-warfare-subglyph-can-penetrate-balkanized-internets)

If subglyph became commonplace, it could be used so that political
dissidents can access information that would formerly have them
flagged. This usually occurs in countries that flag content providers
that match keywords, which requires fast indexing. Because all warfare
is essentially information warfare, subglyph could be useful ... but
on second thought, this would be a terrible idea because it doesn't
guarantee the safety of the dissidents. However, there may be some
formuation of this idea which works for pushing information into these
areas.
