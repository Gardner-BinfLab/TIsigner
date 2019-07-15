
# TIsigner commandline version
Once you've installed the dependencies, you can enter the following command:

```python3 tisigner.py -h```

This will print a help of all possible commands. 
```
usage: TIsigner [-h] [-v] -s SEQUENCE [-o OUTPUT] [-c CODONS] [-u UTR]
                [-t HOST] [-n NITER] [-r RESULT] [-e TARGETEXPRESSION]
                [-f FILTER] [-m] [-d SEED]

Translation Initiation coding region deSIGNER.

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         Show program's version number and exit.
  -s SEQUENCE, --sequence SEQUENCE
                        Input sequence
  -o OUTPUT, --output OUTPUT
                        Output file name.
  -c CODONS, --codons CODONS
                        Number of codons after start codon to consider for
                        substitution. Pass "A" for full length substitution.
  -u UTR, --UTR UTR     5'UTR. Default is pET21_NSEG. Min length is 71
                        nucleotides.
  -t HOST, --host HOST  The sequence will be optimised for this host.Choices
                        are ecoli or yeast. Default ecoli.
  -n NITER, --niter NITER
                        Number of iterations for simulated annealing Default
                        50.
  -r RESULT, --result RESULT
                        Number of result sequence to generate before selecting
                        the top result. Default 10. Max 50.
  -e TARGETEXPRESSION, --targetexpression TARGETEXPRESSION
                        Target expression score to acheive in range 5(low) to
                        100(high). The target may or maynot be exactly reached
                        due to other parameters. This feature applies to host
                        Ecoli with pET21 promoter only.
  -f FILTER, --filter FILTER
                        Sites to filter. Filters forward and reverse
                        complements of AarI, BsaI, BsmBI by default.
  -m, --termcheck       Pass this arg if terminators should be checked.
  -d SEED, --seed SEED  Random number seed for algorithm.

Bikash<bikash.bhandari@postgrad.otago.ac.nz> Lim<chunshen.lim@otago.ac.nz>
Gardner-Binflab (2019)
```

An example use:

```python3 tisigner.py -s ATGAAGAAATCTCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCT```
```TCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG```

This will optimise the sequence for *Escherichia coli* with T7lac promoter by doing a synonymous subsitution on maximum of initial 9 codons only. The output is exported to results folder.


 - The output file is a ```.csv``` with type of sequence and properties. ```Selected``` is the sequence considered as best matching to input parameters. ```Optimised``` are other solutions close to the selected sequences. Mismatching nucleotides are printed in lowercase letters.
 
    | Type | Sequence | Opening energy | Score | Mismatches|
    | ------ | ------ | ------ | ------ | ------ |
    | Input | ... | ... | ... | ... |
    | Selected | ... | ... | ... | ... |
    | Optimised | ... | ... | ... | ... |
    | Optimised | ... | ... | ... | ... |
    | ... | ... | ... | ... | ... |
    
If you passed the argument to check terminators, hits and their respective E values are also printed in exported file. 
    
# Using TIsigner in your program
TIsigner is written using object oriented programming principles and allows easy inclusion to your scripts. You just need to copy libs folder to appropriate destination. Then you can import Optimiser class as follows:

```from libs.functions import Optimiser```

You can now instantiate Optimiser class with appropriate parameters:

```my_opt = functions.Optimiser(seq, host, ncodons, utr, niter, threshold, plfold_args, rms_sites)```

Most arguments are optional and can be skipped. The skipped parameters will default to parameters for experiments with *E. coli* and T7lac promoter. The optimised sequence can be found by running simulated annealing:

```opt_seq = my_opt.simulated_anneal()```

This will return a tuple of optimised sequence, its opening energy, posterior probability of being expressed and input sequence, its opening energy and posterior probability of being expressed. Posterior probability lies between 0.49 and 0.70. 
```
('ATGAAAAAAAGCCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG',
 11.66788,
 0.6223835762258048,
 'ATGAAGAAATCTCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG',
 14.01474,
 0.5641493557136965)
 ```

A random state can also be passed to ```simulated_anneal()``` using ```np.random.RandomState(12345)``` where the random number is 12345. This will return the optimised sequence and input sequence with their respective scores and opening energy. If you want the optimised sequence only, you can get it as (make sure you run ```simulated_anneal()``` once):

```
my_opt.annealed_seq
('ATGAAAAAAAGCCTCTCGACCTCTGCTCGCCTCGAGGGAGGACTATCTATCTATCTATCTATCTTCGGCGGACGGACTACCATCGCATTACGGGGCTACGACGGACTCGATCTACTATCTATCTACTTCTAG',
 11.66788)
```
