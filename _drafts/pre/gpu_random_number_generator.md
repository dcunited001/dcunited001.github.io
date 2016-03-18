GPU Random Number Generation

grnd()

in_matrix
- can either viewed as rows by columns or a vector of length (1 x r*c)
- size(in_matrix) = [r * c] * size(element) 

random_seed_matrix
- just one size, fairly large.  e.g. [1024 x 1024]
- this is seeded with truly random numbers

round_conv() -> a convolution or confusion operation
- this operates similar to the s-box's from DES/3DES
  - numbers are just permuted around and xor'd with other randoms
- the pairings/groupings for these s-box like operations 
  - are be determined by the state of bits in random_seed
- and in each round a nonce-like number is determined by xoring all the numbers in the matrix
  - this acts as the random_seed for the next round

random_seed
- a user provided 64-bit random seed
- random seed determines how numbers are combined in the s-boxes





