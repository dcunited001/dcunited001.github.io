---
title: "A Less Terrible GPU RNG With WebGL"
categories: "graphics"
tags: ""
headline: ""
excerpt: "Exploration into Random Number Generation with WebGL and ThreeJS"
author:
  name: "David Conner"
---

### Floats 0 to 1

I need to identify the boundaries for floats, since colors are encoded from
one to zero... That way I can xor all the things to my hearts content.

I'll toss out floats that are exactly equal to one because IDGAF.

#### + zero

```
0:00000000 :0000000 00000000 00000000
```

#### < one

```
0:01111110 :1111111 11111111 11111111
```

#### == one

```
0:01111111 :0000000 00000000 00000000
```

#### exclusion mask

```
1:10000001 :0000000 00000000 00000000
```

#### inclusion mask

```
0:01111110 :1111111 11111111 11111111
```

