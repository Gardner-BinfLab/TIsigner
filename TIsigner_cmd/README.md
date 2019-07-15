
# TIsigner commandline version
Once you've installed the dependencies, you can enter the following command:
```python3 tisigner.py -h```
This will print a help of all possible commands. 

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

Most arguments are optional and can be skipped. The optimised sequence can be found by:

```opt_seq = my_opt.simulated_anneal(rand_state=None)```

A random state can also be passed by using ```np.random.RandomState(12345)``` where the random number is 12345. This will return the optimised sequence and input sequence with their respective scores and opening energy. If you want the optimised sequence only, you can get it by 

```my_opt.annealed_seq```
